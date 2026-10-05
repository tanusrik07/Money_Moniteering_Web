import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OverviewMetrics } from './components/OverviewMetrics';
import { ExpenseTracker } from './components/ExpenseTracker';
import { CategoryBudgets } from './components/CategoryBudgets';
import { RoommateSplitter } from './components/RoommateSplitter';
import { SavingsGoals } from './components/SavingsGoals';
import { AnalyticsView } from './components/AnalyticsView';
import { QuickAddModal } from './components/QuickAddModal';
import { StudentProfileModal } from './components/StudentProfileModal';

import {
  CategoryBudget,
  ExpenseCategory,
  SavingsGoal,
  SplitBill,
  StudentProfile,
  Transaction,
} from './types';
import {
  INITIAL_BUDGETS,
  INITIAL_PROFILE,
  INITIAL_SAVINGS_GOALS,
  INITIAL_SPLIT_BILLS,
  INITIAL_TRANSACTIONS,
} from './data/initialData';

export default function App() {
  // Persistence in LocalStorage
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('campusexpense_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('campusexpense_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<CategoryBudget[]>(() => {
    const saved = localStorage.getItem('campusexpense_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [splitBills, setSplitBills] = useState<SplitBill[]>(() => {
    const saved = localStorage.getItem('campusexpense_split');
    return saved ? JSON.parse(saved) : INITIAL_SPLIT_BILLS;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('campusexpense_goals');
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'budgets' | 'split' | 'savings'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('campusexpense_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('campusexpense_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('campusexpense_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('campusexpense_split', JSON.stringify(splitBills));
  }, [splitBills]);

  useEffect(() => {
    localStorage.setItem('campusexpense_goals', JSON.stringify(goals));
  }, [goals]);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Transaction Handlers
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Added ${newTx.type === 'expense' ? 'expense' : 'income'}: "${newTx.title}"`);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction removed');
  };

  // Budget Handlers
  const handleUpdateBudget = (category: ExpenseCategory, newLimit: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.category === category ? { ...b, monthlyLimit: newLimit } : b))
    );
    showToast(`Updated monthly cap for ${category}`);
  };

  const handleApplyPreset = (presetName: string) => {
    if (presetName === 'hosteller') {
      setBudgets([
        { category: 'food', monthlyLimit: 4500 },
        { category: 'clothing', monthlyLimit: 1500 },
        { category: 'academics', monthlyLimit: 1200 },
        { category: 'hostel', monthlyLimit: 3000 },
        { category: 'commute', monthlyLimit: 800 },
        { category: 'entertainment', monthlyLimit: 1200 },
        { category: 'personal_care', monthlyLimit: 900 },
        { category: 'tech', monthlyLimit: 600 },
        { category: 'misc', monthlyLimit: 800 },
      ]);
      showToast('Applied "Hosteller / Dorm Life" budget configuration');
    } else if (presetName === 'dayscholar') {
      setBudgets([
        { category: 'food', monthlyLimit: 2500 },
        { category: 'clothing', monthlyLimit: 2000 },
        { category: 'academics', monthlyLimit: 1500 },
        { category: 'hostel', monthlyLimit: 300 },
        { category: 'commute', monthlyLimit: 2200 },
        { category: 'entertainment', monthlyLimit: 1500 },
        { category: 'personal_care', monthlyLimit: 600 },
        { category: 'tech', monthlyLimit: 700 },
        { category: 'misc', monthlyLimit: 1000 },
      ]);
      showToast('Applied "Day Scholar / Commuter" budget configuration');
    } else if (presetName === 'fest') {
      setBudgets([
        { category: 'food', monthlyLimit: 3500 },
        { category: 'clothing', monthlyLimit: 3500 },
        { category: 'academics', monthlyLimit: 2000 },
        { category: 'hostel', monthlyLimit: 1500 },
        { category: 'commute', monthlyLimit: 1400 },
        { category: 'entertainment', monthlyLimit: 2500 },
        { category: 'personal_care', monthlyLimit: 800 },
        { category: 'tech', monthlyLimit: 600 },
        { category: 'misc', monthlyLimit: 1000 },
      ]);
      showToast('Applied "Fest & Exam Month" budget configuration');
    }
  };

  // Split Bill Handlers
  const handleAddSplitBill = (newBillData: Omit<SplitBill, 'id'>) => {
    const newBill: SplitBill = {
      ...newBillData,
      id: `split-${Date.now()}`,
    };
    setSplitBills((prev) => [newBill, ...prev]);
    showToast(`Created split bill: "${newBill.title}"`);
  };

  const handleToggleParticipantPaid = (billId: string, participantName: string) => {
    setSplitBills((prev) =>
      prev.map((b) => {
        if (b.id !== billId) return b;
        return {
          ...b,
          participants: b.participants.map((p) =>
            p.name === participantName ? { ...p, hasPaid: !p.hasPaid } : p
          ),
        };
      })
    );
  };

  const handleToggleBillSettled = (billId: string) => {
    setSplitBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, settled: !b.settled } : b))
    );
    showToast('Updated bill status');
  };

  const handleDeleteSplitBill = (billId: string) => {
    setSplitBills((prev) => prev.filter((b) => b.id !== billId));
    showToast('Split bill deleted');
  };

  const handleLogShareAsExpense = (bill: SplitBill, myShare: number) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'expense',
      title: `Split share: ${bill.title}`,
      amount: myShare,
      category: bill.category,
      paymentMethod: 'upi',
      date: bill.date,
      notes: `My share from split bill (Total: ${profile.currencySymbol}${bill.totalAmount})`,
      tags: ['split', 'roommates'],
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Logged ${profile.currencySymbol}${myShare} to your expense ledger!`);
  };

  // Savings Goal Handlers
  const handleAddGoal = (newGoalData: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...newGoalData,
      id: `goal-${Date.now()}`,
    };
    setGoals((prev) => [newGoal, ...prev]);
    showToast(`New savings goal saved: "${newGoal.title}"`);
  };

  const handleUpdateGoalAmount = (goalId: string, delta: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const newAmt = Math.max(0, g.currentAmount + delta);
        return { ...g, currentAmount: newAmt };
      })
    );
    showToast(`Updated savings balance (${delta > 0 ? '+' : ''}${profile.currencySymbol}${delta})`);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    showToast('Savings goal removed');
  };

  // Currency & Profile
  const handleCurrencyChange = (symbol: string, code: string) => {
    setProfile((prev) => ({
      ...prev,
      currencySymbol: symbol,
      currencyCode: code,
    }));
    showToast(`Currency changed to ${symbol} ${code}`);
  };

  const handleSaveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    showToast('Student profile updated successfully');
  };

  const handleResetToSampleData = () => {
    setProfile(INITIAL_PROFILE);
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setSplitBills(INITIAL_SPLIT_BILLS);
    setGoals(INITIAL_SAVINGS_GOALS);
    showToast('Loaded realistic college student dataset');
  };

  const handleClearAllData = () => {
    setTransactions([]);
    setSplitBills([]);
    setGoals([]);
    showToast('All transaction records cleared');
  };

  const handleExportJson = () => {
    const data = {
      profile,
      transactions,
      budgets,
      splitBills,
      goals,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `campusspend_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Backup JSON downloaded');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        profile={profile}
        onCurrencyChange={handleCurrencyChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Overview & Campus Dashboard */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <OverviewMetrics
              transactions={transactions}
              profile={profile}
              onNavigateTab={setActiveTab}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />

            {/* Quick Analytics Sneak Peek & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Recent Transactions */}
              <div className="lg:col-span-2">
                <ExpenseTracker
                  transactions={transactions}
                  onDeleteTransaction={handleDeleteTransaction}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  currencySymbol={profile.currencySymbol}
                />
              </div>

              {/* Right 1 Col: Visual Analytics & Insights */}
              <div className="lg:col-span-1">
                <AnalyticsView
                  transactions={transactions}
                  currencySymbol={profile.currencySymbol}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Expenses Ledger */}
        {activeTab === 'expenses' && (
          <ExpenseTracker
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            currencySymbol={profile.currencySymbol}
          />
        )}

        {/* Tab 3: Category Budgets */}
        {activeTab === 'budgets' && (
          <CategoryBudgets
            budgets={budgets}
            transactions={transactions}
            onUpdateBudget={handleUpdateBudget}
            onApplyPreset={handleApplyPreset}
            currencySymbol={profile.currencySymbol}
          />
        )}

        {/* Tab 4: Roommate & Friends Split */}
        {activeTab === 'split' && (
          <RoommateSplitter
            splitBills={splitBills}
            onAddSplitBill={handleAddSplitBill}
            onToggleParticipantPaid={handleToggleParticipantPaid}
            onToggleBillSettled={handleToggleBillSettled}
            onDeleteSplitBill={handleDeleteSplitBill}
            onLogShareAsExpense={handleLogShareAsExpense}
            currencySymbol={profile.currencySymbol}
          />
        )}

        {/* Tab 5: Student Savings Goals */}
        {activeTab === 'savings' && (
          <SavingsGoals
            goals={goals}
            onAddGoal={handleAddGoal}
            onUpdateGoalAmount={handleUpdateGoalAmount}
            onDeleteGoal={handleDeleteGoal}
            currencySymbol={profile.currencySymbol}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-800">CampusSpend</span> · Intelligent College Student Money Monitor
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Student Settings
            </button>
            <span>·</span>
            <button
              onClick={handleExportJson}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Export JSON
            </button>
            <span>·</span>
            <span>Local Storage Active</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <QuickAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        currencySymbol={profile.currencySymbol}
      />

      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        onResetToSampleData={handleResetToSampleData}
        onClearAllData={handleClearAllData}
        onExportJson={handleExportJson}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
