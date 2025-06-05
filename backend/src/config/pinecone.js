/**
 * Pinecone Configuration Module
 * @module config/pinecone
 * @requires @pinecone-database/pinecone
 * @requires dotenv
 */

import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initialize Pinecone client and index
 * @async
 * @function initializePinecone
 * @returns {Promise<Object>} Object containing Pinecone client and index
 * @throws {Error} If initialization fails
 */
export const initializePinecone = async () => {
    const client = new Pinecone({ 
        apiKey: process.env.PINECONE_API_KEY,
    });
    
    try {
        const index = client.index(process.env.PINECONE_INDEX);
        
        return {
            client,
            index
        };
    } catch (error) {
        console.error('❌ Error initializing Pinecone:', error);
        throw error;
    }
};

/**
 * Sample knowledge base data for customer service
 * @type {Array<Object>}
 * @property {string} text - The content text
 * @property {Object} metadata - Metadata for the content
 * @property {string} metadata.category - Content category
 * @property {string} metadata.intent - Expected user intent
 * @property {string} metadata.topic - Specific topic
 */
export const sampleKnowledgeBase = [
    {
        text: `About TechFlow Solutions

TechFlow Solutions is a leading provider of cloud-based business automation software. Founded in 2015, we've grown to serve over 10,000 businesses worldwide.

Our Mission:
To empower businesses with intelligent automation solutions that drive efficiency and growth.

Core Values:
- Innovation: Constantly pushing the boundaries of what's possible
- Customer Success: Your success is our success
- Integrity: Honest and transparent in all our dealings
- Excellence: Committed to delivering the highest quality solutions

Company Information:
- Founded: 2015
- Headquarters: San Francisco, CA
- Global Offices: New York, London, Singapore, Tokyo
- Team Size: 500+ employees
- Customers: 10,000+ businesses worldwide

Industry Recognition:
- Top 100 Tech Companies 2023
- Best Workplace Award 2022
- Innovation Excellence Award 2023`,
        metadata: {
            category: "company_info",
            intent: "company_inquiry",
            topic: "about_us"
        }
    },
    {
        text: `Contact Information and Support

How to Reach Us:

1. Customer Support:
   - Email: support@techflow.com
   - Phone: +1 (800) 555-0123
   - Live Chat: Available 24/7 on our website
   - Support Hours: 24/7

2. Sales Inquiries:
   - Email: sales@techflow.com
   - Phone: +1 (800) 555-0124
   - Hours: Monday-Friday, 9 AM - 6 PM PST

3. Office Locations:
   San Francisco (HQ):
   - 123 Innovation Drive
   - San Francisco, CA 94105
   - Phone: +1 (415) 555-0100

   New York:
   - 456 Tech Avenue
   - New York, NY 10001
   - Phone: +1 (212) 555-0200

   London:
   - 789 Digital Street
   - London, EC2A 4NE
   - Phone: +44 20 5555 0300

4. Social Media:
   - LinkedIn: TechFlow Solutions
   - Twitter: @TechFlowHQ
   - Facebook: TechFlow Solutions
   - Instagram: @techflow_official`,
        metadata: {
            category: "contact_info",
            intent: "contact_inquiry",
            topic: "support_contact"
        }
    },
    {
        text: `Account Security and Access

To ensure the security of your account, we recommend following these best practices:

1. Password Management:
   - Use a strong, unique password
   - Change your password every 90 days
   - Never share your password with anyone
   - Enable two-factor authentication

2. Account Recovery:
   - Keep your recovery email up to date
   - Add a phone number for SMS recovery
   - Set up security questions

3. Login Issues:
   If you can't access your account:
   - Try the password reset function
   - Check if your account is locked
   - Contact support if issues persist

4. Security Features:
   - Review login history
   - Enable login notifications
   - Set up trusted devices`,
        metadata: {
            category: "account_security",
            intent: "support_request",
            topic: "account_access"
        }
    },
    {
        text: `Billing and Subscription Management

Our billing system is designed to be transparent and user-friendly. Here's everything you need to know:

1. Billing Cycle:
   - Monthly billing on the 1st of each month
   - Pro-rated charges for mid-month changes
   - 30-day money-back guarantee

2. Payment Methods:
   - Credit/Debit cards
   - PayPal
   - Bank transfer
   - Cryptocurrency (selected plans)

3. Invoice Management:
   - Download PDF invoices
   - Set up automatic receipts
   - Request custom invoices
   - Tax documentation

4. Subscription Changes:
   - Upgrade/downgrade anytime
   - Cancel with 30-day notice
   - Pause subscription
   - Transfer to another account`,
        metadata: {
            category: "billing",
            intent: "billing_inquiry",
            topic: "subscription"
        }
    },
    {
        text: `Product Features and Capabilities

Our platform offers a comprehensive suite of features designed to meet your needs:

1. Core Features:
   - Real-time analytics
   - Custom reporting
   - API access
   - Webhook integration
   - Mobile app support

2. Premium Features:
   - Advanced security
   - Priority support
   - Custom integrations
   - Dedicated account manager
   - SLA guarantees

3. Integration Options:
   - REST API
   - GraphQL API
   - Webhooks
   - SDKs for major platforms
   - Custom solutions

4. Performance:
   - 99.9% uptime guarantee
   - Global CDN
   - Automatic scaling
   - Real-time monitoring
   - Performance analytics`,
        metadata: {
            category: "product",
            intent: "product_question",
            topic: "features"
        }
    }
]; 