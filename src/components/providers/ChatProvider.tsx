'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatState {
  messages: Message[];
  conversationId: string | null;
  isOpen: boolean;
  isMinimized: boolean;
}

interface ChatContextType extends ChatState {
  updateMessages: (messages: Message[]) => void;
  setConversationId: (id: string) => void;
  setOpen: (isOpen: boolean) => void;
  setMinimized: (isMinimized: boolean) => void;
  resetChat: () => void;
  isLoaded: boolean;
}

const STORAGE_KEY = 'el-molino-chat-state';

const initialState: ChatState = {
  messages: [
    {
      role: 'assistant',
      content: 
        'Welcome to El Molino Tortilleria & Restaurant! I\'m here to answer questions about our menu, hours, location, or ordering options. How can I help you today?'
    }
  ],
  conversationId: null,
  isOpen: false,
  isMinimized: false
};

// Create context with a default value
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chatState, setChatState] = useState<ChatState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load chat state from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        try {
          setChatState(JSON.parse(savedState));
        } catch (error) {
          console.error('Failed to parse saved chat state:', error);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save chat state to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatState));
    }
  }, [chatState, isLoaded]);

  const updateMessages = (messages: Message[]) => {
    setChatState(prev => ({ ...prev, messages }));
  };

  const setConversationId = (conversationId: string) => {
    setChatState(prev => ({ ...prev, conversationId }));
  };

  const setOpen = (isOpen: boolean) => {
    setChatState(prev => ({ ...prev, isOpen }));
  };

  const setMinimized = (isMinimized: boolean) => {
    setChatState(prev => ({ ...prev, isMinimized }));
  };

  const resetChat = () => {
    setChatState(initialState);
  };

  const value = {
    ...chatState,
    updateMessages,
    setConversationId,
    setOpen,
    setMinimized,
    resetChat,
    isLoaded
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// Custom hook to use the chat context
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
