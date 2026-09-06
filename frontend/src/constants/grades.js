/**
 * Central Grade Configuration
 * The assignment specifies Grade-wise size ratios for products (Grade A, B, C, D).
 * All grade styling is strictly derived from the brand palette:
 * Indigo-violet tints, Warm coral tints, and Slate neutrals.
 */

export const GRADES = ['A', 'B', 'C', 'D'];

export const DEFAULT_GRADE = 'A';

export const GRADE_CONFIG = {
  A: {
    label: 'Grade A',
    description: 'Prime Selection — Standard ratio benchmark',
    pillClass: 'grade-pill-A',
    badgeBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    colorHex: '#4338CA',
    defaultRatioValue: 2,
  },
  B: {
    label: 'Grade B',
    description: 'Core Commercial — Fast-moving retail mix',
    pillClass: 'grade-pill-B',
    badgeBg: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    colorHex: '#F97316',
    defaultRatioValue: 2,
  },
  C: {
    label: 'Grade C',
    description: 'Value Balanced — Entry price distribution',
    pillClass: 'grade-pill-C',
    badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    colorHex: '#475569',
    defaultRatioValue: 1,
  },
  D: {
    label: 'Grade D',
    description: 'Outlet / Volume — Uniform distribution',
    pillClass: 'grade-pill-D',
    badgeBg: 'bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400 border-slate-200 dark:border-slate-800',
    colorHex: '#64748B',
    defaultRatioValue: 1,
  },
};

export const RATIO_LEVELS = [
  { id: 'Brick', label: 'Brick Level', description: 'Group by item type (e.g. Dresses, Shirts, Trousers)' },
  { id: 'Category', label: 'Category Level', description: 'Group by wear category (e.g. Top_Wear, Bottom_Wear)' },
  { id: 'Brick_Neck', label: 'Brick + Neck', description: 'Group by Brick and Neck style combined' },
  { id: 'Brick_Sleeve', label: 'Brick + Sleeve', description: 'Group by Brick and Sleeve length combined' },
];
