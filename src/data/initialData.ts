import { CategoryBudget, SavingsGoal, SplitBill, StudentProfile, Transaction } from '../types';

export const INITIAL_PROFILE: StudentProfile = {
  name: 'Tanusri K.',
  collegeName: 'KGiSL Institute of Technology',
  major: 'B.Tech Artificial Intelligence & Data Science',
  year: '3rd Year (Semester 5)',
  monthlyAllowance: 12000,
  currencySymbol: '₹',
  currencyCode: 'INR',
  budgetCycleDay: 1,
};

// Generates dates within the current month so data is always fresh and realistic
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
const day = (d: number) => `${currentYear}-${currentMonth}-${String(Math.min(Math.max(1, d), 28)).padStart(2, '0')}`;

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'income',
    title: 'Monthly Pocket Money from Parents',
    amount: 10000,
    category: 'misc',
    paymentMethod: 'net_banking',
    date: day(1),
    notes: 'Transferred on 1st of the month for hostel & food allowance',
    tags: ['allowance', 'parents']
  },
  {
    id: 'tx-2',
    type: 'income',
    title: 'Weekend Python Tutoring Stipend',
    amount: 2500,
    category: 'misc',
    paymentMethod: 'upi',
    date: day(3),
    notes: 'Teaching 1st-year juniors basic programming',
    tags: ['tutoring', 'freelance']
  },
  {
    id: 'tx-3',
    type: 'expense',
    title: 'Campus Canteen - Masala Dosa & Filter Coffee',
    amount: 120,
    category: 'food',
    paymentMethod: 'upi',
    date: day(2),
    notes: 'Morning breakfast with roomies',
    tags: ['canteen', 'breakfast']
  },
  {
    id: 'tx-4',
    type: 'expense',
    title: 'H&M College Fest Denim Jacket & Tee',
    amount: 1850,
    category: 'clothing',
    paymentMethod: 'card',
    date: day(2),
    notes: 'Semi-annual fest outfit discount purchase',
    tags: ['fest', 'shopping']
  },
  {
    id: 'tx-5',
    type: 'expense',
    title: 'Machine Learning Reference Book & Lab Printouts',
    amount: 680,
    category: 'academics',
    paymentMethod: 'cash',
    date: day(3),
    notes: 'Spiral binding of 180-page research paper drafts',
    tags: ['printout', 'lab']
  },
  {
    id: 'tx-6',
    type: 'expense',
    title: 'Hostel PG Electricity & High-speed Wi-Fi share',
    amount: 950,
    category: 'hostel',
    paymentMethod: 'upi',
    date: day(1),
    notes: 'Split among 3 roommates',
    tags: ['pg', 'wifi']
  },
  {
    id: 'tx-7',
    type: 'expense',
    title: 'Monthly Student Metro Rail Smart Card Recharge',
    amount: 700,
    category: 'commute',
    paymentMethod: 'card',
    date: day(2),
    notes: 'Daily commute to campus & project center',
    tags: ['metro', 'pass']
  },
  {
    id: 'tx-8',
    type: 'expense',
    title: 'Late Night Swiggy Biryani with Roommates',
    amount: 340,
    category: 'food',
    paymentMethod: 'upi',
    date: day(4),
    notes: 'Coding marathon late night snack',
    tags: ['late-night', 'hostel']
  },
  {
    id: 'tx-9',
    type: 'expense',
    title: 'Spotify Premium Student Subscription',
    amount: 59,
    category: 'tech',
    paymentMethod: 'card',
    date: day(3),
    notes: '50% student discount plan',
    tags: ['subscription', 'study-music']
  },
  {
    id: 'tx-10',
    type: 'expense',
    title: 'College Cultural Fest DJ Night Entry Pass',
    amount: 450,
    category: 'entertainment',
    paymentMethod: 'upi',
    date: day(4),
    notes: 'Early bird ticket for inter-college annual fest',
    tags: ['fest', 'tickets']
  },
  {
    id: 'tx-11',
    type: 'expense',
    title: 'Hostel Laundry Service - 10 Tokens',
    amount: 250,
    category: 'personal_care',
    paymentMethod: 'cash',
    date: day(4),
    notes: 'Washing and iron tokens for the fortnight',
    tags: ['laundry', 'hostel']
  },
  {
    id: 'tx-12',
    type: 'expense',
    title: 'Campus Cafe Cold Brew & Brownie',
    amount: 190,
    category: 'food',
    paymentMethod: 'campus_card',
    date: day(4),
    notes: 'Between algorithm lectures',
    tags: ['cafe', 'snack']
  }
];

export const INITIAL_BUDGETS: CategoryBudget[] = [
  { category: 'food', monthlyLimit: 4000 },
  { category: 'clothing', monthlyLimit: 2500 },
  { category: 'academics', monthlyLimit: 1500 },
  { category: 'hostel', monthlyLimit: 2000 },
  { category: 'commute', monthlyLimit: 1200 },
  { category: 'entertainment', monthlyLimit: 1500 },
  { category: 'personal_care', monthlyLimit: 800 },
  { category: 'tech', monthlyLimit: 600 },
  { category: 'misc', monthlyLimit: 1000 },
];

export const INITIAL_SPLIT_BILLS: SplitBill[] = [
  {
    id: 'split-1',
    title: 'Hostel Room 304 High-Speed Wi-Fi (Oct)',
    totalAmount: 1200,
    paidBy: 'You',
    category: 'hostel',
    date: day(1),
    settled: false,
    notes: 'Router upgrade + 200 Mbps fiber plan',
    participants: [
      { name: 'You', share: 400, hasPaid: true },
      { name: 'Priya', share: 400, hasPaid: true },
      { name: 'Kavya', share: 400, hasPaid: false },
    ]
  },
  {
    id: 'split-2',
    title: 'Dominos Pizza Party after Hackathon Win',
    totalAmount: 980,
    paidBy: 'Rahul',
    category: 'food',
    date: day(3),
    settled: false,
    notes: 'Rahul paid the bill via GPay',
    participants: [
      { name: 'Rahul', share: 245, hasPaid: true },
      { name: 'You', share: 245, hasPaid: false },
      { name: 'Ananya', share: 245, hasPaid: true },
      { name: 'Vikas', share: 245, hasPaid: false },
    ]
  }
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    title: 'Semester End Goa Road Trip',
    targetAmount: 8000,
    currentAmount: 4800,
    targetDate: `${currentYear}-12-20`,
    category: 'Travel & Fun',
    notes: 'Train tickets, hostel stay, and beach scooty rental'
  },
  {
    id: 'goal-2',
    title: 'Noise Cancelling Headphones for Study',
    targetAmount: 4500,
    currentAmount: 3100,
    targetDate: `${currentYear}-11-15`,
    category: 'Gadgets',
    notes: 'Need for studying in noisy hostel common room'
  },
  {
    id: 'goal-3',
    title: 'Emergency Student Reserve',
    targetAmount: 3000,
    currentAmount: 3000,
    targetDate: `${currentYear}-10-30`,
    category: 'Safety Net',
    notes: 'Buffer in case parents transfer gets delayed'
  }
];
