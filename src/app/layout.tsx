import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientProviders from '@/components/providers/ClientProviders';
import dynamic from 'next/dynamic';

const ChatbotIntegration = dynamic(
  () => import('@/components/chatbot/ChatbotIntegration'),
  { ssr: false }
);

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Restaurant Ordering | Online Pickup Orders',
  description: 'Order delicious food for pickup from our restaurant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex flex-col min-h-screen bg-gradient-to-b from-sky-blue/30 via-white to-sandy-beige/20">
        <ClientProviders>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <ChatbotIntegration />
        </ClientProviders>
      </body>
    </html>
  );
}
