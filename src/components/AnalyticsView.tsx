import React, { useState } from 'react';
import { PieChart, BarChart3, Lightbulb, Wallet, ArrowUpRight, TrendingUp } from 'lucide-react';
import { ExpenseCategory, Transaction } from '../types';
import { CATEGORIES, PAYMENT_METHODS } from '../data/categories';
import { formatCurrency } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface AnalyticsViewProps {
  transactions: Transaction[];
  currencySymbol: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  transactions,
  currencySymbol,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<ExpenseCategory | null>(null);

  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const monthExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(currentMonthPrefix)
  );

  const totalExpense = monthExpenses.reduce((sum, t) => sum + t.amount, 0);

  // Group expenses by category
  const categoryTotals = monthExpenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const sortedCategories = (Object.keys(categoryTotals) as ExpenseCategory[])
    .map((cat) => ({
      category: cat,
      amount: categoryTotals[cat],
      percentage: totalExpense > 0 ? Math.round((categoryTotals[cat] / totalExpense) * 100) : 0,
      info: CATEGORIES[cat] || CATEGORIES.misc,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Group expenses by payment method
  const paymentTotals = monthExpenses.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  // Last 7 days spending
  const last7DaysData: { dateStr: string; label: string; amount: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayAmount = transactions
      .filter((t) => t.type === 'expense' && t.date === dateStr)
      .reduce((sum, t) => sum + t.amount, 0);
    last7DaysData.push({ dateStr, label: dayLabel, amount: dayAmount });
  }

  const maxDailyAmount = Math.max(1, ...last7DaysData.map((d) => d.amount));

  // Compute SVG Donut Chart Paths
  let cumulativeAngle = 0;
  const donutSlices = sortedCategories.map((item) => {
    const angle = (item.amount / (totalExpense || 1)) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    // Convert polar to cartesian
    const radius = 80;
    const innerRadius = 52;
    const cx = 100;
    const cy = 100;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const x3 = cx + innerRadius * Math.cos(endRad);
    const y3 = cy + innerRadius * Math.sin(endRad);
    const x4 = cx + innerRadius * Math.cos(startRad);
    const y4 = cy + innerRadius * Math.sin(startRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      'Z',
    ].join(' ');

    return {
      category: item.category,
      pathData,
      color: item.info.color,
      item,
    };
  });

  // College Student Smart Financial Insights
  const foodPct = sortedCategories.find((c) => c.category === 'food')?.percentage || 0;
  const clothingPct = sortedCategories.find((c) => c.category === 'clothing')?.percentage || 0;
  const upiPct = totalExpense > 0 ? Math.round(((paymentTotals['upi'] || 0) / totalExpense) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
        <h2 className="text-base font-bold text-slate-900">Student Spending Analytics & Insights</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Clear visual breakdown of where your monthly pocket money flows
        </p>
      </div>

      {/* Main Visuals Grid: Category Donut + 7-Day Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Donut & Breakdown */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              <span>Category Expenditure Share</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold tabular-nums">
              Total: {formatCurrency(totalExpense, currencySymbol)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            {/* SVG Donut */}
            <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
              {totalExpense === 0 ? (
                <div className="w-36 h-36 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
                  No data yet
                </div>
              ) : (
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {donutSlices.map((slice) => {
                    const isHovered = hoveredCategory === slice.category;
                    return (
                      <path
                        key={slice.category}
                        d={slice.pathData}
                        fill={slice.color}
                        className="transition-all duration-200 cursor-pointer hover:opacity-90"
                        style={{
                          transformOrigin: '100px 100px',
                          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        }}
                        onMouseEnter={() => setHoveredCategory(slice.category)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      />
                    );
                  })}
                </svg>
              )}

              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                {hoveredCategory ? (
                  <>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">
                      {CATEGORIES[hoveredCategory]?.shortName}
                    </span>
                    <span className="text-base font-bold text-slate-900 tabular-nums">
                      {formatCurrency(categoryTotals[hoveredCategory] || 0, currencySymbol)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Spent</span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {formatCurrency(totalExpense, currencySymbol)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Category breakdown list */}
            <div className="flex-1 w-full space-y-2 overflow-y-auto max-h-56 pr-1">
              {sortedCategories.map((item) => (
                <div
                  key={item.category}
                  onMouseEnter={() => setHoveredCategory(item.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer text-xs ${
                    hoveredCategory === item.category ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.info.color }}
                    />
                    <span className="truncate text-slate-800">{item.info.shortName}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatCurrency(item.amount, currencySymbol)}
                    </span>
                    <span className="text-slate-500 tabular-nums w-8 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7-Day Velocity Histogram */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>Past 7 Days Burn Velocity</span>
              </h3>
              <span className="text-xs text-slate-500">Daily spending trend</span>
            </div>

            {/* Bar Chart */}
            <div className="pt-6 pb-2 flex items-end justify-between gap-2 h-44">
              {last7DaysData.map((d) => {
                const heightPct = maxDailyAmount > 0 ? (d.amount / maxDailyAmount) * 100 : 0;
                return (
                  <div key={d.dateStr} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] text-slate-500 font-semibold tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatCurrency(d.amount, currencySymbol)}
                    </span>
                    <div className="w-full bg-slate-100 rounded-t-md h-32 flex items-end p-0.5">
                      <div
                        className="w-full bg-indigo-600 rounded-t-sm transition-all duration-300 group-hover:bg-indigo-700"
                        style={{ height: `${Math.max(4, heightPct)}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method breakdown */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Payment Mode Utilization:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PAYMENT_METHODS.slice(0, 4).map((pm) => {
                const amt = paymentTotals[pm.id] || 0;
                const pct = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
                return (
                  <div key={pm.id} className="p-2 rounded-lg bg-slate-50 text-center">
                    <span className="text-[11px] text-slate-500 block truncate">{pm.short}</span>
                    <span className="text-xs font-bold text-slate-900 tabular-nums block">
                      {formatCurrency(amt, currencySymbol)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Campus Financial Insights & Tips */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">Student Money Optimization Tips</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Tip 1: Food */}
          <div className="p-3.5 bg-orange-50/60 border border-orange-200/70 rounded-xl">
            <span className="text-xs font-bold text-orange-950 block">
              🍜 Food & Canteen ({foodPct}% of budget)
            </span>
            <p className="text-xs text-orange-900/80 mt-1 leading-relaxed">
              {foodPct > 40
                ? 'Food exceeds 40% of your total spending. Opting for hostel mess breakfasts over canteen coffee runs can free up ₹600/month for savings.'
                : 'Your food spending is well balanced! Keep tracking late night food delivery apps to prevent stealth budget leaks.'}
            </p>
          </div>

          {/* Tip 2: Clothing & Fest Style */}
          <div className="p-3.5 bg-purple-50/60 border border-purple-200/70 rounded-xl">
            <span className="text-xs font-bold text-purple-950 block">
              👕 Clothing & Festive Wear ({clothingPct}% of budget)
            </span>
            <p className="text-xs text-purple-900/80 mt-1 leading-relaxed">
              {clothingPct > 25
                ? 'High clothing outlay this month. Check college thrift groups or swap fest jackets with friends rather than buying brand new for single events.'
                : 'Great discipline on apparel! Sticking to your clothing budget gives you room for weekend road trips.'}
            </p>
          </div>

          {/* Tip 3: Digital Payments (UPI / Micro-transactions) */}
          <div className="p-3.5 bg-indigo-50/60 border border-indigo-200/70 rounded-xl">
            <span className="text-xs font-bold text-indigo-950 block">
              ⚡ UPI & Micro-Spend Alert ({upiPct}% via UPI)
            </span>
            <p className="text-xs text-indigo-900/80 mt-1 leading-relaxed">
              UPI makes ₹20-50 tea, prints, and snacks invisible. Your logs help you see every quick tap before small charges drain your balance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
