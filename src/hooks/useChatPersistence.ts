'use client';

import { useState, useEffect } from 'react';

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

export function useChatPersistence() {
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

  return {
    messages: chatState.messages,
    conversationId: chatState.conversationId,
    isOpen: chatState.isOpen,
    isMinimized: chatState.isMinimized,
    updateMessages,
    setConversationId,
    setOpen,
    setMinimized,
    resetChat,
    isLoaded
  };
}
