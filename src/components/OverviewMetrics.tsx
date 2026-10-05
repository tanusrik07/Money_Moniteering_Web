import React from 'react';
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { StudentProfile, Transaction, ExpenseCategory } from '../types';
import { formatCurrency, getDaysRemainingInMonth, getTotalDaysInMonth } from '../utils/formatters';
import { CATEGORIES } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';
import campusCoverArt from '../assets/images/campus_cover_art_1791181328921.jpg';
import studentAvatar from '../assets/images/avatar_student_user_1791181275304.jpg';

interface OverviewMetricsProps {
  transactions: Transaction[];
  profile: StudentProfile;
  onNavigateTab: (tab: 'expenses' | 'budgets' | 'split' | 'savings') => void;
  onOpenAddModal: () => void;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  transactions,
  profile,
  onNavigateTab,
  onOpenAddModal,
}) => {
  const symbol = profile.currencySymbol;
  const daysRemaining = getDaysRemainingInMonth();
  const totalDays = getTotalDaysInMonth();
  const daysElapsed = totalDays - daysRemaining + 1;

  // Filter for current month's transactions
  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const monthTransactions = transactions.filter((t) =>
    t.date.startsWith(currentMonthPrefix)
  );

  const totalIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  // If user has not logged separate income, use their configured monthly allowance
  const effectiveInflow = totalIncome > 0 ? totalIncome : profile.monthlyAllowance;
  const remainingBalance = effectiveInflow - totalExpense;
  const spentPercentage = Math.min(100, Math.round((totalExpense / (effectiveInflow || 1)) * 100));

  // Safe daily spend runway
  const safeDailySpend = Math.max(0, Math.floor(remainingBalance / daysRemaining));
  const avgDailySpendSoFar = Math.round(totalExpense / Math.max(1, daysElapsed));

  // Spending in top categories (Food, Clothing, Academics, etc.)
  const categoryTotals = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

  const foodSpent = categoryTotals['food'] || 0;
  const clothingSpent = categoryTotals['clothing'] || 0;
  const academicsSpent = categoryTotals['academics'] || 0;

  // Is the student pacing well?
  const expectedSpendRatio = (daysElapsed / totalDays) * 100;
  const isPacingWell = spentPercentage <= expectedSpendRatio + 10;

  return (
    <div className="space-y-6">
      {/* Campus Hero Card with Generated Visuals */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="h-32 sm:h-36 w-full relative overflow-hidden bg-slate-900">
          <img
            src={campusCoverArt}
            alt="University Campus Lawn"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-85"
            onError={(e) => {
              // Graceful CSS fallback container
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-3 left-4 sm:left-6 text-white">
            <span className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">
              Student Finance Hub
            </span>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
              {profile.collegeName || 'Campus University'}
            </h1>
          </div>
        </div>

        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-200 shrink-0">
              <img
                src={studentAvatar}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{profile.name}</h2>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {profile.year}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{profile.major}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="text-right sm:border-r border-slate-200 sm:pr-4">
              <span className="text-xs text-slate-500 block">Cycle Allowance</span>
              <span className="text-base font-bold text-slate-900 tabular-nums">
                {formatCurrency(effectiveInflow, symbol)}
              </span>
            </div>
            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
            >
              + Quick Expense
            </button>
          </div>
        </div>
      </div>

      {/* Core Financial Runways (3-Column Metric Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Remaining Pocket Money */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Remaining Balance
            </span>
            <div
              className={`p-2 rounded-lg ${
                remainingBalance >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${
                remainingBalance >= 0 ? 'text-slate-900' : 'text-rose-600'
              }`}
            >
              {formatCurrency(remainingBalance, symbol)}
            </span>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>{spentPercentage}% of monthly budget spent</span>
              <span>{100 - spentPercentage}% left</span>
            </div>
            {/* Minimal Progress Bar */}
            <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  spentPercentage > 90
                    ? 'bg-rose-500'
                    : spentPercentage > 75
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, spentPercentage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Daily Safe-to-Spend Limit (College Student Lifesaver) */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Daily Safe Runway
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-600 tabular-nums">
                {formatCurrency(safeDailySpend, symbol)}
              </span>
              <span className="text-xs font-medium text-slate-500">/ day</span>
            </div>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Safe spending pace across the remaining <strong className="text-slate-700">{daysRemaining} days</strong> this month.
            </p>
          </div>
        </div>

        {/* Month Spending Pace */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Current Spent
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {formatCurrency(totalExpense, symbol)}
            </span>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              {isPacingWell ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Spending on healthy pace</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-amber-700 font-medium">Higher burn rate than normal</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Daily Burn Rate So Far */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Avg Daily Burn
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                {formatCurrency(avgDailySpendSoFar, symbol)}
              </span>
              <span className="text-xs font-medium text-slate-500">/ day spent</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Over {daysElapsed} active days of this budget cycle.
            </p>
          </div>
        </div>
      </div>

      {/* College Life Highlight Spotlight (Focus on Food, Clothing, Academics) */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Essential College Spend Spotlights</h3>
            <p className="text-xs text-slate-500">
              Live monitor for your highest campus spending categories
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('budgets')}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            <span>View All Budgets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Food & Canteen */}
          <div className="p-4 rounded-lg bg-orange-50/50 border border-orange-100 flex items-start gap-3">
            <CategoryIcon category="food" size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-950">Food & Canteen</span>
                <span className="text-xs font-semibold text-orange-800 tabular-nums">
                  {formatCurrency(foodSpent, symbol)}
                </span>
              </div>
              <p className="text-xs text-orange-800/80 mt-1 line-clamp-1">
                Mess, snacks, tea/coffee, campus cafes
              </p>
              <div className="mt-2 w-full h-1.5 bg-orange-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${Math.min(100, (foodSpent / 4000) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Clothing & Fest Style */}
          <div className="p-4 rounded-lg bg-purple-50/50 border border-purple-100 flex items-start gap-3">
            <CategoryIcon category="clothing" size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-950">Clothing & Apparel</span>
                <span className="text-xs font-semibold text-purple-800 tabular-nums">
                  {formatCurrency(clothingSpent, symbol)}
                </span>
              </div>
              <p className="text-xs text-purple-800/80 mt-1 line-clamp-1">
                Fest outfits, casuals, thrift stores
              </p>
              <div className="mt-2 w-full h-1.5 bg-purple-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${Math.min(100, (clothingSpent / 2500) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Academics & Printouts */}
          <div className="p-4 rounded-lg bg-sky-50/50 border border-sky-100 flex items-start gap-3">
            <CategoryIcon category="academics" size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-950">Academics & Study</span>
                <span className="text-xs font-semibold text-sky-800 tabular-nums">
                  {formatCurrency(academicsSpent, symbol)}
                </span>
              </div>
              <p className="text-xs text-sky-800/80 mt-1 line-clamp-1">
                Books, stationery, photocopy & printouts
              </p>
              <div className="mt-2 w-full h-1.5 bg-sky-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full"
                  style={{ width: `${Math.min(100, (academicsSpent / 1500) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
