# El Molino Restaurant Support Chatbot Example

This folder contains a standalone example of the customer support chatbot functionality from the El Molino project.

## Structure

```
chatbot-example/
├── components/
│   ├── ChatBot.tsx          # Main chatbot UI component
│   └── ChatIcon.tsx         # Chat icon for opening/closing the chat
├── hooks/
│   └── useChatPersistence.ts # Custom hook for chat state management
├── api/
│   └── chat/
│       ├── create-conversation/
│       │   └── route.ts     # API endpoint to create a conversation
│       ├── send-message/
│       │   └── route.ts     # API endpoint to send a message
│       └── utils.ts         # Shared utilities for chat API
└── README.md                # This file
```

## Setup Instructions

1. Install dependencies:
```bash
npm install next react react-dom
```

2. Create a `.env.local` file with the following:
```
NEXT_PUBLIC_PLAYLAB_PROJECT_ID=your_playlab_project_id
NEXT_PUBLIC_PLAYLAB_API_KEY=your_playlab_api_key
```

3. Import the components into your application as needed.

## Integration Guide

To add this chatbot to your application:

1. Add the ChatBot component to your layout or page
2. Set up API routes in your Next.js application
3. Configure PlayLab AI credentials

## How It Works

This chatbot uses PlayLab AI for conversation handling and provides a simple, persistent chat interface for customer support. The chat state is maintained in local storage to preserve conversations across page reloads.
