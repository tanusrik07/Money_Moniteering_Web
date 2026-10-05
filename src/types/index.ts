export type ExpenseCategory =
  | 'food'
  | 'clothing'
  | 'academics'
  | 'hostel'
  | 'commute'
  | 'entertainment'
  | 'personal_care'
  | 'tech'
  | 'misc';

export type TransactionType = 'expense' | 'income';

export type PaymentMethod = 'upi' | 'cash' | 'card' | 'campus_card' | 'net_banking';

export interface CategoryInfo {
  id: ExpenseCategory;
  name: string;
  shortName: string;
  iconName: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  description: string;
  collegeExamples: string[];
}

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  date: string; // YYYY-MM-DD
  time?: string;
  notes?: string;
  tags?: string[];
  isRecurring?: boolean;
}

export interface CategoryBudget {
  category: ExpenseCategory;
  monthlyLimit: number;
}

export interface SplitParticipant {
  name: string;
  share: number;
  hasPaid: boolean;
}

export interface SplitBill {
  id: string;
  title: string;
  totalAmount: number;
  paidBy: string; // e.g. "You" or roommate's name
  category: ExpenseCategory;
  date: string;
  participants: SplitParticipant[];
  settled: boolean;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  notes?: string;
}

export interface StudentProfile {
  name: string;
  collegeName: string;
  major: string;
  year: string;
  monthlyAllowance: number;
  currencySymbol: string;
  currencyCode: string;
  budgetCycleDay: number;
}
