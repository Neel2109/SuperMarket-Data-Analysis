import React from 'react';
import { SaleRecord } from '../../types';
import { MultiChartSection } from '../MultiChartSection';

import { BadgePercent, TrendingDown, Sparkles } from 'lucide-react';

interface DiscountPromotionTabProps {
  data: SaleRecord[];
}

export const DiscountPromotionTab: React.FC<DiscountPromotionTabProps> = ({ data }) => {
  const discountByCategory: Record<string, number> = {};
  data.forEach((row) => {
    discountByCategory[row.productLine] = (discountByCategory[row.productLine] || 0) + row.total * 0.05;
  });

  const totalDiscount = Object.values(discountByCategory).reduce((a, b) => a + b, 0);
  const entries = Object.entries(discountByCategory).sort((a, b) => b[1] - a[1]);
  const maxDiscount = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BadgePercent className="w-5 h-5 text-orange-600" />
              Discount & Promotion Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Monitoring promotional value, category discount impact, and price sensitivity.
            </p>
          </div>
          <div className="px-3 py-1.5 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs font-semibold rounded-lg">
            Total Discount: ${totalDiscount.toFixed(0)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">Avg Discount</div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">5.0%</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">Promotions</div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">12</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">Best Promo Fit</div>
          <div className="mt-3 text-2xl font-black text-orange-600 font-mono">Food</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-orange-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Discount Sensitivity by Category</h3>
        </div>
        <div className="space-y-4">
          {entries.map(([label, value]) => (
            <div key={label}>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                <span>{label}</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">${value.toFixed(0)}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
                  style={{ width: `${(value / maxDiscount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
          <MultiChartSection data={data} title="Discount Promotion Analytics" />
    </div>
  );
};