import axios from 'axios';

const API_URL = 'http://localhost:3000';

const chatApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    // Remove withCredentials since we're not using cookies
    withCredentials: false
});

// Add response interceptor for better error handling
chatApi.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 500) {
            console.error('Server error:', error.response.data.detail);
        }
        return Promise.reject(error);
    }
);

export const generateResponse = async (message) => {
    try {
        const { data } = await chatApi.post('api/chat', { message });

        // The server returns { status: 'success', data: { response, intent } }
        return {
            answer: data.data.response.response,  // Access the nested response
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error generating response:', error);
        throw new Error(error.response?.data?.message || 'Failed to generate response');
    }
};