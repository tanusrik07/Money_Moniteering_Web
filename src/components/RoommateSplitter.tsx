import React, { useState } from 'react';
import {
  Users,
  Plus,
  CheckCircle,
  Copy,
  Trash2,
  DollarSign,
  ArrowRight,
  Share2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { ExpenseCategory, SplitBill, SplitParticipant } from '../types';
import { CATEGORIES } from '../data/categories';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface RoommateSplitterProps {
  splitBills: SplitBill[];
  onAddSplitBill: (bill: Omit<SplitBill, 'id'>) => void;
  onToggleParticipantPaid: (billId: string, participantName: string) => void;
  onToggleBillSettled: (billId: string) => void;
  onDeleteSplitBill: (billId: string) => void;
  onLogShareAsExpense: (bill: SplitBill, myShare: number) => void;
  currencySymbol: string;
}

export const RoommateSplitter: React.FC<RoommateSplitterProps> = ({
  splitBills,
  onAddSplitBill,
  onToggleParticipantPaid,
  onToggleBillSettled,
  onDeleteSplitBill,
  onLogShareAsExpense,
  currencySymbol,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidBy, setPaidBy] = useState('You');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [friendsInput, setFriendsInput] = useState('You, Priya, Kavya');
  const [notes, setNotes] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Financial calculations
  let totalYouAreOwed = 0;
  let totalYouOwe = 0;

  splitBills.forEach((b) => {
    if (b.settled) return;
    if (b.paidBy.toLowerCase() === 'you') {
      // You paid! Other unpaid participants owe you
      b.participants.forEach((p) => {
        if (p.name.toLowerCase() !== 'you' && !p.hasPaid) {
          totalYouAreOwed += p.share;
        }
      });
    } else {
      // Someone else paid! If You haven't paid, you owe them
      const myPart = b.participants.find((p) => p.name.toLowerCase() === 'you');
      if (myPart && !myPart.hasPaid) {
        totalYouOwe += myPart.share;
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(totalAmount);
    if (!title.trim() || isNaN(amount) || amount <= 0) return;

    const names = friendsInput
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean);

    if (names.length === 0) return;

    // Equal split calculation
    const sharePerPerson = Math.round((amount / names.length) * 100) / 100;

    const participants: SplitParticipant[] = names.map((name) => ({
      name,
      share: sharePerPerson,
      // If 'paidBy' is this person, they have already paid
      hasPaid: name.toLowerCase() === paidBy.toLowerCase(),
    }));

    onAddSplitBill({
      title: title.trim(),
      totalAmount: amount,
      paidBy: paidBy.trim(),
      category,
      date: new Date().toISOString().split('T')[0],
      participants,
      settled: false,
      notes: notes.trim() || undefined,
    });

    // Reset
    setTitle('');
    setTotalAmount('');
    setNotes('');
    setIsAdding(false);
  };

  const copyWhatsAppSummary = (b: SplitBill) => {
    const list = b.participants
      .map((p) => `• ${p.name}: ${currencySymbol}${p.share} (${p.hasPaid ? 'Paid ✅' : 'Pending ⏳'})`)
      .join('\n');
    const text = `*Campus Split: ${b.title}*\nTotal: ${currencySymbol}${b.totalAmount} (Paid by ${b.paidBy})\n\nSplit Breakdown:\n${list}\n\n_Sent via CampusSpend_`;

    navigator.clipboard.writeText(text);
    setCopiedId(b.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header and Balances */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Roommate & Friend Bill Splitter</h2>
            <p className="text-xs text-slate-500">
              Split canteen meals, hostel Wi-Fi, late night food delivery, and auto rides effortlessly
            </p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Close Form' : 'New Split Bill'}</span>
          </button>
        </div>

        {/* Balance Status Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                You Are Owed (Collect)
              </span>
              <p className="text-xs text-emerald-700/80 mt-0.5">From roommates & friends</p>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-emerald-700 tabular-nums">
              +{formatCurrency(totalYouAreOwed, currencySymbol)}
            </span>
          </div>

          <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">
                You Owe (Pay Back)
              </span>
              <p className="text-xs text-rose-700/80 mt-0.5">To friends who covered you</p>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-rose-700 tabular-nums">
              -{formatCurrency(totalYouOwe, currencySymbol)}
            </span>
          </div>
        </div>
      </div>

      {/* Add Split Bill Form (Collapsible) */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-xl border border-indigo-200 bg-indigo-50/30 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-indigo-950">Add Roommate / Group Bill</h3>
            <span className="text-xs text-slate-500">Calculates equal shares automatically</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Bill Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Canteen Snacks, Oct Wi-Fi, Auto to Station"
                className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Total Bill Amount ({currencySymbol}) *
              </label>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 text-xs font-bold tabular-nums text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Who Paid?
              </label>
              <input
                type="text"
                required
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                placeholder="You or friend's name"
                className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden cursor-pointer"
              >
                {Object.values(CATEGORIES).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                People Splitting (comma separated)
              </label>
              <input
                type="text"
                required
                value={friendsInput}
                onChange={(e) => setFriendsInput(e.target.value)}
                placeholder="You, Alex, Priya"
                className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
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
              Create Split
            </button>
          </div>
        </form>
      )}

      {/* Split Bills List */}
      <div className="space-y-3">
        {splitBills.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
            <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">No Split Bills Recorded</h3>
            <p className="text-xs text-slate-500 mt-1">
              Add your first shared expense with roommates or canteen group.
            </p>
          </div>
        ) : (
          splitBills.map((b) => {
            const isYouPayer = b.paidBy.toLowerCase() === 'you';
            const myShare =
              b.participants.find((p) => p.name.toLowerCase() === 'you')?.share ||
              Math.round((b.totalAmount / b.participants.length) * 100) / 100;

            const allPaid = b.participants.every((p) => p.hasPaid);

            return (
              <div
                key={b.id}
                className={`p-4 rounded-xl border transition-all bg-white shadow-xs ${
                  b.settled ? 'border-slate-200 opacity-60' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={b.category} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{b.title}</h4>
                        {b.settled && (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Settled
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <span>Paid by <strong className="text-slate-800">{b.paidBy}</strong></span>
                        <span>·</span>
                        <span>{formatDateDisplay(b.date)}</span>
                        <span>·</span>
                        <span>Your share: <strong className="text-indigo-600 tabular-nums">{formatCurrency(myShare, currencySymbol)}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Bill Total */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums mr-2">
                      {formatCurrency(b.totalAmount, currencySymbol)}
                    </span>

                    {/* Copy WhatsApp Split */}
                    <button
                      onClick={() => copyWhatsAppSummary(b)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Copy breakdown for WhatsApp group"
                    >
                      {copiedId === b.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>

                    {/* Log to My Personal Expenses */}
                    <button
                      onClick={() => onLogShareAsExpense(b, myShare)}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                      title="Add your share to your personal expense ledger"
                    >
                      Log Share
                    </button>

                    {/* Toggle Settled */}
                    <button
                      onClick={() => onToggleBillSettled(b.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        b.settled
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {b.settled ? 'Reopen' : 'Settle'}
                    </button>

                    <button
                      onClick={() => onDeleteSplitBill(b.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete bill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Participant breakdown chips */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-600 font-semibold mr-1">Participants:</span>
                  {b.participants.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => onToggleParticipantPaid(b.id, p.name)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                        p.hasPaid
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                          : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                      }`}
                      title="Click to toggle paid status"
                    >
                      <span>{p.name}: {formatCurrency(p.share, currencySymbol)}</span>
                      {p.hasPaid ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <span className="text-[10px] text-amber-600 font-bold">Unpaid</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
