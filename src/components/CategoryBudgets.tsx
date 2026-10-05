import React, { useState } from 'react';
import { Sliders, AlertTriangle, CheckCircle, Info, Edit3, Check } from 'lucide-react';
import { CategoryBudget, ExpenseCategory, Transaction } from '../types';
import { CATEGORIES } from '../data/categories';
import { formatCurrency } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface CategoryBudgetsProps {
  budgets: CategoryBudget[];
  transactions: Transaction[];
  onUpdateBudget: (category: ExpenseCategory, newLimit: number) => void;
  onApplyPreset: (presetName: string) => void;
  currencySymbol: string;
}

export const CategoryBudgets: React.FC<CategoryBudgetsProps> = ({
  budgets,
  transactions,
  onUpdateBudget,
  onApplyPreset,
  currencySymbol,
}) => {
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Calculate current month's spending per category
  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const currentMonthExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(currentMonthPrefix)
  );

  const spentByCategory = currentMonthExpenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const totalSpent = Object.values(spentByCategory).reduce((sum, v) => sum + v, 0);

  const startEdit = (category: ExpenseCategory, currentLimit: number) => {
    setEditingCategory(category);
    setEditValue(String(currentLimit));
  };

  const saveEdit = (category: ExpenseCategory) => {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val >= 0) {
      onUpdateBudget(category, val);
    }
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Budget Presets */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Category Budgets & Thresholds</h2>
            <p className="text-xs text-slate-500">
              Set monthly spend limits for Food, Clothing, Academics, Hostel, and Commute
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Total Monthly Budget Cap</span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              {formatCurrency(totalBudgeted, currencySymbol)}
            </span>
          </div>
        </div>

        {/* College Student Profile Presets */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
          <div className="flex items-center gap-2 mb-2">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-bold text-slate-700">Quick College Lifestyle Presets:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => onApplyPreset('hosteller')}
              className="p-2 text-left bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 rounded-lg transition-all cursor-pointer group"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 block">
                🏫 Hosteller / Dorm Life
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Higher mess & PG bills, laundry, weekend snacks
              </span>
            </button>

            <button
              onClick={() => onApplyPreset('dayscholar')}
              className="p-2 text-left bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 rounded-lg transition-all cursor-pointer group"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 block">
                🚌 Day Scholar / Commuter
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Higher metro/bus transit, canteen lunch, zero dorm rent
              </span>
            </button>

            <button
              onClick={() => onApplyPreset('fest')}
              className="p-2 text-left bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 rounded-lg transition-all cursor-pointer group"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 block">
                ✨ Fest & Exam Month
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Extra clothing/fest outfits, printouts & project submissions
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Category Budgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((b) => {
          const cat = CATEGORIES[b.category] || CATEGORIES.misc;
          const spent = spentByCategory[b.category] || 0;
          const limit = b.monthlyLimit;
          const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
          const remaining = limit - spent;
          const isOver = spent > limit;
          const isWarning = pct >= 80 && !isOver;

          const isEditing = editingCategory === b.category;

          return (
            <div
              key={b.category}
              className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top: Icon + Name + Limit */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <CategoryIcon category={b.category} size="md" />
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-slate-600 truncate max-w-[170px]">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  {/* Limit control */}
                  <div className="text-right">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-16 px-1.5 py-0.5 text-xs font-bold border border-indigo-400 rounded outline-hidden tabular-nums"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEdit(b.category)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(b.category, limit)}
                        className="group flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 cursor-pointer"
                        title="Click to adjust limit"
                      >
                        <span className="tabular-nums font-bold text-slate-900">
                          {formatCurrency(limit, currencySymbol)}
                        </span>
                        <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                      </button>
                    )}
                    <span className="text-[10px] text-slate-600 block">Monthly Limit</span>
                  </div>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-600 font-medium">Spent: <strong className="text-slate-900 tabular-nums">{formatCurrency(spent, currencySymbol)}</strong></span>
                    <span
                      className={`font-bold tabular-nums text-xs ${
                        isOver
                          ? 'text-rose-600'
                          : isWarning
                          ? 'text-amber-600'
                          : 'text-slate-600'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver
                          ? 'bg-rose-500'
                          : isWarning
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Status / Remaining Advice */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {isOver ? (
                  <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Exceeded by {formatCurrency(Math.abs(remaining), currencySymbol)}</span>
                  </div>
                ) : isWarning ? (
                  <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formatCurrency(remaining, currencySymbol)} left (Tight)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formatCurrency(remaining, currencySymbol)} remaining</span>
                  </div>
                )}

                <span className="text-[10px] text-slate-600">
                  {currentMonthExpenses.filter((t) => t.category === b.category).length} logs
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
