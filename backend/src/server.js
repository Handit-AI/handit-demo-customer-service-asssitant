/**
 * Express Server Configuration
 * @module server
 * @requires express
 * @requires cors
 * @requires morgan
 * @requires dotenv
 * @requires ./agent
 */

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { main } from './agent.js';
import { processSimpleRequest } from './simpleAgent.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Express application instance
 * @type {express.Application}
 */
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/**
 * Process a customer service chat request with Handit tracing
 * @route POST /api/chat
 * @param {Object} req.body.message - The customer's message
 * @returns {Object} Response object containing status and data
 * @throws {400} If message is missing
 * @throws {500} If internal server error occurs
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ 
                error: 'Message is required' 
            });
        }

        // Call main function with the user message
        const result = await main(message);

        res.json({ 
            status: 'success',
            data: result
        });
    } catch (error) {
        console.error('❌ Error processing request:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

/**
 * Process a customer service chat request without Handit tracing
 * @route POST /api/chat/simple
 * @param {Object} req.body.message - The customer's message
 * @returns {Object} Response object containing status and data
 * @throws {400} If message is missing
 * @throws {500} If internal server error occurs
 */
app.post('/api/chat/simple', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ 
                error: 'Message is required' 
            });
        }

        // Call simple agent function with the user message
        const result = await processSimpleRequest(message);

        res.json({ 
            status: 'success',
            data: result
        });
    } catch (error) {
        console.error('❌ Error processing request:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

/**
 * Health check endpoint to verify server status
 * @route GET /api/health
 * @returns {Object} Status object with timestamp
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

/**
 * Global error handling middleware
 * @middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err.stack);
    res.status(500).json({ 
        error: 'Something broke!',
        message: err.message 
    });
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
}); 