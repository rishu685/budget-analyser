import localforage from 'localforage';
import { BudgetData } from './types';

// Configure localforage for IndexedDB storage
const budgetStore = localforage.createInstance({
  name: 'BudgetBox',
  storeName: 'budgets',
  description: 'Local storage for budget data'
});

const userStore = localforage.createInstance({
  name: 'BudgetBox', 
  storeName: 'users',
  description: 'Local storage for user session'
});

export class LocalDB {
  static async saveBudget(budgetData: BudgetData): Promise<void> {
    try {
      await budgetStore.setItem(`budget-${budgetData.userId}-${budgetData.month}`, budgetData);
    } catch (error) {
      console.error('Error saving budget locally:', error);
      throw error;
    }
  }

  static async getBudget(userId: string, month: string): Promise<BudgetData | null> {
    try {
      return await budgetStore.getItem(`budget-${userId}-${month}`);
    } catch (error) {
      console.error('Error getting budget locally:', error);
      return null;
    }
  }

  static async getUserBudgets(userId: string): Promise<BudgetData[]> {
    try {
      const keys = await budgetStore.keys();
      const userKeys = keys.filter(key => key.toString().startsWith(`budget-${userId}-`));
      const budgets: BudgetData[] = [];
      
      for (const key of userKeys) {
        const budget = await budgetStore.getItem(key);
        if (budget) budgets.push(budget as BudgetData);
      }
      
      return budgets.sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());
    } catch (error) {
      console.error('Error getting user budgets:', error);
      return [];
    }
  }

  static async deleteBudget(userId: string, month: string): Promise<void> {
    try {
      await budgetStore.removeItem(`budget-${userId}-${month}`);
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  }

  static async saveUserSession(userId: string, email: string): Promise<void> {
    try {
      await userStore.setItem('currentUser', { id: userId, email });
    } catch (error) {
      console.error('Error saving user session:', error);
      throw error;
    }
  }

  static async getUserSession(): Promise<{id: string, email: string} | null> {
    try {
      return await userStore.getItem('currentUser');
    } catch (error) {
      console.error('Error getting user session:', error);
      return null;
    }
  }

  static async clearUserSession(): Promise<void> {
    try {
      await userStore.removeItem('currentUser');
    } catch (error) {
      console.error('Error clearing user session:', error);
    }
  }

  static async getPendingSyncBudgets(userId: string): Promise<BudgetData[]> {
    try {
      const budgets = await this.getUserBudgets(userId);
      return budgets.filter(budget => budget.syncStatus === 'sync-pending');
    } catch (error) {
      console.error('Error getting pending sync budgets:', error);
      return [];
    }
  }

  static async markBudgetSynced(userId: string, month: string): Promise<void> {
    try {
      const budget = await this.getBudget(userId, month);
      if (budget) {
        budget.syncStatus = 'synced';
        budget.lastSyncAt = new Date();
        await this.saveBudget(budget);
      }
    } catch (error) {
      console.error('Error marking budget as synced:', error);
      throw error;
    }
  }
}