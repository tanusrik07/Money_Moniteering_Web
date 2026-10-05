import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  Calendar,
  CreditCard,
  Tag,
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  Receipt,
  Download,
} from 'lucide-react';
import { ExpenseCategory, PaymentMethod, Transaction, TransactionType } from '../types';
import { CATEGORIES, PAYMENT_METHODS } from '../data/categories';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface ExpenseTrackerProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onOpenAddModal: () => void;
  currencySymbol: string;
}

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  transactions,
  onDeleteTransaction,
  onOpenAddModal,
  currencySymbol,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const todayStr = now.toISOString().split('T')[0];

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const sevenDaysStr = sevenDaysAgo.toISOString().split('T')[0];

    return transactions
      .filter((t) => {
        // Search query
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchNotes = t.notes?.toLowerCase().includes(q);
          const matchTags = t.tags?.some((tag) => tag.toLowerCase().includes(q));
          if (!matchTitle && !matchNotes && !matchTags) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && t.category !== selectedCategory) {
          return false;
        }

        // Type filter
        if (selectedType !== 'all' && t.type !== selectedType) {
          return false;
        }

        // Payment method filter
        if (selectedPayment !== 'all' && t.paymentMethod !== selectedPayment) {
          return false;
        }

        // Period filter
        if (selectedPeriod === 'month' && !t.date.startsWith(currentMonthPrefix)) {
          return false;
        } else if (selectedPeriod === 'week' && t.date < sevenDaysStr) {
          return false;
        } else if (selectedPeriod === 'today' && t.date !== todayStr) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return b.date.localeCompare(a.date);
        if (sortBy === 'date-asc') return a.date.localeCompare(b.date);
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, search, selectedCategory, selectedType, selectedPayment, selectedPeriod, sortBy]);

  // Aggregate stats for current filter
  const totalFilteredExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFilteredIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const exportFilteredCSV = () => {
    const headers = ['Date', 'Type', 'Title', 'Category', 'Amount', 'Payment Method', 'Notes', 'Tags'];
    const rows = filteredTransactions.map((t) => [
      t.date,
      t.type,
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.amount,
      t.paymentMethod,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
      `"${(t.tags || []).join(', ')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `college_expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header and Filter Controls */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Student Expense Ledger</h2>
            <p className="text-xs text-slate-500">
              Detailed record of food, clothing, hostel, academics, and daily pocket money
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={exportFilteredCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Download CSV for parent review or excel sheet"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Spend</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search canteen, jeans, xerox, swiggy..."
              className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 outline-hidden cursor-pointer"
            >
              <option value="all">All Categories</option>
              {Object.values(CATEGORIES).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* Period Filter */}
          <div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 outline-hidden cursor-pointer"
            >
              <option value="month">This Month</option>
              <option value="week">Past 7 Days</option>
              <option value="today">Today Only</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 outline-hidden cursor-pointer"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pill Buttons (Interactive Segmented Control) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-slate-600 font-semibold shrink-0">Type:</span>
            <div className="flex items-center p-0.5 bg-slate-100 rounded-md">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                  selectedType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedType('expense')}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                  selectedType === 'expense' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Expenses
              </button>
              <button
                onClick={() => setSelectedType('income')}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                  selectedType === 'income' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Inflow
              </button>
            </div>
          </div>

          {/* Summary Indicator */}
          <div className="flex items-center gap-3 text-slate-500 tabular-nums">
            <span>
              Showing <strong className="text-slate-800">{filteredTransactions.length}</strong> items
            </span>
            <span>·</span>
            <span>
              Outflow: <strong className="text-rose-600">{formatCurrency(totalFilteredExpense, currencySymbol)}</strong>
            </span>
            {totalFilteredIncome > 0 && (
              <>
                <span>·</span>
                <span>
                  Inflow: <strong className="text-emerald-600">{formatCurrency(totalFilteredIncome, currencySymbol)}</strong>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No Transactions Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No entries match your selected filters. Adjust your search or record a new campus expense.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
            >
              + Record Spend Now
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map((tx) => {
              const isExpense = tx.type === 'expense';
              const cat = CATEGORIES[tx.category] || CATEGORIES.misc;
              const paymentName =
                PAYMENT_METHODS.find((p) => p.id === tx.paymentMethod)?.short || tx.paymentMethod;

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CategoryIcon category={tx.category} size="md" />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                          {tx.title}
                        </h4>
                      </div>

                      {/* Clean Unboxed Metadata with Typographic Separators */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 mt-0.5">
                        <span className="font-medium text-slate-600">{cat.shortName}</span>
                        <span aria-hidden="true" className="text-slate-400">·</span>
                        <span className="text-slate-600">{paymentName}</span>
                        <span aria-hidden="true" className="text-slate-400">·</span>
                        <span className="text-slate-600">{formatDateDisplay(tx.date)}</span>
                        {tx.notes && (
                          <>
                            <span aria-hidden="true" className="text-slate-400">·</span>
                            <span className="truncate max-w-[200px] text-slate-500 italic">
                              "{tx.notes}"
                            </span>
                          </>
                        )}
                        {tx.tags && tx.tags.length > 0 && (
                          <>
                            <span aria-hidden="true" className="text-slate-400">·</span>
                            <span className="text-indigo-600 font-medium">
                              {tx.tags.map((t) => `#${t}`).join(' ')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right side: Amount and Delete Action */}
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <div className="text-right">
                      <span
                        className={`text-sm sm:text-base font-bold tabular-nums block ${
                          isExpense ? 'text-slate-900' : 'text-emerald-600'
                        }`}
                      >
                        {isExpense ? '-' : '+'}
                        {formatCurrency(tx.amount, currencySymbol)}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
