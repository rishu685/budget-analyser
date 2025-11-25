export interface BudgetData {
  id: string;
  userId: string;
  income: number;
  monthlyBills: number;
  food: number;
  transport: number;
  subscriptions: number;
  miscellaneous: number;
  month: string; // YYYY-MM format
  createdAt: Date;
  updatedAt: Date;
  lastSyncAt?: Date;
  syncStatus: 'local-only' | 'sync-pending' | 'synced';
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface Analytics {
  burnRate: number; // Total expenses / Income
  savingsPotential: number; // Income - Total expenses
  monthEndPrediction: number;
  categoryBreakdown: {
    monthlyBills: number;
    food: number;
    transport: number;
    subscriptions: number;
    miscellaneous: number;
  };
  warnings: string[];
}

export interface SyncResponse {
  success: boolean;
  timestamp: Date;
  data?: BudgetData;
}