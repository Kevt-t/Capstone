import { NextResponse } from 'next/server';
import { createConversation } from '../utils';

export async function POST() {
  try {
    const PROJECT_ID = process.env.NEXT_PUBLIC_PLAYLAB_PROJECT_ID;
    const API_KEY = process.env.NEXT_PUBLIC_PLAYLAB_API_KEY;
    
    if (!PROJECT_ID || !API_KEY) {
      return NextResponse.json(
        { error: 'Missing PlayLab configuration' },
        { status: 500 }
      );
    }

    const conversation = await createConversation(PROJECT_ID, API_KEY);
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversationId: conversation.id });
  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
