import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const chatApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Generate a response for the standard chat without Handit tracing
 * @param {string} message - The user's message
 * @returns {Promise<Object>} The response data
 */
export const generateSimpleResponse = async (message) => {
    try {
        const { data } = await chatApi.post('/chat/simple', {
            message
        });

        if (data.status === 'success' && data.data?.response?.response) {
            return {
                answer: data.data.response.response,
                timestamp: new Date().toISOString()
            };
        }

        throw new Error(data.error || 'Failed to get response');

    } catch (error) {
        if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Failed to connect to the chat service');
    }
};

/**
 * Generate a response for the AI-enhanced chat with Handit tracing
 * @param {string} message - The user's message
 * @returns {Promise<Object>} The response data
 */
export const generateEnhancedResponse = async (message) => {
    try {
        const { data } = await chatApi.post('/chat', {
            message
        });

        if (data.status === 'success' && data.data?.response?.response) {
            return {
                answer: data.data.response.response,
                timestamp: new Date().toISOString()
            };
        }

        throw new Error(data.error || 'Failed to get response');
    } catch (error) {
        if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Failed to connect to the enhanced chat service');
    }
};