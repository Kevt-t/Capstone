import { NextResponse } from 'next/server';
import { createConversation } from '../utils';

export async function POST() {
  try {
    // Get PlayLab project ID and API key from environment variables
    const projectId = process.env.NEXT_PUBLIC_PLAYLAB_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_PLAYLAB_API_KEY;

    // If either is missing, return a 500 error
    if (!projectId || !apiKey) {
      return NextResponse.json(
        { error: 'Missing PlayLab configuration' },
        { status: 500 }
      );
    }

    // Create a new conversation using the PlayLab API
    const conversation = await createConversation(projectId, apiKey);
    
    // If the conversation is null, return a 500 error
    if (!conversation) {
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      );
    }

    // Return the conversation ID in the response
    return NextResponse.json({ conversationId: conversation.id });
  } catch (error) {
    // Log the error
    console.error('Error creating conversation:', error);
    // Return a 500 error
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
