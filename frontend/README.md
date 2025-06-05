# Customer Service Assistant Comparison

## Overview

Modern chat interface built with React and Material-UI that showcases two different customer service experiences:
- Standard chat interface
- AI-Enhanced chat interface with Handit AI integration

## Tech Stack

- **Frontend**: React 18, Material-UI v5
- **State Management**: React Hooks
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Package Manager**: npm

## Project Structure

```
frontend/
├── src/
│   ├── features/
│   │   └── chat/
│   │       ├── components/
│   │       │   ├── ChatWindow.jsx        # Standard chat interface
│   │       │   ├── TechChatWindow.jsx    # AI-Enhanced chat interface
│   │       │   ├── MessageList.jsx       # Shared message display component
│   │       │   └── ChatInput.jsx         # Shared input component
│   │       ├── services/
│   │       │   └── chatService.js        # API integration
│   │       └── pages/
│   │           └── Chat.jsx              # Main comparison page
│   ├── theme/
│   │   └── theme.js
│   └── App.jsx
```

## Features

### Standard Assistant
- 💬 Clean and intuitive chat interface
- 📝 Professional message formatting
- ⚡️ Real-time responses
- 🛠 Comprehensive error handling

### AI-Enhanced Assistant
- 🤖 Handit AI integration
- 🎨 Modern tech-inspired design
- 🔷 Custom indigo theme
- 🚀 Enhanced response capabilities

### Shared Features
- 📱 Fully responsive design
- 🎭 Beautiful Material Design components
- ⌨️ Smooth typing experience
- 🔄 Loading states and animations

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm (v8+)

### Installation

1. Clone and install dependencies:

```bash
git clone <repository-url>
cd frontend
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:5173` to see the comparison in action.

## API Integration

### Generate Response

- **Endpoint**: `/generate`
- **Method**: `POST`
- **Body**:

```json
{
  "question": "string"
}
```

### Response Format

```json
{
  "answer": "string",
  "timestamp": "ISO-8601 string"
}
```

## Styling

The application features a modern, professional design:

- **Standard Chat**:
  - Clean, professional interface
  - Material Design components
  - Subtle animations

- **AI-Enhanced Chat**:
  - Tech-inspired indigo theme
  - Enhanced visual indicators
  - Modern UI elements

## Contributing

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Commit your changes:
```bash
git commit -m "feat: add some feature"
```

3. Push and create a pull request:
```bash
git push origin feature/your-feature-name
```

## Available Scripts

- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## License

MIT
