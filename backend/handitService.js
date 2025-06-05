/**
 * Handit.ai service initialization.
 */
import { config } from '@handit.ai/node';
import dotenv from 'dotenv';

dotenv.config();
 
// Configure Handit.ai with your API key
config({ 
    apiKey: process.env.HANDIT_API_KEY  // Sets up authentication for Handit.ai services
});