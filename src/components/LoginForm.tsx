'use client';

import React, { useState, useEffect } from 'react';
import { useBudgetStore } from '@/lib/store';
import { LogIn, User, Lock, Loader2 } from 'lucide-react';
import { LocalDB } from '@/lib/localDB';

const LoginForm = () => {
  const { setUser, user } = useBudgetStore();
  const [formData, setFormData] = useState({
    email: 'hire-me@anshumat.org',
    password: 'HireMe@2025!',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const session = await LocalDB.getUserSession();
        if (session) {
          setUser(session);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [setUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Normalize input
    const email = formData.email.trim().toLowerCase();
    const password = formData.password.trim();

    try {
      // First, check for demo credentials immediately for offline support
      if (email === 'hire-me@anshumat.org' && password === 'HireMe@2025!') {
        const demoUser = { id: 'demo-user-123', email: 'hire-me@anshumat.org' };
        setUser(demoUser);
        return;
      }

      // Try API authentication if online
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setUser({ id: result.user.id, email: result.user.email });
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      // If API fails, fall back to demo credentials check
      console.error('API login failed:', error);
      if (email === 'hire-me@anshumat.org' && password === 'HireMe@2025!') {
        const demoUser = { id: 'demo-user-123', email: 'hire-me@anshumat.org' };
        setUser(demoUser);
      } else {
        setError('Unable to login. Please check your credentials or try the demo account.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const { logout } = useBudgetStore.getState();
    await logout();
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Checking session...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">BudgetBox</h1>
                <p className="text-gray-600">Welcome back, {user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
            {/* The main app content will be rendered here */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">BB</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">BudgetBox</h1>
          <p className="text-gray-600 font-medium">Your Local-First Personal Budgeting App</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <LogIn className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900"
                  placeholder="Enter your email"
                  style={{ fontWeight: '500' }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900"
                  placeholder="Enter your password"
                  style={{ fontWeight: '500' }}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-bold text-blue-900 mb-2">Demo Credentials</h3>
            <div className="text-sm text-blue-700 space-y-1 font-medium">
              <p><strong>Email:</strong> hire-me@anshumat.org</p>
              <p><strong>Password:</strong> HireMe@2025!</p>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              These credentials work both online and offline. Copy exactly as shown (case-sensitive).
            </p>
            <button
              type="button"
              onClick={() => setFormData({
                email: 'hire-me@anshumat.org',
                password: 'HireMe@2025!'
              })}
              className="mt-2 text-xs text-blue-600 underline hover:text-blue-800"
            >
              Click to auto-fill demo credentials
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Local-First Features</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Works Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Auto-save</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Instant Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Never Lose Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;