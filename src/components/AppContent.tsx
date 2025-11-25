'use client';

import React, { useState, useEffect } from 'react';
import { useBudgetStore } from '@/lib/store';
import LoginForm from '@/components/LoginForm';
import BudgetForm from '@/components/BudgetForm';
import Dashboard from '@/components/Dashboard';
import { BarChart3, PlusCircle, Settings, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const AppContent = () => {
  const { user, isOnline, currentBudget, syncBudget } = useBudgetStore();
  const [activeTab, setActiveTab] = useState<'budget' | 'dashboard'>('budget');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Initialize user session and load current month budget
  useEffect(() => {
    if (user && !currentBudget) {
      const currentMonth = new Date().toISOString().slice(0, 7);
      useBudgetStore.getState().loadBudget(currentMonth);
    }
  }, [user, currentBudget]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage('');
    
    try {
      const success = await syncBudget();
      if (success) {
        setSyncMessage('Successfully synced!');
      } else {
        setSyncMessage('Sync failed. Will retry automatically.');
      }
    } catch (error) {
      setSyncMessage('Sync failed. Check your connection.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(''), 3000);
    }
  };

  const getSyncStatusDisplay = () => {
    if (!currentBudget) return null;
    
    switch (currentBudget.syncStatus) {
      case 'local-only':
        return (
          <div className="flex items-center gap-2 text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span>Local Only</span>
          </div>
        );
      case 'sync-pending':
        return (
          <div className="flex items-center gap-2 text-orange-600">
            <Clock className="w-4 h-4" />
            <span>Sync Pending</span>
          </div>
        );
      case 'synced':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Synced</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center">
                  <span className="text-lg font-bold text-white">BB</span>
                </div>
                <h1 className="text-xl font-black text-gray-900">BudgetBox</h1>
              </div>
              
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('budget')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                    activeTab === 'budget'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Budget
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </button>
              </nav>
            </div>

            {/* Status and Actions */}
            <div className="flex items-center gap-4">
              {/* Sync Status */}
              {getSyncStatusDisplay()}
              
              {/* Sync Button */}
              <button
                onClick={handleSync}
                disabled={!isOnline || isSyncing}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                  isOnline && !isSyncing
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync'}
              </button>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-600 font-semibold">
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
                <button
                  onClick={() => useBudgetStore.getState().logout()}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Sync Message */}
          {syncMessage && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-semibold">{syncMessage}</p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {activeTab === 'budget' ? <BudgetForm /> : <Dashboard />}
      </main>

      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-900 font-bold">
              You're offline. Changes are saved locally.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppContent;