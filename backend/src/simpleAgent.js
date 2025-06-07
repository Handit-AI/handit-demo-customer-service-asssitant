import { ChatOpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { initializePinecone } from './config/pinecone.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * SimpleCustomerServiceAgent class for processing customer service requests
 * 
 * This is the STANDARD implementation without Handit optimization.
 * It implements a basic workflow for handling customer service requests:
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
        // Initialize LLM 
        this.llm = new ChatOpenAI({
            modelName: 'gpt-4',  // Using GPT-4 model
            temperature: 0.4,    // Lower temperature for more focused responses
            openAIApiKey: process.env.OPENAI_API_KEY  // API key from environment variables
        });

        // Initialize embeddings service for vector operations
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
            // Initialize Pinecone client and get index reference
            const { index } = await initializePinecone();
            this.index = index;
            // Create/get namespace for customer service knowledge base
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
        // Define the prompt for intent classification
        const prompt = `
        Classify this customer message into categories:
        - support_request
        - billing_inquiry  
        - product_question
        - complaint
        
        IMPORTANT: You must respond ONLY with a valid JSON object, nothing else.

        Customer Message: ${userMessage}
        
        Return JSON:
        {
            "userMessage": "${userMessage}",
            "intent": "category",
            "confidence": 0.95
        }
        `;

        try {
            // Structure the messages for better control
            const messages = [
                {
                    role: "system",
                    content: prompt
                },
                {
                    role: "user",
                    content: `Customer Message: ${userMessage}`
                }
            ];

            // Get response from LLM with structured messages
            const response = await this.llm.invoke(messages);

            // Clean the response by removing any non-JSON content
            const cleanedResponse = response.content.trim().replace(/^[^{]*/, '').replace(/[^}]*$/, '');

            try {
                // Parse the cleaned response into JSON
                const parsedResponse = JSON.parse(cleanedResponse);

                // Validate that all required fields are present
                if (!parsedResponse.intent || !parsedResponse.confidence || !parsedResponse.userMessage) {
                    throw new Error('Invalid response structure');
                }

                return parsedResponse;
            } catch (parseError) {
                console.error('❌ Error parsing LLM response:', parseError);
                console.error('Raw response:', response.content);
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
            // Convert user message to vector embedding for similarity search
            const queryEmbedding = await this.embeddings.embedQuery(intent.userMessage);

            // Search Pinecone vector store for similar documents
            const results = await this.namespace.query({
                vector: queryEmbedding,
                topK: 3,  // Get top 3 most relevant results
                includeMetadata: true  // Include document metadata in results
            });

            // Format search results
            const searchResults = {
                results: results.matches.map(match => ({
                    pageContent: match.metadata.text,
                    metadata: match.metadata
                })),
                count: results.matches.length,
                intent
            };

            return searchResults;
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
     * @returns {Promise<Object>} Object containing the response
     * @throws {Error} If response generation fails
     */
    async generateResponse(context) {
        // Define prompt for response generation
        const prompt = `
        Generate a customer service response.
        
        Question: ${context.intent.userMessage}
        Intent: ${context.intent.intent}
        Knowledge: ${JSON.stringify(context.results, null, 2)}
        
        Use this information to help the customer.
        
        Response format:
        {
            "response": "helpful response here"
        }
        `;

        try {
            // Structure the messages for better control
            const messages = [
                {
                    role: "system",
                    content: prompt
                },
                {
                    role: "user",
                    content: `Customer Message: ${context.intent.userMessage}`
                }
            ];

            // Get response from LLM with structured messages
            const response = await this.llm.invoke(messages);

            // Clean and parse the response
            const cleanedResponse = response.content.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
            const parsedResponse = JSON.parse(cleanedResponse);

            return parsedResponse;

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
     * @returns {Promise<Object>} Object containing the response, intent, and user ID
     * @throws {Error} If any step in the process fails
     */
    async processCustomerRequest(userMessage) {
        try {
            // Step 1: Classify the intent of the user's message
            const intent = await this.classifyIntent(userMessage);
            console.log('🎯 Intent classified:', intent);

            // Step 2: Search knowledge base for relevant information
            const context = await this.searchKnowledgeBase(intent);
            console.log('🔍 Knowledge base search results:', context);

            // Step 3: Generate appropriate response using context
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
 * Example usage of the SimpleCustomerServiceAgent
 * 
 * @async
 * @function main
 * @param {string} userMessage - The message from the user to process
 * @throws {Error} If agent initialization or request processing fails
 */
async function processRequest(userMessage) {
    try {
        // Initialize agent and vector store
        const agent = new SimpleCustomerServiceAgent();
        await agent.initializePinecone();

        // Process the user's request
        const result = await agent.processCustomerRequest(userMessage);

        console.log('✨ Final Result:', result);
        return result;
    } catch (error) {
        console.error('❌ Error in main:', error);
        throw error;
    }
}

export { processRequest }; 