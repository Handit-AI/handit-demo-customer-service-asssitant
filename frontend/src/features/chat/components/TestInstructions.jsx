import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Divider,
  Chip
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import SecurityIcon from '@mui/icons-material/Security';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';

const TestInstructions = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const knowledgeBase = [
    {
      icon: <InfoIcon />,
      title: "Company Information",
      content: `TechFlow Solutions is a leading provider of cloud-based business automation software. Founded in 2015, we've grown to serve over 10,000 businesses worldwide.

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
      category: "company_info"
    },
    {
      icon: <ContactSupportIcon />,
      title: "Contact & Support",
      content: `Contact Information and Support

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
   - Phone: +44 20 5555 0300`,
      category: "contact_info"
    },
    {
      icon: <SecurityIcon />,
      title: "Security",
      content: `Account Security and Access

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
      category: "account_security"
    },
    {
      icon: <PaymentIcon />,
      title: "Billing",
      content: `Billing and Subscription Management

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
      category: "billing"
    },
    {
      icon: <SettingsIcon />,
      title: "Features",
      content: `Product Features and Capabilities

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
      category: "product"
    }
  ];

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mb: 6,
        backgroundColor: "#fff",
        borderRadius: "16px",
        maxWidth: "1200px",
        mx: "auto",
        overflow: "hidden",
        border: "1px solid #e2e8f0"
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              py: 2,
              fontSize: '0.95rem',
              fontWeight: 500
            },
            '& .Mui-selected': {
              color: '#4f46e5 !important'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#4f46e5'
            }
          }}
        >
          <Tab label="Sample Questions" />
          <Tab label="Knowledge Base" />
        </Tabs>
      </Box>

      {/* Sample Questions Panel */}
      <Box
        role="tabpanel"
        hidden={tabValue !== 0}
        sx={{ p: 4 }}
      >
        {tabValue === 0 && (
          <>
            <Typography variant="h6" sx={{ mb: 3, color: "#334155", fontWeight: 600 }}>
              Sample Questions & Answers
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "#475569" }}>
              Try these example questions to see how both chat interfaces handle responses using the same knowledge base and flow logic. The only difference is that the right chat includes Handit AI.
            </Typography>
            <Box component="ul" sx={{ color: "#475569", pl: 0, listStyle: "none" }}>
              {[
                {
                  icon: <InfoIcon />,
                  title: "Company Information",
                  question: "What is TechFlow Solutions and when was it founded?",
                  answer: "TechFlow Solutions is a leading provider of cloud-based business automation software. Founded in 2015, we've grown to serve over 10,000 businesses worldwide."
                },
                {
                  icon: <ContactSupportIcon />,
                  title: "Contact & Support",
                  question: "How can I reach customer support?",
                  answer: "You can reach our 24/7 customer support through:\n- Email: support@techflow.com\n- Phone: +1 (800) 555-0123\n- Live Chat: Available 24/7 on our website"
                },
                {
                  icon: <SecurityIcon />,
                  title: "Account Security",
                  question: "What are the recommended password management practices?",
                  answer: "For password management, we recommend:\n- Use a strong, unique password\n- Change your password every 90 days\n- Never share your password with anyone\n- Enable two-factor authentication"
                },
                {
                  icon: <PaymentIcon />,
                  title: "Billing & Subscription",
                  question: "What payment methods do you accept?",
                  answer: "We accept the following payment methods:\n- Credit/Debit cards\n- PayPal\n- Bank transfer\n- Cryptocurrency (selected plans)"
                },
                {
                  icon: <SettingsIcon />,
                  title: "Product Features",
                  question: "What are your core platform features?",
                  answer: "Our core features include:\n- Real-time analytics\n- Custom reporting\n- API access\n- Webhook integration\n- Mobile app support"
                }
              ].map((section, index) => (
                <Accordion 
                  key={index}
                  sx={{
                    mb: index < 4 ? 2 : 0,
                    '&:before': { display: 'none' },
                    boxShadow: 'none',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px !important',
                    overflow: 'hidden',
                    '&.Mui-expanded': {
                      margin: '0 0 16px 0',
                    },
                    '&:hover': {
                      borderColor: '#4f46e5',
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#4f46e5' }} />}
                    sx={{
                      backgroundColor: '#fff',
                      '&.Mui-expanded': {
                        minHeight: 48,
                        borderBottom: '1px solid #e2e8f0'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: '#4f46e5' }}>{section.icon}</Box>
                      <Typography sx={{ fontWeight: 600, color: '#334155' }}>
                        {section.title}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: '#f8fafc', p: 3 }}>
                    <Box sx={{ pl: 2, borderLeft: '2px solid #e2e8f0' }}>
                      <Typography 
                        sx={{ 
                          color: '#4f46e5',
                          fontWeight: 500,
                          mb: 1
                        }}
                      >
                        Q: {section.question}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#64748b',
                          fontSize: '0.95rem',
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.7
                        }}
                      >
                        A: {section.answer}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* Knowledge Base Panel */}
      <Box
        role="tabpanel"
        hidden={tabValue !== 1}
        sx={{ p: 4 }}
      >
        {tabValue === 1 && (
          <>
            <Typography variant="h6" sx={{ mb: 3, color: "#334155", fontWeight: 600 }}>
              Available Knowledge Base
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "#475569" }}>
              This is the information available to both chat assistants. Each section contains specific details that the AI can access to answer your questions.
            </Typography>
            {knowledgeBase.map((section, index) => (
              <Accordion 
                key={index}
                sx={{
                  mb: 2,
                  '&:before': { display: 'none' },
                  boxShadow: 'none',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px !important',
                  '&.Mui-expanded': {
                    margin: '0 0 16px 0',
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    '&.Mui-expanded': {
                      minHeight: 48,
                      borderBottom: '1px solid #e2e8f0'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: '#4f46e5' }}>{section.icon}</Box>
                    <Typography sx={{ fontWeight: 600, color: '#334155' }}>
                      {section.title}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: '#f8fafc', p: 3 }}>
                  <Typography
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fontSize: '0.95rem',
                      color: '#475569',
                      m: 0,
                      lineHeight: 1.7
                    }}
                  >
                    {section.content}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </Box>
    </Paper>
  );
};

export default TestInstructions; 