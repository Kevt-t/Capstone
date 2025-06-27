'use client';

import { useChatContext } from '@/components/providers/ChatProvider';
import ChatBot from './ChatBot';
import ChatIcon from './ChatIcon';

export default function ChatbotIntegration() {
  const { isOpen, isMinimized } = useChatContext();
  
  return (
    <>
      {/* Chat icon - always visible, used to open/close the chat */}
      <ChatIcon />
      
      {/* Chat window - visibility controlled by state */}
      {isOpen && (
        <div
          className={`fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out transform ${
            isMinimized ? 'scale-y-0 origin-bottom' : 'scale-y-100'
          } border border-gray-200 z-50`}
        >
          <ChatBot />
        </div>
      )}
    </>
  );
}
