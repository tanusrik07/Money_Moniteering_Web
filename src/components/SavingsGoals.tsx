import React, { useState } from 'react';
import { Target, Plus, CheckCircle, TrendingUp, Trash2, Calendar, Sparkles } from 'lucide-react';
import { SavingsGoal } from '../types';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  onUpdateGoalAmount: (goalId: string, delta: number) => void;
  onDeleteGoal: (goalId: string) => void;
  currencySymbol: string;
}

export const SavingsGoals: React.FC<SavingsGoalsProps> = ({
  goals,
  onAddGoal,
  onUpdateGoalAmount,
  onDeleteGoal,
  currencySymbol,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Campus Milestone');
  const [notes, setNotes] = useState('');

  // Active deposit/withdraw popover state
  const [activeAdjustId, setActiveAdjustId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const initial = parseFloat(initialAmount) || 0;
    if (!title.trim() || isNaN(target) || target <= 0) return;

    onAddGoal({
      title: title.trim(),
      targetAmount: target,
      currentAmount: Math.max(0, initial),
      targetDate: targetDate || new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      category,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setTargetAmount('');
    setInitialAmount('');
    setTargetDate('');
    setNotes('');
    setIsAdding(false);
  };

  const handleAdjust = (goalId: string, isDeposit: boolean) => {
    const val = parseFloat(adjustAmount);
    if (!isNaN(val) && val > 0) {
      onUpdateGoalAmount(goalId, isDeposit ? val : -val);
    }
    setActiveAdjustId(null);
    setAdjustAmount('');
  };

  const totalSavedAcrossGoals = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTargetAcrossGoals = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header & Overall Student Vault */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Student Savings Goals & Milestones</h2>
            <p className="text-xs text-slate-500">
              Save pocket money for semester trips, gadgets, fest passes, and emergency reserves
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Total Stashed in Goals</span>
              <span className="text-lg font-bold text-emerald-600 tabular-nums">
                {formatCurrency(totalSavedAcrossGoals, currencySymbol)}
              </span>
            </div>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Close Form' : 'New Goal'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* New Goal Form */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-xl border border-indigo-200 bg-indigo-50/30 shadow-xs space-y-4"
        >
          <h3 className="text-sm font-bold text-indigo-950">Create Student Savings Goal</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Goal Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Semester Trip to Goa, Noise Cancelling Headphones"
                className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Target Amount ({currencySymbol}) *
              </label>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full px-3 py-2 text-xs font-bold tabular-nums text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Already Saved ({currencySymbol})
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 text-xs tabular-nums text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Target Deadline
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Goal Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden cursor-pointer"
              >
                <option value="Travel & Fun">Travel & Fun</option>
                <option value="Gadgets & Study">Gadgets & Tech</option>
                <option value="Fest & Outfits">Fest & Outfits</option>
                <option value="Safety Net">Emergency Safety Buffer</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Save Goal
            </button>
          </div>
        </form>
      )}

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
          const isComplete = g.currentAmount >= g.targetAmount;
          const remainingToTarget = Math.max(0, g.targetAmount - g.currentAmount);

          const isAdjusting = activeAdjustId === g.id;

          return (
            <div
              key={g.id}
              className={`p-4 rounded-xl border bg-white shadow-xs transition-all flex flex-col justify-between ${
                isComplete ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-lg ${
                        isComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-600'
                      }`}
                    >
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                        {g.title}
                      </h3>
                      <span className="text-[11px] text-slate-500 block">{g.category}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteGoal(g.id)}
                    className="p-1 text-slate-300 hover:text-rose-600 rounded cursor-pointer"
                    title="Delete goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress Visual */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-600 font-semibold tabular-nums">
                      {formatCurrency(g.currentAmount, currencySymbol)} of{' '}
                      {formatCurrency(g.targetAmount, currencySymbol)}
                    </span>
                    <span
                      className={`font-bold tabular-nums text-xs ${
                        isComplete ? 'text-emerald-600' : 'text-indigo-600'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isComplete ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Target: {formatDateDisplay(g.targetDate)}</span>
                  </div>
                  {isComplete ? (
                    <span className="font-semibold text-emerald-600">Goal Achieved! 🎉</span>
                  ) : (
                    <span>{formatCurrency(remainingToTarget, currencySymbol)} to go</span>
                  )}
                </div>

                {g.notes && (
                  <p className="mt-2 text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                    "{g.notes}"
                  </p>
                )}
              </div>

              {/* Deposit / Withdraw Controls */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                {isAdjusting ? (
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder={`Amount (${currencySymbol})`}
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                      className="w-full px-2.5 py-1 text-xs border border-indigo-300 rounded-lg outline-hidden tabular-nums"
                      autoFocus
                    />
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setActiveAdjustId(null)}
                        className="px-2 py-0.5 text-[11px] text-slate-500 hover:bg-slate-100 rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAdjust(g.id, false)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded cursor-pointer"
                      >
                        - Withdraw
                      </button>
                      <button
                        onClick={() => handleAdjust(g.id, true)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded cursor-pointer"
                      >
                        + Deposit
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveAdjustId(g.id)}
                    className="w-full py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/60 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  >
                    + Add / Withdraw Funds
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
