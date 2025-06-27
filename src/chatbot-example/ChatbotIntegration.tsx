'use client';

import { useState } from 'react';
import ChatBot from './components/ChatBot';
import ChatIcon from './components/ChatIcon';
import { useChatPersistence } from './hooks/useChatPersistence';

export default function ChatbotIntegration() {
  const { isOpen, isMinimized } = useChatPersistence();
  
  return (
    <>
      {/* Chat icon - always visible, used to open/close the chat */}
      <ChatIcon />
      
      {/* Chat window - visibility controlled by state */}
      {isOpen && (
        <div
          className={`fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out transform ${
            isMinimized ? 'scale-y-0 origin-bottom' : 'scale-y-100'
          } border border-gray-200`}
        >
          <ChatBot />
        </div>
      )}
    </>
  );
}
