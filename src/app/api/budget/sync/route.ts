import { NextRequest, NextResponse } from 'next/server';
import { BudgetData } from '@/lib/types';

// In-memory storage for demo purposes
// In a real app, this would be a PostgreSQL database
const budgetStorage = new Map<string, BudgetData>();

export async function POST(request: NextRequest) {
  try {
    const budgetData: BudgetData = await request.json();

    // Validate required fields
    if (!budgetData.userId || !budgetData.month) {
      return NextResponse.json(
        { error: 'UserId and month are required' },
        { status: 400 }
      );
    }

    // Create storage key
    const key = `${budgetData.userId}-${budgetData.month}`;
    
    // Update sync status and timestamp
    budgetData.lastSyncAt = new Date();
    budgetData.syncStatus = 'synced';
    budgetData.updatedAt = new Date();

    // Save to storage
    budgetStorage.set(key, budgetData);

    return NextResponse.json({
      success: true,
      timestamp: budgetData.lastSyncAt,
      data: budgetData,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync budget data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const month = searchParams.get('month');

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      );
    }

    if (month) {
      // Get specific month's budget
      const key = `${userId}-${month}`;
      const budget = budgetStorage.get(key);
      
      if (budget) {
        return NextResponse.json(budget);
      } else {
        return NextResponse.json(
          { error: 'Budget not found' },
          { status: 404 }
        );
      }
    } else {
      // Get latest budget for user
      const userBudgets = Array.from(budgetStorage.values())
        .filter(budget => budget.userId === userId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      if (userBudgets.length > 0) {
        return NextResponse.json(userBudgets[0]);
      } else {
        return NextResponse.json(
          { error: 'No budgets found' },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    console.error('Get budget error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve budget data' },
      { status: 500 }
    );
  }
}