import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BudgetData, Analytics } from './types';
import { LocalDB } from './localDB';
import { v4 as uuidv4 } from 'uuid';

interface BudgetStore {
  currentBudget: BudgetData | null;
  budgets: BudgetData[];
  isOnline: boolean;
  user: { id: string; email: string } | null;
  
  // Actions
  setBudget: (budget: Partial<BudgetData>) => Promise<void>;
  loadBudget: (month: string) => Promise<void>;
  loadUserBudgets: () => Promise<void>;
  setOnlineStatus: (status: boolean) => void;
  setUser: (user: { id: string; email: string } | null) => void;
  syncBudget: () => Promise<boolean>;
  calculateAnalytics: () => Analytics | null;
  createNewBudget: (month: string) => Promise<void>;
  logout: () => Promise<void>;
}

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
};

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      currentBudget: null,
      budgets: [],
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      user: null,

      setBudget: async (budgetUpdate) => {
        const state = get();
        if (!state.user) return;

        const currentMonth = getCurrentMonth();
        const existingBudget = state.currentBudget || {
          id: uuidv4(),
          userId: state.user.id,
          income: 0,
          monthlyBills: 0,
          food: 0,
          transport: 0,
          subscriptions: 0,
          miscellaneous: 0,
          month: currentMonth,
          createdAt: new Date(),
          updatedAt: new Date(),
          syncStatus: 'local-only' as const,
        };

        const updatedBudget: BudgetData = {
          ...existingBudget,
          ...budgetUpdate,
          updatedAt: new Date(),
          syncStatus: state.isOnline ? 'sync-pending' : 'local-only',
        };

        // Save to local storage
        await LocalDB.saveBudget(updatedBudget);
        
        set({ 
          currentBudget: updatedBudget,
          budgets: state.budgets.map(b => 
            b.month === updatedBudget.month ? updatedBudget : b
          ).concat(state.budgets.find(b => b.month === updatedBudget.month) ? [] : [updatedBudget])
        });

        // Auto-sync if online
        if (state.isOnline) {
          setTimeout(() => get().syncBudget(), 1000);
        }
      },

      loadBudget: async (month) => {
        const state = get();
        if (!state.user) return;

        const budget = await LocalDB.getBudget(state.user.id, month);
        set({ currentBudget: budget });
      },

      loadUserBudgets: async () => {
        const state = get();
        if (!state.user) return;

        const budgets = await LocalDB.getUserBudgets(state.user.id);
        set({ budgets });
      },

      setOnlineStatus: (status) => {
        set({ isOnline: status });
        
        // Auto-sync when coming online
        if (status) {
          setTimeout(() => get().syncBudget(), 1000);
        }
      },

      setUser: (user) => {
        set({ user });
        if (user) {
          LocalDB.saveUserSession(user.id, user.email);
          get().loadUserBudgets();
        }
      },

      syncBudget: async () => {
        const state = get();
        if (!state.isOnline || !state.user || !state.currentBudget) return false;

        try {
          const response = await fetch('/api/budget/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state.currentBudget),
          });

          if (response.ok) {
            const result = await response.json();
            await LocalDB.markBudgetSynced(state.user.id, state.currentBudget.month);
            
            const syncedBudget = { 
              ...state.currentBudget, 
              syncStatus: 'synced' as const, 
              lastSyncAt: new Date() 
            };
            
            set({ 
              currentBudget: syncedBudget,
              budgets: state.budgets.map(b => 
                b.month === syncedBudget.month ? syncedBudget : b
              )
            });
            
            return true;
          }
        } catch (error) {
          console.error('Sync failed:', error);
        }
        return false;
      },

      calculateAnalytics: () => {
        const { currentBudget } = get();
        if (!currentBudget) return null;

        const totalExpenses = 
          currentBudget.monthlyBills + 
          currentBudget.food + 
          currentBudget.transport + 
          currentBudget.subscriptions + 
          currentBudget.miscellaneous;

        const burnRate = currentBudget.income > 0 ? (totalExpenses / currentBudget.income) * 100 : 0;
        const savingsPotential = currentBudget.income - totalExpenses;

        const warnings: string[] = [];
        
        if (currentBudget.food > currentBudget.income * 0.4) {
          warnings.push("Food expenses are over 40% of income - consider reducing food spend next month");
        }
        
        if (currentBudget.subscriptions > currentBudget.income * 0.3) {
          warnings.push("Subscriptions are 30% of your income — too high! Consider cancelling unused apps");
        }
        
        if (savingsPotential < 0) {
          warnings.push("Your expenses exceed income. You need to reduce spending immediately");
        }

        if (burnRate > 90) {
          warnings.push("You're spending over 90% of your income. Very little room for savings");
        }

        return {
          burnRate,
          savingsPotential,
          monthEndPrediction: savingsPotential,
          categoryBreakdown: {
            monthlyBills: currentBudget.monthlyBills,
            food: currentBudget.food,
            transport: currentBudget.transport,
            subscriptions: currentBudget.subscriptions,
            miscellaneous: currentBudget.miscellaneous,
          },
          warnings,
        };
      },

      createNewBudget: async (month) => {
        const state = get();
        if (!state.user) return;

        const newBudget: BudgetData = {
          id: uuidv4(),
          userId: state.user.id,
          income: 0,
          monthlyBills: 0,
          food: 0,
          transport: 0,
          subscriptions: 0,
          miscellaneous: 0,
          month,
          createdAt: new Date(),
          updatedAt: new Date(),
          syncStatus: 'local-only',
        };

        await LocalDB.saveBudget(newBudget);
        set({ currentBudget: newBudget });
        get().loadUserBudgets();
      },

      logout: async () => {
        await LocalDB.clearUserSession();
        set({ 
          currentBudget: null, 
          budgets: [], 
          user: null 
        });
      },
    }),
    {
      name: 'budget-store',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Online/Offline detection
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useBudgetStore.getState().setOnlineStatus(true);
  });

  window.addEventListener('offline', () => {
    useBudgetStore.getState().setOnlineStatus(false);
  });
}