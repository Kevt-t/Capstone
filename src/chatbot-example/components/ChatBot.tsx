'use client';

import { useState, useEffect, useRef } from 'react';
import { useChatPersistence } from '../hooks/useChatPersistence';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBot() {
  // Extract chat state and functions from our custom hook
  const { 
    messages, 
    conversationId, 
    updateMessages, 
    setConversationId 
  } = useChatPersistence();
  
  const [input, setInput] = useState(''); // State for input field
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls
  const messagesEndRef = useRef<HTMLDivElement>(null); // Reference for auto-scrolling

  useEffect(() => {
    // Create a new conversation only if we don't already have one
    const createConversation = async () => {
      if (conversationId) return;
      
      try {
        const response = await fetch('/api/chat/create-conversation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to create conversation');
        }
        
        const data = await response.json();
        setConversationId(data.conversationId); // Store the conversation ID
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    };

    createConversation();
  }, [conversationId, setConversationId]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return; // Prevent empty submissions

    const userMessage = input.trim();
    setInput(''); // Clear input field
    setIsLoading(true); // Show loading state

    // Add user message to the chat immediately
    const updatedMessages = [...messages, { role: 'user' as const, content: userMessage }];
    updateMessages(updatedMessages);

    try {
      const response = await fetch('/api/chat/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Add assistant response to the chat
      const newMessages = [...updatedMessages, { role: 'assistant' as const, content: data.response }];
      updateMessages(newMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error message in chat
      const errorMessages = [...updatedMessages, { role: 'assistant' as const, content: 'Sorry, I encountered an error. Please try again.' }];
      updateMessages(errorMessages);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages display area with scrolling */}
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-3 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div 
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-amber-600 text-white' // User message styling
                  : 'bg-gray-100 text-gray-800' // Assistant message styling
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Element to scroll to */}
      </div>
      
      {/* Message input form */}
      <form onSubmit={handleSubmit} className="border-t p-3 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={isLoading} // Disable during API calls
        />
        <button
          type="submit"
          className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-r-lg disabled:opacity-50"
          disabled={isLoading || !input.trim()} // Disable when loading or empty input
        >
          {isLoading ? (
            // Loading spinner
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            // Send arrow icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
