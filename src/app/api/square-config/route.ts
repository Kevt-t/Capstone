import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const applicationId = process.env.SQUARE_ENVIRONMENT === 'production'
    ? process.env.SQUARE_APPLICATION_ID
    : process.env.SQUARE_APPLICATION_ID || 'sandbox-sq0idb-YOUR_SANDBOX_APP_ID'; // Replace with your actual sandbox app ID
  
  const locationId = process.env.SQUARE_LOCATION_ID;
  
  if (!applicationId || !locationId) {
    return NextResponse.json(
      { error: 'Square configuration not complete' },
      { status: 500 }
    );
  }
  
  return NextResponse.json({
    applicationId,
    locationId,
    environment: process.env.SQUARE_ENVIRONMENT || 'sandbox'
  });
}
