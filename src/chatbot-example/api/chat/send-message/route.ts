import { NextRequest, NextResponse } from 'next/server';
import { sendMessage, readSSEStream } from '../utils';

export async function POST(request: NextRequest) {
  // Try to handle the request
  try {
    // Get the conversation ID and message from the request body
    const { conversationId, message } = await request.json();

    // Get the PlayLab project ID and API key from the environment
    const projectId = process.env.NEXT_PUBLIC_PLAYLAB_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_PLAYLAB_API_KEY;

    // If either the project ID or API key is missing, return a 500 error
    if (!projectId || !apiKey) {
      return NextResponse.json(
        { error: 'Missing PlayLab configuration' },
        { status: 500 }
      );
    }

    // If either the conversation ID or message is missing, return a 400 error
    if (!conversationId || !message) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Send the message and get the streaming response
    const messageBody = await sendMessage(projectId, apiKey, conversationId, message);
    
    // If the message body is null, return a 500 error
    if (!messageBody) {
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    // Read the SSE stream
    const response = await readSSEStream(messageBody);

    // Return the response
    return NextResponse.json({ response: response || 'No response received.' });
  } catch (error) {
    // Log the error
    console.error('Error sending message:', error);
    // Return a 500 error
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
