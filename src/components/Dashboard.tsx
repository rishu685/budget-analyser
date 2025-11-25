'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useBudgetStore } from '@/lib/store';
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, DollarSign, Target } from 'lucide-react';

const Dashboard = () => {
  const { calculateAnalytics } = useBudgetStore();
  const analytics = calculateAnalytics();

  if (!analytics) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Budget Data</h2>
          <p className="text-gray-600 font-medium">Enter your budget information to see analytics and insights.</p>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Monthly Bills', value: analytics.categoryBreakdown.monthlyBills, color: '#3B82F6' },
    { name: 'Food', value: analytics.categoryBreakdown.food, color: '#10B981' },
    { name: 'Transport', value: analytics.categoryBreakdown.transport, color: '#F59E0B' },
    { name: 'Subscriptions', value: analytics.categoryBreakdown.subscriptions, color: '#8B5CF6' },
    { name: 'Miscellaneous', value: analytics.categoryBreakdown.miscellaneous, color: '#EF4444' },
  ].filter(item => item.value > 0);

  const barData = [
    { name: 'Monthly Bills', amount: analytics.categoryBreakdown.monthlyBills },
    { name: 'Food', amount: analytics.categoryBreakdown.food },
    { name: 'Transport', amount: analytics.categoryBreakdown.transport },
    { name: 'Subscriptions', amount: analytics.categoryBreakdown.subscriptions },
    { name: 'Miscellaneous', amount: analytics.categoryBreakdown.miscellaneous },
  ].filter(item => item.amount > 0);

  const totalExpenses = Object.values(analytics.categoryBreakdown).reduce((sum, val) => sum + val, 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Budget Dashboard</h1>
        <p className="text-gray-700 font-medium">Your financial insights and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Burn Rate */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">🔥 Burn Rate</h3>
            <TrendingUp className={`w-5 h-5 ${analytics.burnRate > 80 ? 'text-red-500' : analytics.burnRate > 60 ? 'text-yellow-500' : 'text-green-500'}`} />
          </div>
          <div className="mb-2">
            <span className={`text-3xl font-bold ${analytics.burnRate > 80 ? 'text-red-600' : analytics.burnRate > 60 ? 'text-yellow-600' : 'text-green-600'}`}>
              {analytics.burnRate.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-gray-600">of income spent</p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${analytics.burnRate > 80 ? 'bg-red-500' : analytics.burnRate > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(analytics.burnRate, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Savings Potential */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">💸 Savings</h3>
            {analytics.savingsPotential >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
          </div>
          <div className="mb-2">
            <span className={`text-3xl font-bold ${analytics.savingsPotential >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{Math.abs(analytics.savingsPotential).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {analytics.savingsPotential >= 0 ? 'potential savings' : 'overspending'}
          </p>
        </div>

        {/* Month-End Prediction */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">📅 Month-End</h3>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mb-2">
            <span className={`text-3xl font-bold ${analytics.monthEndPrediction >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{Math.abs(analytics.monthEndPrediction).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {analytics.monthEndPrediction >= 0 ? 'projected surplus' : 'projected deficit'}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-bold text-gray-900 mb-6">🍰 Spending Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-bold text-gray-900 mb-6">📊 Category Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Warnings Section */}
      {analytics.warnings.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold text-gray-900">⚠️ Financial Alerts</h3>
          </div>
          <div className="space-y-3">
            {analytics.warnings.map((warning, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <p className="text-red-900 font-semibold">{warning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Total Expenses</h4>
          </div>
          <p className="text-2xl font-bold text-blue-700">₹{totalExpenses.toLocaleString()}</p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h4 className="font-semibold text-green-900">Largest Category</h4>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {pieData.length > 0 ? pieData.reduce((max, category) => category.value > max.value ? category : max).name : 'None'}
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h4 className="font-semibold text-purple-900">Health Score</h4>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {analytics.burnRate < 60 ? 'Excellent' : analytics.burnRate < 80 ? 'Good' : 'Needs Attention'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;