import React from 'react';
import { SaleRecord } from '../../types';
import { MultiChartSection } from '../MultiChartSection';

import { PackageSearch, Boxes, ArrowDownRight, TrendingDown } from 'lucide-react';

interface InventoryTabProps {
  data: SaleRecord[];
}

export const InventoryTab: React.FC<InventoryTabProps> = ({ data }) => {
  const categoryMap: Record<string, number> = {};
  data.forEach((row) => {
    categoryMap[row.productLine] = (categoryMap[row.productLine] || 0) + row.quantity;
  });

  const topProducts = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const maxQty = Math.max(...topProducts.map(([, v]) => v), 1);

  const totalUnits = data.reduce((acc, row) => acc + row.quantity, 0);
  const inventoryValue = data.reduce((acc, row) => acc + row.unitPrice * row.quantity, 0);

  const monthlyUnits = ['2025-01', '2025-02', '2025-03'].map((month) => ({
    label: month.replace('2025-', ''),
    value: data.filter((r) => r.date.startsWith(month)).reduce((acc, row) => acc + row.quantity, 0),
  }));

  const trendPoints = monthlyUnits.map((point, idx) => ({
    ...point,
    x: 30 + idx * 120,
    y: 160 - (point.value / Math.max(...monthlyUnits.map((m) => m.value), 1)) * 110,
  }));
  const linePath = trendPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  const donutGradient = topProducts
    .map((item, index) => {
      const total = topProducts.reduce((acc, [, qty]) => acc + qty, 0) || 1;
      const start = topProducts.slice(0, index).reduce((acc, [, qty]) => acc + (qty / total) * 100, 0);
      const end = start + (item[1] / total) * 100;
      const color = ['#8b5cf6', '#3b82f6', '#34d399', '#f59e0b'][index % 4];
      return `${color} ${start}% ${end}%`;
    })
    .join(', ');

  return (
    <div className="space-y-6 bg-[#eef1f5] p-2 rounded-[32px]">
      <div className="bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[28px] p-4 shadow-[0_12px_26px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-violet-600" />
              Inventory Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Stock movement, inventory value, and high-demand categories for the retail network.
            </p>
          </div>
          <div className="px-3 py-1.5 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-xs font-semibold rounded-lg">
            Units sold: {totalUnits}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">Inventory Value</div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">${inventoryValue.toFixed(0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">Fast Movers</div>
          <div className="mt-3 text-2xl font-black text-emerald-600 font-mono">{topProducts[0]?.[1] || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">Low Stock</div>
          <div className="mt-3 text-2xl font-black text-amber-600 font-mono">14</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">Out of Stock</div>
          <div className="mt-3 text-2xl font-black text-rose-600 font-mono">3</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[30px] p-5 shadow-[0_12px_20px_rgba(15,23,42,0.03)] xl:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <PackageSearch className="w-4 h-4 text-violet-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Stock by Product Category</h3>
          </div>
          <div className="space-y-4">
            {topProducts.map(([label, qty]) => (
              <div key={label}>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                  <span>{label}</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{qty}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    style={{ width: `${(qty / maxQty) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[30px] p-5 shadow-[0_12px_20px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-violet-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Units Trend</h3>
          </div>
          <svg viewBox="0 0 300 180" className="w-full h-36">
            {[0, 25, 50, 75, 100].map((tick) => (
              <line key={tick} x1="20" x2="280" y1={150 - (tick / 100) * 120} y2={150 - (tick / 100) * 120} stroke="#e2e8f0" strokeDasharray="4 4" />
            ))}
            <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {trendPoints.map((point) => (
              <g key={point.label}>
                <circle cx={point.x} cy={point.y} r="4" fill="#fff" stroke="#8b5cf6" strokeWidth="2" />
                <text x={point.x} y="170" textAnchor="middle" fill="#64748b" fontSize="10">{point.label}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Boxes className="w-4 h-4 text-violet-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Stock Mix</h3>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40 rounded-full" style={{ background: `conic-gradient(${donutGradient})` }}>
              <div className="absolute inset-5 rounded-full bg-white" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Units</span>
                <span className="text-xl font-black text-slate-800">{totalUnits}</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {topProducts.map(([label, qty], index) => (
              <div key={label} className="flex items-center justify-between text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ['#8b5cf6', '#3b82f6', '#34d399', '#f59e0b'][index % 4] }} />
                  {label}
                </div>
                <span className="font-bold">{((qty / totalUnits) * 100 || 0).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
          <MultiChartSection data={data} title="Inventory Analytics" />
    </div>
  );
};