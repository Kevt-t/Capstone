import { NextRequest, NextResponse } from 'next/server';
import { extractDeltaFromLine, sendMessage } from '../utils';

export async function POST(request: NextRequest) {
  try {
    const { conversationId, message } = await request.json();
    
    if (!conversationId || !message) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const PROJECT_ID = process.env.NEXT_PUBLIC_PLAYLAB_PROJECT_ID;
    const API_KEY = process.env.NEXT_PUBLIC_PLAYLAB_API_KEY;
    
    if (!PROJECT_ID || !API_KEY) {
      return NextResponse.json(
        { error: 'Missing PlayLab configuration' },
        { status: 500 }
      );
    }

    const responseStream = await sendMessage(
      PROJECT_ID,
      API_KEY,
      conversationId,
      message
    );

    if (!responseStream) {
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    // Process the streaming response
    const reader = responseStream.getReader();
    const decoder = new TextDecoder();
    let responseText = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text and process each line
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          const delta = extractDeltaFromLine(line);
          responseText += delta;
        }
      }
    } finally {
      reader.releaseLock();
    }

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
