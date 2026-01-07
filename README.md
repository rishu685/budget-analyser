# 📱 BudgetBox - Local-First Personal Budgeting App

A real, working **Offline-First** personal budgeting app built with Next.js 15 that follows Local-First principles. Works completely offline, auto-saves every keystroke locally, and syncs safely when the network returns.

## 🎯 Features

### ✅ Local-First Data Behavior
- **IndexedDB Storage**: Uses LocalForage for robust local storage
- **Offline-First**: App works with 0 internet connectivity  
- **Auto-Save**: Every keystroke is saved instantly
- **Sync Logic**: Clear status indicators (Local Only, Sync Pending, Synced)

### 📊 Budget Management
- **Monthly Budget Form**: Income, bills, food, transport, subscriptions, misc
- **Auto-Generated Dashboard**: 
  - 🔥 Burn Rate (Total expenses / Income)
  - 💸 Savings Potential (Income - Total Spend)  
  - 📅 Month-End Prediction
  - 🍰 Category Pie Chart
  - ⚠️ Anomaly Warnings 

### 🔧 Technical Features
- **PWA Support**: Installable with service workers
- **Responsive Design**: Works on mobile and desktop
- **Real-time Sync**: Background sync when online
- **Demo Authentication**: Pre-configured demo user

## 🚀 Quick Start

### Demo Login Credentials
```
Email: hire-me@anshumat.org
Password: HireMe@2025!
```

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd budgetbox
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand with persistence
- **Local Storage**: LocalForage (IndexedDB)
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend Stack  
- **API**: Next.js API Routes
- **Authentication**: bcryptjs (demo user)
- **Database**: In-memory storage (demo) + PostgreSQL schema ready

### Key Components

```
src/
├── app/
│   ├── api/
│   │   ├── auth/login/          # Authentication endpoint
│   │   └── budget/
│   │       ├── sync/            # POST/GET budget sync
│   │       └── latest/          # GET latest budget
│   ├── layout.tsx               # Root layout with PWA
│   └── page.tsx                 # Main app entry
├── components/
│   ├── AppContent.tsx           # Main app shell
│   ├── BudgetForm.tsx           # Budget input form
│   ├── Dashboard.tsx            # Analytics dashboard  
│   ├── LoginForm.tsx            # Authentication UI
│   └── PWAInstaller.tsx         # Service worker registration
├── lib/
│   ├── store.ts                 # Zustand state management
│   ├── localDB.ts               # LocalForage wrapper
│   └── types.ts                 # TypeScript interfaces
└── public/
    ├── manifest.json            # PWA manifest
    └── sw.js                    # Service worker
```

**Built with ❤️ for the Local-First movement**
