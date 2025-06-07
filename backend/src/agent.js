import { ChatOpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { initializePinecone } from './config/pinecone.js';
import dotenv from 'dotenv';
import { startTracing, trackNode, endTracing, fetchOptimizedPrompt } from '@handit.ai/node'
import '../handitService.js';  // Importar la configuración de Handit

dotenv.config();

/**
 * CustomerServiceAgent class for processing customer service requests
 * 
 * This agent implements a complete workflow for handling customer service requests:
 * 1. Intent Classification: Determines the type of customer request
 * 2. Knowledge Base Search: Retrieves relevant information from Pinecone
 * 3. Response Generation: Creates appropriate responses based on context
 * 
 * @class CustomerServiceAgent
 */

class CustomerServiceAgent {
    /**
     * Creates an instance of CustomerServiceAgent.
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
    async classifyIntent(userMessage, executionId) {
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
            // Fetch optimized prompt from Handit
            const optimizedPrompt = await fetchOptimizedPrompt({
                modelId: 'classifyIntent',
            });

            console.log('🔍 Optimized Prompt:', optimizedPrompt);

            // Use optimized prompt if available, otherwise use the original prompt
            const bestPrompt = optimizedPrompt !== null && optimizedPrompt !== undefined ? optimizedPrompt : prompt;

            // Structure the messages for better control
            const messages = [
                {
                    role: "system",
                    content: bestPrompt
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

                // Track the intent classification operation with Handit
                await trackNode({
                    input: messages, // The input to this operation  
                    output: parsedResponse, // The output of this operation
                    nodeName: 'classifyIntent', // Unique identifier for this operation
                    agentName: 'customer_service_agent', // Name of this AI Application
                    nodeType: 'llm', // Indicates this is a LLM operation
                    executionId // Links this operation to the current trace session
                });

                return parsedResponse;
            } catch (parseError) {
                console.error('❌ Error parsing LLM response:', parseError);
                console.error('Raw response:', response.content);
                // Track the error with Handit
                await trackNode({
                    input: { prompt: prompt }, // The input to this operation
                    output: parseError, // The output of this operation
                    nodeName: 'classifyIntent', // Unique identifier for this operation
                    agentName: 'customer_service_agent', // Name of this AI Application
                    nodeType: 'llm', // Indicates this is a tool operation
                    executionId // Links this operation to the current trace session
                });
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
    async searchKnowledgeBase(intent, executionId) {
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

            // Track the knowledge base search operation with Handit
            await trackNode({
                input: intent, // The input to this operation
                output: searchResults, // The output of this operation
                nodeName: 'searchKnowledgeBase', // Unique identifier for this operation
                agentName: 'customer_service_agent', // Name of this AI Application
                nodeType: 'tool', // Indicates this is a tool operation
                executionId // Links this operation to the current trace session
            });

            return searchResults;
        } catch (error) {
            console.error('❌ Error searching knowledge base:', error);
            // Track the error with Handit
            await trackNode({
                input: intent, // The input to this operation
                output: error, // The output of this operation
                nodeName: 'searchKnowledgeBase', // Unique identifier for this operation
                agentName: 'customer_service_agent', // Name of this AI Application
                nodeType: 'tool', // Indicates this is a tool operation
                executionId // Links this operation to the current trace session
            });
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
    async generateResponse(context, executionId) {
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
            // Fetch optimized prompt from Handit
            const optimizedPrompt = await fetchOptimizedPrompt({
                modelId: 'generateResponse',
            });

            console.log('🔍 Optimized Prompt:', optimizedPrompt);

            // Use optimized prompt if available, otherwise use the original prompt
            const bestPrompt = optimizedPrompt !== null && optimizedPrompt !== undefined ? optimizedPrompt : prompt;

            // Structure the messages for better control
            const messages = [
                {
                    role: "system",
                    content: bestPrompt
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

            // Track the response generation operation with Handit
            await trackNode({
                input: messages, // The input to this operation
                output: parsedResponse, // The output of this operation
                nodeName: 'generateResponse', // Unique identifier for this operation
                agentName: 'customer_service_agent', // Name of this AI Application
                nodeType: 'llm', // Indicates this is a LLM operation
                executionId // Links this operation to the current trace session
            });

            return parsedResponse;

        } catch (error) {
            console.error('❌ Error generating response:', error);
            // Track the error with Handit
            await trackNode({
                input: { prompt: prompt }, // The input to this operation
                output: error, // The output of this operation
                nodeName: 'generateResponse', // Unique identifier for this operation
                agentName: 'customer_service_agent', // Name of this AI Application
                nodeType: 'llm', // Indicates this is a tool operation
                executionId // Links this operation to the current trace session
            });
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
    async processCustomerRequest(userMessage, executionId) {
        try {

            // Track processCustomerRequest operation with Handit
            await trackNode({
                input: { userMessage: userMessage }, // The input to this operation
                nodeName: 'processCustomerRequest', // Unique identifier for this operation
                agentName: 'customer_service_agent', // Name of this AI Application
                nodeType: 'tool', // Indicates this is a tool operation
                executionId // Links this operation to the current trace session
            });

            // Step 1: Classify the intent of the user's message
            const intent = await this.classifyIntent(userMessage, executionId);
            console.log('🎯 Intent classified:', intent);

            // Step 2: Search knowledge base for relevant information
            const context = await this.searchKnowledgeBase(intent, executionId);
            console.log('🔍 Knowledge base search results:', context);

            // Step 3: Generate appropriate response using context
            const response = await this.generateResponse(context, executionId);
            console.log('💬 Generated response:', response);

            return {
                response,
                intent
            };

        } catch (error) {
            console.error('❌ Error processing request:', error);
            // Track the error with Handit
            await trackNode({
                input: { userMessage: userMessage }, // The input to this operation
                output: error, // The output of this operation
                nodeName: 'processCustomerRequest', // Unique identifier for this operation
                agentName: 'customer_service_agent', // Name of this AI Application
                nodeType: 'tool', // Indicates this is a tool operation
                executionId // Links this operation to the current trace session
            });
            throw error;
        }
    }
}

/**
 * Example usage of the CustomerServiceAgent
 * 
 * @async
 * @function main
 * @param {string} userMessage - The message from the user to process
 * @throws {Error} If agent initialization or request processing fails
 */
async function processRequestVersion2(userMessage) {
    let tracingResponse = null;
    try {
        // Verify Handit API key is configured
        if (!process.env.HANDIT_API_KEY) {
            throw new Error('HANDIT_API_KEY no está configurada en las variables de entorno');
        }

        // Start tracing session with Handit
        tracingResponse = await startTracing({
            agentName: 'customer_service_agent' // Name of this AI Application
        });

        console.log('🔍 Tracing Response:', tracingResponse);
        const executionId = tracingResponse.executionId; // The execution ID for this trace session
        console.log('🔍 Execution ID:', executionId);

        // Initialize agent and vector store
        const agent = new CustomerServiceAgent();
        await agent.initializePinecone();

        // Process the user's request
        const result = await agent.processCustomerRequest(
            userMessage,
            executionId
        );

        console.log('✨ Final Result:', result);

        // End tracing session if it was started
        if (tracingResponse && executionId) {
            // End the trace session
            await endTracing({
                executionId: executionId, // The execution ID for this trace session
                agentName: 'customer_service_agent' // Name of this AI Application
            });
            console.log('✅ Trace ended successfully');
        }

        return result;
    } catch (error) {
        console.error('❌ Error in main:', error);
        // Ensure tracing session is ended even if there's an error
        if (tracingResponse?.executionId) {
            try {
                // End the trace session
                await endTracing({
                    executionId: tracingResponse.executionId, // The execution ID for this trace session
                    agentName: 'customer_service_agent' // Name of this AI Application
                });
                console.log('✅ Trace ended successfully');
            } catch (endError) {
                console.error('❌ Error ending trace:', endError);
            }
        }
        throw error;
    }
}

export { processRequestVersion2 }; 