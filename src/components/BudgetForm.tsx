'use client';

import React, { useState, useEffect } from 'react';
import { useBudgetStore } from '@/lib/store';
import { Wallet, Home, Utensils, Car, Monitor, MoreHorizontal, Save, Wifi, WifiOff } from 'lucide-react';

const BudgetForm = () => {
  const { 
    currentBudget, 
    setBudget, 
    isOnline, 
    user, 
    loadBudget,
    createNewBudget 
  } = useBudgetStore();

  const [formData, setFormData] = useState({
    income: 0,
    monthlyBills: 0,
    food: 0,
    transport: 0,
    subscriptions: 0,
    miscellaneous: 0,
  });

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

  useEffect(() => {
    if (user && !currentBudget) {
      loadBudget(currentMonth).then(() => {
        const budget = useBudgetStore.getState().currentBudget;
        if (!budget) {
          createNewBudget(currentMonth);
        }
      });
    }
  }, [user, currentMonth]);

  useEffect(() => {
    if (currentBudget) {
      setFormData({
        income: currentBudget.income,
        monthlyBills: currentBudget.monthlyBills,
        food: currentBudget.food,
        transport: currentBudget.transport,
        subscriptions: currentBudget.subscriptions,
        miscellaneous: currentBudget.miscellaneous,
      });
    }
  }, [currentBudget]);

  const handleFieldChange = async (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Auto-save on every keystroke
    await setBudget({ [field]: value });
  };

  const getSyncStatusIcon = () => {
    if (!currentBudget) return null;
    
    switch (currentBudget.syncStatus) {
      case 'local-only':
        return <Save className="w-4 h-4 text-gray-500" />;
      case 'sync-pending':
        return <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />;
      case 'synced':
        return <Save className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getSyncStatusText = () => {
    if (!currentBudget) return 'Not saved';
    
    switch (currentBudget.syncStatus) {
      case 'local-only':
        return 'Local Only';
      case 'sync-pending':
        return 'Sync Pending';
      case 'synced':
        return 'Synced';
      default:
        return 'Unknown';
    }
  };

  const budgetFields = [
    {
      key: 'income',
      label: 'Monthly Income',
      icon: Wallet,
      placeholder: 'Enter your monthly income',
      description: 'Your total monthly earnings'
    },
    {
      key: 'monthlyBills',
      label: 'Monthly Bills',
      icon: Home,
      placeholder: 'Rent, EMI, utilities',
      description: 'Fixed monthly expenses'
    },
    {
      key: 'food',
      label: 'Food',
      icon: Utensils,
      placeholder: 'Groceries + dining',
      description: 'Food and dining expenses'
    },
    {
      key: 'transport',
      label: 'Transport',
      icon: Car,
      placeholder: 'Fuel, cab, commute',
      description: 'Transportation costs'
    },
    {
      key: 'subscriptions',
      label: 'Subscriptions',
      icon: Monitor,
      placeholder: 'OTT, SaaS, apps',
      description: 'Digital subscriptions and services'
    },
    {
      key: 'miscellaneous',
      label: 'Miscellaneous',
      icon: MoreHorizontal,
      placeholder: 'Other expenses',
      description: 'Everything else'
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header with online status */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-black text-gray-900">Monthly Budget</h1>
          <div className="flex items-center gap-4">
            {/* Online/Offline Indicator */}
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {/* Sync Status */}
            <div className="flex items-center gap-2">
              {getSyncStatusIcon()}
              <span className="text-sm text-gray-700 font-semibold">{getSyncStatusText()}</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-700 font-medium">
          Enter your monthly budget details. Changes are auto-saved as you type.
        </p>
      </div>

      {/* Budget Form */}
      <div className="space-y-6">
        {budgetFields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key} className="group">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                {field.label}
              </label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-700 sm:text-sm font-bold">₹</span>
                </div>
                <div className="absolute inset-y-0 left-8 pl-3 flex items-center pointer-events-none">
                  <Icon className="h-5 w-5 text-gray-400" />
                </div>
                
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData[field.key as keyof typeof formData] || ''}
                  onChange={(e) => handleFieldChange(field.key, parseFloat(e.target.value) || 0)}
                  placeholder={field.placeholder}
                  className="block w-full pl-16 pr-3 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           transition-all duration-200 text-lg font-semibold text-gray-900
                           group-hover:border-gray-400"
                />
              </div>
              
              <p className="mt-1 text-sm text-gray-600 font-medium">{field.description}</p>
            </div>
          );
        })}
      </div>

      {/* Summary Card */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-700 font-semibold">Total Income</p>
            <p className="text-xl font-black text-green-600">₹{formData.income.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-700 font-semibold">Total Expenses</p>
            <p className="text-xl font-black text-red-600">
              ₹{(formData.monthlyBills + formData.food + formData.transport + formData.subscriptions + formData.miscellaneous).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      {/* Offline Notice */}
      {!isOnline && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <WifiOff className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-900 font-semibold">
              You're currently offline. Your changes are being saved locally and will sync when you're back online.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetForm;