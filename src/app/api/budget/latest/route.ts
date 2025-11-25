import { NextRequest, NextResponse } from 'next/server';

// This would typically fetch from the same storage as sync endpoint
// For demo purposes, we'll reference the same in-memory storage concept

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      );
    }

    // In a real app, this would query PostgreSQL for the latest budget
    // For now, we'll redirect to the sync endpoint's GET method
    const syncUrl = new URL('/api/budget/sync', request.url);
    syncUrl.searchParams.set('userId', userId);
    
    // This is a simplified implementation
    // In practice, you'd query your database here
    return NextResponse.json({
      message: 'Use /api/budget/sync endpoint with userId parameter',
      redirectUrl: syncUrl.toString(),
    });
  } catch (error) {
    console.error('Get latest budget error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve latest budget' },
      { status: 500 }
    );
  }
}