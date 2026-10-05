import React from 'react';
import {
  Utensils,
  Shirt,
  GraduationCap,
  Home,
  Bus,
  Gamepad2,
  Sparkles,
  Laptop,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';
import { ExpenseCategory } from '../types';
import { CATEGORIES } from '../data/categories';

interface CategoryIconProps {
  category: ExpenseCategory;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ICON_MAP: Record<ExpenseCategory, LucideIcon> = {
  food: Utensils,
  clothing: Shirt,
  academics: GraduationCap,
  hostel: Home,
  commute: Bus,
  entertainment: Gamepad2,
  personal_care: Sparkles,
  tech: Laptop,
  misc: HelpCircle,
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  className = '',
  size = 'md',
}) => {
  const IconComponent = ICON_MAP[category] || HelpCircle;
  const cat = CATEGORIES[category] || CATEGORIES.misc;

  const sizeClasses = {
    sm: 'w-7 h-7 p-1.5 text-xs',
    md: 'w-10 h-10 p-2.5 text-sm',
    lg: 'w-12 h-12 p-3 text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={`rounded-xl flex items-center justify-center shrink-0 ${cat.bgColor} ${cat.textColor} ${sizeClasses[size]} ${className}`}
    >
      <IconComponent className={iconSizes[size]} />
    </div>
  );
};
