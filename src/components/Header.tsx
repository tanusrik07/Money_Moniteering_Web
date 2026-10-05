import React from 'react';
import { Plus, User, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { StudentProfile } from '../types';
import { CURRENCY_OPTIONS } from '../data/categories';

interface HeaderProps {
  activeTab: 'overview' | 'expenses' | 'budgets' | 'split' | 'savings';
  setActiveTab: (tab: 'overview' | 'expenses' | 'budgets' | 'split' | 'savings') => void;
  onOpenAddModal: () => void;
  onOpenProfileModal: () => void;
  profile: StudentProfile;
  onCurrencyChange: (symbol: string, code: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenProfileModal,
  profile,
  onCurrencyChange,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single wordmark brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className="text-left group cursor-pointer focus:outline-hidden"
            >
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Campus<span className="text-indigo-600">Spend</span>
              </span>
            </button>
          </div>

          {/* Zone 2: Clean text navigation links (4-6 single-line links) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'expenses'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab('budgets')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'budgets'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Budgets
            </button>
            <button
              onClick={() => setActiveTab('split')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'split'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Roommate Split
            </button>
            <button
              onClick={() => setActiveTab('savings')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'savings'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Savings Goals
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Currency Selector */}
            <select
              value={profile.currencyCode}
              onChange={(e) => {
                const opt = CURRENCY_OPTIONS.find((c) => c.code === e.target.value);
                if (opt) onCurrencyChange(opt.symbol, opt.code);
              }}
              className="hidden sm:block text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-2.5 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              title="Change Currency"
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>

            {/* Profile trigger */}
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Student Profile & Settings"
            >
              <User className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline truncate max-w-[120px]">{profile.name}</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-lg shadow-xs transition-all whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Entry</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
              activeTab === 'overview' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
              activeTab === 'expenses' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-600'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('budgets')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
              activeTab === 'budgets' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-600'
            }`}
          >
            Budgets
          </button>
          <button
            onClick={() => setActiveTab('split')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
              activeTab === 'split' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-600'
            }`}
          >
            Split
          </button>
          <button
            onClick={() => setActiveTab('savings')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
              activeTab === 'savings' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-600'
            }`}
          >
            Savings
          </button>
        </div>
      </div>
    </header>
  );
};
