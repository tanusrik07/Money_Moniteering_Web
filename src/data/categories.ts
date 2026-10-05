import { CategoryInfo, ExpenseCategory } from '../types';

export const CATEGORIES: Record<ExpenseCategory, CategoryInfo> = {
  food: {
    id: 'food',
    name: 'Food & Canteen',
    shortName: 'Food',
    iconName: 'Utensils',
    color: '#EA580C', // Orange
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    description: 'Hostel mess, college canteen, late night snacks, Swiggy/Zomato, cafes',
    collegeExamples: ['Canteen Dosa & Chai', 'Late Night Maggi / Pizza', 'Hostel Mess Fee', 'Groceries & Fruits']
  },
  clothing: {
    id: 'clothing',
    name: 'Clothing & Apparel',
    shortName: 'Clothing',
    iconName: 'Shirt',
    color: '#8B5CF6', // Purple
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    description: 'College fest wear, everyday casuals, thrift finds, winter jackets, sneakers',
    collegeExamples: ['College Fest Outfit', 'Sneakers / Footwear', 'Thrift Store Finds', 'Department Hoodie']
  },
  academics: {
    id: 'academics',
    name: 'Academics & Study',
    shortName: 'Academics',
    iconName: 'GraduationCap',
    color: '#0284C7', // Sky blue
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-700',
    borderColor: 'border-sky-200',
    description: 'Textbooks, photocopies/prints, lab manuals, stationery, exam/cert fees',
    collegeExamples: ['Photocopy / Printouts', 'Engineering / Medical Textbooks', 'Semester Exam Fees', 'Notebooks & Pens']
  },
  hostel: {
    id: 'hostel',
    name: 'Hostel & Living',
    shortName: 'Hostel/PG',
    iconName: 'Home',
    color: '#0D9488', // Teal
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-200',
    description: 'PG/Dorm rent, electricity bill, room cleaner, water bottles, room decor',
    collegeExamples: ['Monthly PG / Dorm Rent', 'Room Electricity Share', 'Water Dispenser Refill', 'Mattress / Bedding']
  },
  commute: {
    id: 'commute',
    name: 'Commute & Travel',
    shortName: 'Commute',
    iconName: 'Bus',
    color: '#D97706', // Amber
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    description: 'College bus/metro pass, auto rickshaw, bike petrol, holiday travel home',
    collegeExamples: ['Monthly Metro Pass', 'Auto / Cab Share with Friends', 'Scooter / Bike Petrol', 'Semester Break Train Ticket']
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment & Social',
    shortName: 'Social & Fun',
    iconName: 'Gamepad2',
    color: '#E11D48', // Rose
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    description: 'Movies, college fest passes, gaming cafe, weekend clubbing, birthdays',
    collegeExamples: ['Weekend Movie Ticket', 'Inter-College Fest Pass', 'Friend Birthday Contribution', 'Gaming Lounge']
  },
  personal_care: {
    id: 'personal_care',
    name: 'Personal Care & Health',
    shortName: 'Care & Health',
    iconName: 'Sparkles',
    color: '#10B981', // Emerald
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    description: 'Hostel laundry service, haircut, pharmacy/medicines, skincare & hygiene',
    collegeExamples: ['Hostel Laundry Tokens', 'Barber / Salon Haircut', 'First Aid / Medicines', 'Toiletries & Deodorant']
  },
  tech: {
    id: 'tech',
    name: 'Tech & Subscriptions',
    shortName: 'Tech & Subs',
    iconName: 'Laptop',
    color: '#6366F1', // Indigo
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    description: 'Student Spotify/Prime, mobile data recharge, USB cable/charger, cloud storage',
    collegeExamples: ['Spotify Student Plan', 'Mobile 5G Data Recharge', 'Phone Screen Protector/Cable', 'GitHub / Cloud Space']
  },
  misc: {
    id: 'misc',
    name: 'Miscellaneous & Emergency',
    shortName: 'Other',
    iconName: 'HelpCircle',
    color: '#64748B', // Slate
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-300',
    description: 'ID card replacement, unexpected campus fines, courier, repairs',
    collegeExamples: ['Lost ID Replacement', 'Emergency Bicycle Repair', 'Courier / Postal Delivery', 'College Union Dues']
  }
};

export const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / GPay / PhonePe', short: 'UPI' },
  { id: 'cash', label: 'Cash', short: 'Cash' },
  { id: 'card', label: 'Debit / ATM Card', short: 'Card' },
  { id: 'campus_card', label: 'Campus / Mess Card', short: 'Campus Card' },
  { id: 'net_banking', label: 'Net Banking', short: 'Bank' },
] as const;

export const CURRENCY_OPTIONS = [
  { symbol: '₹', code: 'INR', name: 'Indian Rupee (₹)' },
  { symbol: '$', code: 'USD', name: 'US Dollar ($)' },
  { symbol: '€', code: 'EUR', name: 'Euro (€)' },
  { symbol: '£', code: 'GBP', name: 'British Pound (£)' },
  { symbol: 'CA$', code: 'CAD', name: 'Canadian Dollar (CA$)' },
  { symbol: 'A$', code: 'AUD', name: 'Australian Dollar (A$)' }
];
