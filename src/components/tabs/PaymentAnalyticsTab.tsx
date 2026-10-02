import React from 'react';
import { SaleRecord } from '../../types';
import { MultiChartSection } from '../MultiChartSection';

import { CreditCard, Wallet, TrendingUp } from 'lucide-react';

interface PaymentAnalyticsTabProps {
  data: SaleRecord[];
}

export const PaymentAnalyticsTab: React.FC<PaymentAnalyticsTabProps> = ({ data }) => {
  const paymentMap: Record<string, { sales: number; count: number }> = {};

  data.forEach((row) => {
    const label = row.payment === 'Ewallet' ? 'E-Wallet' : row.payment;
    if (!paymentMap[label]) paymentMap[label] = { sales: 0, count: 0 };
    paymentMap[label].sales += row.total;
    paymentMap[label].count += 1;
  });

  const entries = Object.entries(paymentMap).sort((a, b) => b[1].sales - a[1].sales);
  const totalSales = entries.reduce((acc, [, val]) => acc + val.sales, 0);
  const maxSales = Math.max(...entries.map(([, val]) => val.sales), 1);

  const monthSeries = ['2025-01', '2025-02', '2025-03'].map((month) => ({
    label: month.replace('2025-', ''),
    value: data.filter((r) => r.date.startsWith(month) && r.payment === 'Ewallet').reduce((acc, row) => acc + row.total, 0),
  }));
  const trendPoints = monthSeries.map((point, idx) => ({
    ...point,
    x: 30 + idx * 120,
    y: 160 - (point.value / Math.max(...monthSeries.map((p) => p.value), 1)) * 110,
  }));
  const trendPath = trendPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  const donutGradient = entries
    .map((item, index) => {
      const start = entries.slice(0, index).reduce((acc, [, value]) => acc + (value.sales / totalSales) * 100, 0);
      const end = start + (item[1].sales / totalSales) * 100;
      const color = ['#3b82f6', '#10b981', '#8b5cf6'][index % 3];
      return `${color} ${start}% ${end}%`;
    })
    .join(', ');

  return (
    <div className="space-y-6 bg-[#eef1f5] p-2 rounded-[32px]">
      <div className="bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[28px] p-4 shadow-[0_12px_26px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Payment Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Payment method mix, transactions, and channel contribution by revenue.
            </p>
          </div>
          <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg">
            Digital share: {((entries.find(([k]) => k === 'E-Wallet')?.[1]?.sales || 0) / totalSales * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {entries.map(([label, value]) => (
          <div key={label} className="bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[24px] p-4 shadow-[0_10px_22px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase text-slate-500 dark:text-slate-400">{label}</span>
              <Wallet className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">${value.sales.toFixed(0)}</div>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{value.count} transactions</div>
            <div className="mt-3 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                style={{ width: `${(value.sales / maxSales) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[30px] p-5 shadow-[0_12px_20px_rgba(15,23,42,0.03)] xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">E-Wallet Trend</h3>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <svg viewBox="0 0 300 180" className="w-full h-36">
            {[0, 25, 50, 75, 100].map((tick) => (
              <line key={tick} x1="20" x2="280" y1={150 - (tick / 100) * 120} y2={150 - (tick / 100) * 120} stroke="#e2e8f0" strokeDasharray="4 4" />
            ))}
            <path d={trendPath} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {trendPoints.map((point) => (
              <g key={point.label}>
                <circle cx={point.x} cy={point.y} r="4" fill="#fff" stroke="#10b981" strokeWidth="2" />
                <text x={point.x} y="170" textAnchor="middle" fill="#64748b" fontSize="10">{point.label}</text>
              </g>
            ))}
          </svg>
        </div>

        <div className="bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[30px] p-5 shadow-[0_12px_20px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Payment Mix</h3>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40 rounded-full" style={{ background: `conic-gradient(${donutGradient})` }}>
              <div className="absolute inset-5 rounded-full bg-white" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Sales</span>
                <span className="text-xl font-black text-slate-800">${(totalSales / 1000).toFixed(1)}K</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {entries.map(([label, value], index) => (
              <div key={label} className="flex items-center justify-between text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6'][index % 3] }} />
                  {label}
                </div>
                <span className="font-bold">{((value.sales / totalSales) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
          <MultiChartSection data={data} title="Payment Analytics" />
    </div>
  );
};