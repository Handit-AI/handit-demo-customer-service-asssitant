import { ChatOpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { initializePinecone } from './config/pinecone.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * SimpleCustomerServiceAgent class for processing customer service requests
 * A simplified version without tracing/monitoring
 * 
 * This agent implements a complete workflow for handling customer service requests:
 * 1. Intent Classification: Determines the type of customer request
 * 2. Knowledge Base Search: Retrieves relevant information from Pinecone
 * 3. Response Generation: Creates appropriate responses based on context
 * 
 * @class SimpleCustomerServiceAgent
 */
class SimpleCustomerServiceAgent {
    /**
     * Creates an instance of SimpleCustomerServiceAgent.
     * Initializes the LLM and embeddings for processing requests.
     * 
     * @constructor
     * @throws {Error} If required environment variables are missing
     */
    constructor() {
        // Initialize LLM for intent classification and response generation
        this.llm = new ChatOpenAI({
            modelName: 'gpt-4',
            temperature: 0.4,
            openAIApiKey: process.env.OPENAI_API_KEY
        });

        // Initialize embeddings
        this.embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY
        });
    }

    /**
     * Initializes the Pinecone client and vector store
     * 
     * @async
     * @method initializePinecone
     * @throws {Error} If Pinecone initialization fails
     * @returns {Promise<void>}
     */
    async initializePinecone() {
        try {
            const { index } = await initializePinecone();
            this.index = index;
            this.namespace = index.namespace("customer-service-kb");
        } catch (error) {
            console.error('❌ Error initializing vector store:', error);
            throw error;
        }
    }

    /**
     * Classifies the intent of a customer message
     * 
     * @async
     * @method classifyIntent
     * @param {string} userMessage - The customer's message to classify
     * @returns {Promise<Object>} Object containing intent and confidence
     * @throws {Error} If classification fails
     */
    async classifyIntent(userMessage) {
        const prompt = `
        You are a customer service intent classifier. Your task is to classify the following customer message into one of these categories:
        - support_request
        - billing_inquiry
        - product_question
        - complaint

        IMPORTANT: You must respond ONLY with a valid JSON object, nothing else.
        
        Message: ${userMessage}
        
        Expected JSON format:
        {
            "userMessage": "${userMessage}",
            "intent": "category",
            "confidence": 0.95
        }
        `;

        try {
            const response = await this.llm.predict(prompt);
            
            // Clean the response to ensure it's valid JSON
            const cleanedResponse = response.trim().replace(/^[^{]*/, '').replace(/[^}]*$/, '');
            
            try {
                const parsedResponse = JSON.parse(cleanedResponse);
                
                // Validate the response structure
                if (!parsedResponse.intent || !parsedResponse.confidence || !parsedResponse.userMessage) {
                    throw new Error('Invalid response structure');
                }

                return parsedResponse;
            } catch (parseError) {
                console.error('❌ Error parsing LLM response:', parseError);
                console.error('Raw response:', response);
                throw new Error('Failed to parse LLM response as JSON');
            }
        } catch (error) {
            console.error('❌ Error classifying intent:', error);
            throw error;
        }
    }

    /**
     * Searches the knowledge base for relevant information
     * 
     * @async
     * @method searchKnowledgeBase
     * @param {Object} intent - The classified intent object
     * @param {string} intent.intent - The intent category
     * @param {number} intent.confidence - The confidence score
     * @returns {Promise<Object>} Object containing search results and metadata
     * @throws {Error} If search fails
     */
    async searchKnowledgeBase(intent) {
        try {
            // Generate embedding for the query
            const queryEmbedding = await this.embeddings.embedQuery(intent.userMessage);

            // Search vector store for relevant documents
            const results = await this.namespace.query({
                vector: queryEmbedding,
                topK: 3,
                includeMetadata: true
            });

            return {
                results: results.matches.map(match => ({
                    pageContent: match.metadata.text,
                    metadata: match.metadata
                })),
                count: results.matches.length,
                intent
            };
        } catch (error) {
            console.error('❌ Error searching knowledge base:', error);
            throw error;
        }
    }

    /**
     * Generates a response based on the context and intent
     * 
     * @async
     * @method generateResponse
     * @param {Object} context - The context object from knowledge search
     * @param {Array} context.results - The search results
     * @param {Object} context.intent - The classified intent
     * @returns {Promise<Object>} Object containing the response and token usage
     * @throws {Error} If response generation fails
     */
    async generateResponse(context) {
        const prompt = `
        Generate a helpful customer service response based on:
        
        User Message: ${context.intent.userMessage}
        Intent: ${context.intent.intent}
        Confidence: ${context.intent.confidence}
        Knowledge: ${JSON.stringify(context.results, null, 2)}
        
        Respond in JSON format:
        {
            "response": "your response here"
        }
        `;

        try {
            // Get input tokens
            const inputTokens = await this.llm.getNumTokens(prompt);

            // Generate response
            const response = await this.llm.predict(prompt);

            const cleanedResponse = response.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
            const parsedResponse = JSON.parse(cleanedResponse);

            // Get output tokens
            const outputTokens = await this.llm.getNumTokens(response);

            return {
                ...parsedResponse,
                tokenUsage: {
                    promptTokens: inputTokens,
                    completionTokens: outputTokens,
                    totalTokens: inputTokens + outputTokens
                }
            };
        } catch (error) {
            console.error('❌ Error generating response:', error);
            throw error;
        }
    }

    /**
     * Processes a complete customer service request
     * 
     * @async
     * @method processCustomerRequest
     * @param {string} userMessage - The customer's message
     * @returns {Promise<Object>} Object containing the response and intent
     * @throws {Error} If any step in the process fails
     */
    async processCustomerRequest(userMessage) {
        try {
            // Step 1: Classify intent
            const intent = await this.classifyIntent(userMessage);
            console.log('🎯 Intent classified:', intent);

            // Step 2: Search knowledge base
            const context = await this.searchKnowledgeBase(intent);
            console.log('🔍 Knowledge base search results:', context);

            // Step 3: Generate response
            const response = await this.generateResponse(context);
            console.log('💬 Generated response:', response);

            return {
                response,
                intent
            };
        } catch (error) {
            console.error('❌ Error processing request:', error);
            throw error;
        }
    }
}

/**
 * Process a customer service request using the simple agent
 * 
 * @async
 * @function processSimpleRequest
 * @param {string} userMessage - The message from the user to process
 * @returns {Promise<Object>} The processed response
 * @throws {Error} If agent initialization or request processing fails
 */
async function processSimpleRequest(userMessage) {
    try {
        const agent = new SimpleCustomerServiceAgent();
        await agent.initializePinecone();
        return await agent.processCustomerRequest(userMessage);
    } catch (error) {
        console.error('❌ Error in processSimpleRequest:', error);
        throw error;
    }
}

export { SimpleCustomerServiceAgent, processSimpleRequest }; 