import React from 'react';
import { SaleRecord } from '../../types';
import { MultiChartSection } from '../MultiChartSection';

import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  BarChart3,
  CalendarRange,
  CreditCard,
} from 'lucide-react';

interface SalesAnalyticsTabProps {
  data: SaleRecord[];
}

export const SalesAnalyticsTab: React.FC<SalesAnalyticsTabProps> = ({ data }) => {
  const totalSales = data.reduce((acc, r) => acc + r.total, 0);
  const totalInvoices = data.length;
  const averageOrderValue = totalInvoices > 0 ? totalSales / totalInvoices : 0;

  const monthMap: Record<string, { sales: number; invoices: number }> = {
    '2025-01': { sales: 0, invoices: 0 },
    '2025-02': { sales: 0, invoices: 0 },
    '2025-03': { sales: 0, invoices: 0 },
  };

  data.forEach((row) => {
    const monthKey = row.date.slice(0, 7);
    if (!monthMap[monthKey]) monthMap[monthKey] = { sales: 0, invoices: 0 };
    monthMap[monthKey].sales += row.total;
    monthMap[monthKey].invoices += 1;
  });

  const categoryMap: Record<string, number> = {};
  data.forEach((row) => {
    categoryMap[row.productLine] = (categoryMap[row.productLine] || 0) + row.total;
  });

  const paymentMap: Record<string, number> = {};
  data.forEach((row) => {
    paymentMap[row.payment] = (paymentMap[row.payment] || 0) + row.total;
  });

  const maxSales = Math.max(...Object.values(monthMap).map((m) => m.sales), 1);
  const maxCategory = Math.max(...Object.values(categoryMap), 1);

  const chartMonths = Object.entries(monthMap).map(([key, val]) => ({
    label: key === '2025-01' ? 'Jan' : key === '2025-02' ? 'Feb' : 'Mar',
    value: val.sales,
  }));

  const chartCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));

  const chartPayments = Object.entries(paymentMap).map(([label, value]) => ({
    label: label === 'Credit card' ? 'Credit Card' : label === 'Ewallet' ? 'E-Wallet' : label,
    value,
  }));

  const trendPoints = chartMonths.map((pt, idx) => ({
    x: 30 + idx * 120,
    y: 170 - (pt.value / maxSales) * 120,
    label: pt.label,
    value: pt.value,
  }));
  const linePath = trendPoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const donutGradient = chartPayments
    .map((entry, index) => {
      const start = chartPayments.slice(0, index).reduce((acc, item) => acc + (item.value / totalSales) * 100, 0);
      const end = start + (entry.value / totalSales) * 100;
      return `${index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#8b5cf6'} ${start}% ${end}%`;
    })
    .join(', ');

  return (
    <div className="space-y-6 bg-[#e8ebf0] p-3 rounded-[36px]">
      <div className="rounded-[30px] bg-gradient-to-r from-[#4c4d7c] via-[#7a6fa0] to-[#f3b17a] p-4 shadow-[0_18px_30px_rgba(107,99,149,0.22)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">Sales Dashboard</h2>
            <p className="text-xs font-medium text-slate-100/90">Revenue and payment performance</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/90 shadow-inner flex items-center justify-center text-2xl font-black text-slate-700">4</div>
        </div>
      </div>

      <div className="bg-white/95 border border-slate-200 rounded-[28px] p-4 shadow-[0_12px_26px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Sales Analytics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Revenue growth, category contribution, and payment performance across the quarter.
            </p>
          </div>
          <div className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg font-semibold">
            Q1 2025
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] uppercase">
            <span>Total Sales</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 font-mono">${totalSales.toFixed(0)}</div>
          <div className="text-[11px] text-emerald-600 mt-1">+4.8% vs target</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] uppercase">
            <span>Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 font-mono">{totalInvoices}</div>
          <div className="text-[11px] text-slate-500 mt-1">1,000 transactions</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] uppercase">
            <span>Avg Order</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 font-mono">${averageOrderValue.toFixed(2)}</div>
          <div className="text-[11px] text-slate-500 mt-1">per invoice</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] uppercase">
            <span>Peak Month</span>
            <CalendarRange className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 font-mono">Mar</div>
          <div className="text-[11px] text-sky-600 mt-1">highest sales volume</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1.7fr] gap-6">
        <div className="bg-white/95 border border-slate-200 rounded-[30px] p-5 shadow-[0_12px_20px_rgba(15,23,42,0.03)]">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Monthly Sales Performance</h3>
          <div className="space-y-4">
            {chartMonths.map((entry) => (
              <div key={entry.label}>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>{entry.label}</span>
                  <span className="font-mono font-semibold text-slate-900">${entry.value.toFixed(0)}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
                    style={{ width: `${(entry.value / maxSales) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-[28px] p-4 shadow-[0_10px_22px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between text-[10px] uppercase text-slate-500">
              <span>Sales Mix</span>
              <span className="font-bold text-emerald-600">+4.8%</span>
            </div>
            <div className="mt-3 flex items-center justify-center">
              <div className="relative w-24 h-24 rounded-full" style={{ background: `conic-gradient(#3b82f6 0 58%, #34d399 58% 80%, #f59e0b 80% 100%)` }}>
                <div className="absolute inset-3 rounded-full bg-white" />
                <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-slate-900 font-mono">58%</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[28px] p-4 shadow-[0_10px_22px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between text-[10px] uppercase text-slate-500">
              <span>Trend</span>
              <span className="font-bold text-blue-600">Q1</span>
            </div>
            <svg viewBox="0 0 200 120" className="w-full h-24 mt-3">
              <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {trendPoints.map((point) => (
                <g key={point.label}>
                  <circle cx={point.x} cy={point.y} r="3" fill="#fff" stroke="#2563eb" strokeWidth="2" />
                </g>
              ))}
            </svg>
          </div>

          <div className="col-span-2 bg-white border border-slate-200 rounded-[28px] p-4 shadow-[0_10px_22px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase text-slate-500">Product Split</span>
              <span className="text-[10px] font-bold text-slate-700">Top categories</span>
            </div>
            <div className="space-y-3">
              {chartCategories.slice(0, 3).map((entry, index) => (
                <div key={entry.label}>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-1">
                    <span>{entry.label}</span>
                    <span className="font-mono font-semibold text-slate-900">${entry.value.toFixed(0)}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-500"
                      style={{ width: `${(entry.value / maxCategory) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Category Share</h3>
          <div className="space-y-4">
            {chartCategories.map((entry) => (
              <div key={entry.label}>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>{entry.label}</span>
                  <span className="font-mono font-semibold text-slate-900">${entry.value.toFixed(0)}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                    style={{ width: `${(entry.value / maxCategory) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Payment Mix</h3>
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
            {chartPayments.map((entry) => (
              <div key={entry.label} className="flex items-center justify-between text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.label === 'Credit Card' ? '#3b82f6' : entry.label === 'E-Wallet' ? '#10b981' : '#8b5cf6' }} />
                  {entry.label}
                </div>
                <span className="font-bold">{((entry.value / totalSales) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Payment Channel Contribution</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {chartPayments.map((entry) => (
            <div key={entry.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500 uppercase">{entry.label}</div>
              <div className="mt-2 text-xl font-black text-slate-900 font-mono">${entry.value.toFixed(0)}</div>
              <div className="mt-2 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  style={{ width: `${(entry.value / totalSales) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
          <MultiChartSection data={data} title="Sales Analytics" />
    </div>
  );
};