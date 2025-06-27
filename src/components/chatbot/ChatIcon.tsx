'use client';

import { useChatContext } from '@/components/providers/ChatProvider';

export default function ChatIcon() {
  const { isOpen, setOpen, isMinimized, setMinimized } = useChatContext();

  const handleChatToggle = () => {
    // If chat is closed or minimized, open and show it
    if (!isOpen || isMinimized) {
      setOpen(true);
      setMinimized(false);
    } else {
      // If chat is open and visible, minimize it with animation
      // and close it after animation completes
      setMinimized(true);
      setTimeout(() => setOpen(false), 300);
    }
  };

  return (
    <button
      onClick={handleChatToggle}
      className="fixed bottom-6 right-6 bg-secondary hover:bg-secondary-dark text-text-dark rounded-full p-3 shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-blue z-50"
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
