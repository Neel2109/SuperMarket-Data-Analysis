import React from 'react';
import { SaleRecord } from '../../types';
import { MultiChartSection } from '../MultiChartSection';

import { TrendingUp, Percent, DollarSign, Layers3 } from 'lucide-react';

interface ProfitabilityTabProps {
  data: SaleRecord[];
}

export const ProfitabilityTab: React.FC<ProfitabilityTabProps> = ({ data }) => {
  const totalSales = data.reduce((acc, r) => acc + r.total, 0);
  const totalCogs = data.reduce((acc, r) => acc + r.cogs, 0);
  const grossProfit = totalSales - totalCogs;
  const margin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;

  const categoryMap: Record<string, { sales: number; profit: number; margin: number }> = {};
  data.forEach((row) => {
    if (!categoryMap[row.productLine]) {
      categoryMap[row.productLine] = { sales: 0, profit: 0, margin: 0 };
    }
    categoryMap[row.productLine].sales += row.total;
    categoryMap[row.productLine].profit += row.grossIncome;
  });

  Object.entries(categoryMap).forEach(([key, value]) => {
    value.margin = value.sales > 0 ? (value.profit / value.sales) * 100 : 0;
  });

  const sorted = Object.entries(categoryMap).sort((a, b) => b[1].profit - a[1].profit);
  const maxProfit = Math.max(...sorted.map(([, v]) => v.profit), 1);

  const monthlyProfit = ['2025-01', '2025-02', '2025-03'].map((month) => {
    const rows = data.filter((r) => r.date.startsWith(month));
    const sales = rows.reduce((acc, r) => acc + r.total, 0);
    const profitValue = rows.reduce((acc, r) => acc + r.grossIncome, 0);
    return { label: month.replace('2025-', ''), sales, profit: profitValue };
  });

  const profitTrend = monthlyProfit.map((point, idx) => ({
    ...point,
    x: 30 + idx * 120,
    y: 150 - (point.profit / Math.max(...monthlyProfit.map((p) => p.profit), 1)) * 110,
  }));
  const trendPath = profitTrend.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  const donutGradient = sorted
    .map((item, index) => {
      const total = sorted.reduce((acc, [, value]) => acc + value.profit, 0) || 1;
      const start = sorted.slice(0, index).reduce((acc, [, value]) => acc + (value.profit / total) * 100, 0);
      const end = start + (item[1].profit / total) * 100;
      const color = ['#34d399', '#3b82f6', '#a78bfa', '#f59e0b'][index % 4];
      return `${color} ${start}% ${end}%`;
    })
    .join(', ');

  return (
    <div className="space-y-6 bg-[#eef1f5] p-2 rounded-[32px]">
      <div className="bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[28px] p-4 shadow-[0_12px_26px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Profitability Analysis
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Gross margin, product profitability, and branch-level performance insight.
            </p>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-lg">
            Margin: {margin.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">Gross Sales</div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">${totalSales.toFixed(0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">COGS</div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">${totalCogs.toFixed(0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">Gross Profit</div>
          <div className="mt-3 text-2xl font-black text-emerald-600 font-mono">${grossProfit.toFixed(0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">Gross Margin</div>
          <div className="mt-3 text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">{margin.toFixed(2)}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[30px] p-5 shadow-[0_12px_20px_rgba(15,23,42,0.03)] xl:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Layers3 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Profit by Product Category</h3>
          </div>
          <div className="space-y-4">
            {sorted.map(([label, value]) => (
              <div key={label}>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                  <span>{label}</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">${value.profit.toFixed(0)}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600"
                    style={{ width: `${(value.profit / maxProfit) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[30px] p-5 shadow-[0_12px_20px_rgba(15,23,42,0.03)]">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Monthly Profit Trend</h3>
          <svg viewBox="0 0 300 180" className="w-full h-36">
            {[0, 25, 50, 75, 100].map((tick) => (
              <line key={tick} x1="20" x2="280" y1={150 - (tick / 100) * 120} y2={150 - (tick / 100) * 120} stroke="#e2e8f0" strokeDasharray="4 4" />
            ))}
            <path d={trendPath} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {profitTrend.map((point) => (
              <g key={point.label}>
                <circle cx={point.x} cy={point.y} r="4" fill="#fff" stroke="#10b981" strokeWidth="2" />
                <text x={point.x} y="170" textAnchor="middle" fill="#64748b" fontSize="10">{point.label}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Percent className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Profit Mix</h3>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40 rounded-full" style={{ background: `conic-gradient(${donutGradient})` }}>
              <div className="absolute inset-5 rounded-full bg-white" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Profit</span>
                <span className="text-xl font-black text-slate-800">${(grossProfit / 1000).toFixed(1)}K</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {sorted.map(([label, value], index) => (
              <div key={label} className="flex items-center justify-between text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ['#34d399', '#3b82f6', '#a78bfa', '#f59e0b'][index % 4] }} />
                  {label}
                </div>
                <span className="font-bold">{((value.profit / grossProfit) * 100 || 0).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
          <MultiChartSection data={data} title="Profitability Analytics" />
    </div>
  );
};