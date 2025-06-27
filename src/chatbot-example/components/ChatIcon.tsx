'use client';

import { useChatPersistence } from '../hooks/useChatPersistence';

export default function ChatIcon() {
  const { isOpen, setOpen, isMinimized, setMinimized } = useChatPersistence();

  const handleChatToggle = () => {
    if (isOpen) {
      // If chat is open, toggle minimized state
      setMinimized(!isMinimized);
    } else {
      // If chat is closed, open it
      setOpen(true);
      setMinimized(false);
    }
  };

  return (
    <button
      onClick={handleChatToggle}
      className="fixed bottom-6 right-6 bg-amber-700 text-white rounded-full p-3 shadow-lg hover:bg-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
      aria-label="Toggle chat"
    >
      {isOpen && !isMinimized ? (
        // X icon for closing
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        // Chat icon for opening
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )}
    </button>
  );
}
