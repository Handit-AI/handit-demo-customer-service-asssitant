/**
 * Pinecone Knowledge Base Initialization Script
 * @module scripts/initPinecone
 * @requires @pinecone-database/pinecone
 * @requires @langchain/openai
 * @requires dotenv
 * @requires ../config/pinecone
 * @requires ../utils/textProcessor
 * 
 * This script initializes the Pinecone vector database with sample customer service data.
 * It processes documents into chunks, generates embeddings, and stores them in Pinecone.
 * 
 * Process flow:
 * 1. Initialize Pinecone client
 * 2. Create embeddings using OpenAI
 * 3. Process documents into chunks
 * 4. Store vectors in Pinecone with metadata
 */

import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { sampleKnowledgeBase } from '../config/pinecone.js';
import { TextProcessor } from '../utils/textProcessor.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initializes the knowledge base in Pinecone
 * @async
 * @function initializeKnowledgeBase
 * @throws {Error} If initialization fails
 * @returns {Promise<void>}
 * 
 * @example
 * // Initialize the knowledge base
 * await initializeKnowledgeBase();
 */
async function initializeKnowledgeBase() {
    try {
        console.log('🚀 Initializing Pinecone...');
        const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const namespace = pc.index(process.env.PINECONE_INDEX).namespace("customer-service-kb");
        
        console.log('🔄 Creating embeddings...');
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY
        });

        console.log('📝 Processing and adding documents to knowledge base...');
        for (const document of sampleKnowledgeBase) {
            // Process document into chunks
            const processedChunks = await TextProcessor.processDocument(document);
            
            console.log(`✂️ Processing document with ${processedChunks.length} chunks...`);
            
            // Prepare records for batch upsert
            const records = await Promise.all(processedChunks.map(async (chunk, index) => {
                const embedding = await embeddings.embedQuery(chunk.text);
                return {
                    id: `${Date.now()}-${index}`,
                    values: embedding,
                    metadata: {
                        text: chunk.text,
                        ...chunk.metadata
                    }
                };
            }));

            // Upsert records in batches
            await namespace.upsert(records);
        }

        console.log('✅ Knowledge base initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing knowledge base:', error);
        process.exit(1);
    }
}

// Run the initialization
initializeKnowledgeBase(); 