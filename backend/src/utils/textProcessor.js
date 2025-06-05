/**
 * Text Processing Utility Module
 * @module utils/textProcessor
 * @requires langchain/text_splitter
 */

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

/**
 * Utility class for processing and chunking text for vector storage
 * @class TextProcessor
 */
export class TextProcessor {
    /**
     * Split text into chunks with overlap for better context preservation
     * @static
     * @async
     * @param {string} text - The text content to split
     * @param {Object} [options={}] - Chunking options
     * @param {number} [options.chunkSize=1000] - Size of each chunk in characters
     * @param {number} [options.chunkOverlap=200] - Number of characters to overlap between chunks
     * @returns {Promise<string[]>} Array of text chunks
     * 
     * @example
     * const chunks = await TextProcessor.splitIntoChunks("Long text content", {
     *   chunkSize: 500,
     *   chunkOverlap: 100
     * });
     */
    static async splitIntoChunks(text, options = {}) {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: options.chunkSize || 1000,
            chunkOverlap: options.chunkOverlap || 200,
            separators: ["\n\n", "\n", ".", "!", "?", ",", " ", ""]
        });

        return await splitter.splitText(text);
    }

    /**
     * Process a document into chunks with metadata
     * @static
     * @async
     * @param {Object} document - The document to process
     * @param {string} document.text - The document text content
     * @param {Object} document.metadata - The document metadata
     * @returns {Promise<Array<{text: string, metadata: Object}>} Array of processed chunks with metadata
     * 
     * @example
     * const processedDoc = await TextProcessor.processDocument({
     *   text: "Document content",
     *   metadata: { category: "support", topic: "billing" }
     * });
     */
    static async processDocument(document) {
        const chunks = await this.splitIntoChunks(document.text);
        
        return chunks.map((chunk, index) => ({
            text: chunk,
            metadata: {
                ...document.metadata,
                chunkIndex: index,
                totalChunks: chunks.length
            }
        }));
    }
} 