import React from 'react';
import { SaleRecord } from '../../types';
import { MultiChartSection } from '../MultiChartSection';

import { Users, HeartHandshake, ShieldCheck, Tag, Sparkles } from 'lucide-react';

interface CustomerProductTabProps {
  data: SaleRecord[];
}

export const CustomerProductTab: React.FC<CustomerProductTabProps> = ({ data }) => {
  const memberData = data.filter((d) => d.customerType === 'Member');
  const normalData = data.filter((d) => d.customerType === 'Normal');

  const calcGroupStats = (subset: SaleRecord[]) => {
    const totalSales = subset.reduce((acc, r) => acc + r.total, 0);
    const count = subset.length;
    const aov = count > 0 ? totalSales / count : 0;
    const avgRating = count > 0 ? subset.reduce((acc, r) => acc + r.rating, 0) / count : 0;
    const avgUnits = count > 0 ? subset.reduce((acc, r) => acc + r.quantity, 0) / count : 0;
    return { totalSales, count, aov, avgRating, avgUnits };
  };

  const memberStats = calcGroupStats(memberData);
  const normalStats = calcGroupStats(normalData);

  const femaleData = data.filter((d) => d.gender === 'Female');
  const maleData = data.filter((d) => d.gender === 'Male');
  const femaleSales = femaleData.reduce((acc, r) => acc + r.total, 0);
  const maleSales = maleData.reduce((acc, r) => acc + r.total, 0);
  const totalGenderSales = femaleSales + maleSales || 1;

  const ratingBuckets: Record<string, number> = {
    '4.0 - 5.0': 0,
    '5.1 - 6.0': 0,
    '6.1 - 7.0': 0,
    '7.1 - 8.0': 0,
    '8.1 - 9.0': 0,
    '9.1 - 10.0': 0,
  };

  data.forEach((r) => {
    if (r.rating <= 5.0) ratingBuckets['4.0 - 5.0']++;
    else if (r.rating <= 6.0) ratingBuckets['5.1 - 6.0']++;
    else if (r.rating <= 7.0) ratingBuckets['6.1 - 7.0']++;
    else if (r.rating <= 8.0) ratingBuckets['7.1 - 8.0']++;
    else if (r.rating <= 9.0) ratingBuckets['8.1 - 9.0']++;
    else ratingBuckets['9.1 - 10.0']++;
  });

  const maxBucketCount = Math.max(...Object.values(ratingBuckets), 1);
  const categories = Array.from(new Set(data.map((d) => d.productLine))).sort();

  const productSales = categories.map((product) => ({
    label: product,
    value: data.filter((row) => row.productLine === product).reduce((acc, row) => acc + row.total, 0),
  }));
  const maxProductSales = Math.max(...productSales.map((item) => item.value), 1);

  const lineX = productSales.map((item, index) => ({
    ...item,
    x: 20 + index * 60,
    y: 150 - (item.value / maxProductSales) * 110,
  }));
  const productLinePath = lineX.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  const donutGradient = [
    { label: 'Members', value: memberStats.totalSales, color: '#3b82f6' },
    { label: 'Normal', value: normalStats.totalSales, color: '#10b981' },
  ].map((item, index, arr) => {
    const total = arr.reduce((acc, cur) => acc + cur.value, 0) || 1;
    const start = arr.slice(0, index).reduce((acc, cur) => acc + (cur.value / total) * 100, 0);
    const end = start + (item.value / total) * 100;
    return `${item.color} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div className="space-y-6 bg-[#e8ebf0] p-3 rounded-[36px]">
      <div className="rounded-[30px] bg-gradient-to-r from-[#4c4d7c] via-[#7a6fa0] to-[#f3b17a] p-4 shadow-[0_18px_30px_rgba(107,99,149,0.22)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">Customer Dashboard</h2>
            <p className="text-xs font-medium text-slate-100/90">Segment mix and performance</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/90 shadow-inner flex items-center justify-center text-2xl font-black text-slate-700">2</div>
        </div>
      </div>

      <div className="bg-white/95 border border-slate-200 rounded-[28px] p-4 flex items-center justify-between shadow-[0_12px_26px_rgba(15,23,42,0.04)]">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Customer Loyalty & Product Performance Analysis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare loyalty member metrics versus standard walk-in shoppers and view customer sentiment ratings.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 font-semibold">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Loyalty Analytics</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/95 border-2 border-blue-200 rounded-[28px] p-5 shadow-[0_10px_22px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Loyalty Program Members</h3>
                <span className="text-xs text-blue-600 font-semibold">Registered Member Shoppers</span>
              </div>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 font-mono px-2.5 py-0.5 rounded-full font-bold">
              {((memberStats.count / (data.length || 1)) * 100).toFixed(1)}% of Invoices
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100 font-mono">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-sans">Total Sales</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                ${memberStats.totalSales.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-sans">Avg Basket (AOV)</div>
              <div className="text-base font-bold text-blue-700 mt-0.5">
                ${memberStats.aov.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-sans">Units / Order</div>
              <div className="text-base font-bold text-slate-800 mt-0.5">
                {memberStats.avgUnits.toFixed(1)} items
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-sans">CSAT Rating</div>
              <div className="text-base font-bold text-amber-600 mt-0.5">
                ★ {memberStats.avgRating.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Normal Walk-In Shoppers</h3>
                <span className="text-xs text-slate-500">Non-registered Customers</span>
              </div>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2.5 py-0.5 rounded-full font-bold">
              {((normalStats.count / (data.length || 1)) * 100).toFixed(1)}% of Invoices
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100 font-mono">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-sans">Total Sales</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                ${normalStats.totalSales.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-sans">Avg Basket (AOV)</div>
              <div className="text-base font-bold text-slate-800 mt-0.5">
                ${normalStats.aov.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-sans">Units / Order</div>
              <div className="text-base font-bold text-slate-800 mt-0.5">
                {normalStats.avgUnits.toFixed(1)} items
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-sans">CSAT Rating</div>
              <div className="text-base font-bold text-amber-600 mt-0.5">
                ★ {normalStats.avgRating.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white/95 border border-slate-200 rounded-[30px] p-5 shadow-[0_12px_20px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Gender Revenue Distribution</h3>
              <p className="text-xs text-slate-500">Power BI 100% Stacked Bar visual</p>
            </div>
            <Tag className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-slate-700 font-semibold font-sans">Female Shoppers</span>
                <span className="font-bold text-slate-900">
                  ${femaleSales.toLocaleString('en-US', { maximumFractionDigits: 0 })} ({((femaleSales / totalGenderSales) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(femaleSales / totalGenderSales) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-slate-700 font-semibold font-sans">Male Shoppers</span>
                <span className="font-bold text-slate-900">
                  ${maleSales.toLocaleString('en-US', { maximumFractionDigits: 0 })} ({((maleSales / totalGenderSales) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-slate-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(maleSales / totalGenderSales) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-6 p-3 bg-blue-50 rounded-lg text-xs text-slate-700 leading-relaxed border border-blue-100">
              <span className="font-bold text-blue-800">College Viva Insight: </span>
              Revenue is balanced evenly between Female (~50.5%) and Male (~49.5%) customers, indicating strong family household coverage across all retail departments.
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white/95 border border-slate-200 rounded-[30px] p-5 shadow-[0_12px_20px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Customer Satisfaction Rating Histogram (1 - 10)</h3>
              <p className="text-xs text-slate-500">Power BI Rating distribution</p>
            </div>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-3 pt-1">
            {Object.entries(ratingBuckets).map(([bucket, count]) => {
              const pct = (count / maxBucketCount) * 100;
              const share = ((count / (data.length || 1)) * 100).toFixed(1);

              return (
                <div key={bucket} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">Rating {bucket}</span>
                    <div className="font-mono text-slate-600 text-xs">
                      <span className="font-bold text-slate-900">{count} reviews</span>
                      <span className="text-slate-400 ml-2">({share}%)</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white/95 border border-slate-200 rounded-[30px] p-5 shadow-[0_12px_22px_rgba(15,23,42,0.03)] xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Product Sales Trend</h3>
              <p className="text-xs text-slate-500">Category sales performance</p>
            </div>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <svg viewBox="0 0 360 180" className="w-full h-40">
            {[0, 25, 50, 75, 100].map((tick) => (
              <line key={tick} x1="20" x2="340" y1={150 - (tick / 100) * 120} y2={150 - (tick / 100) * 120} stroke="#e2e8f0" strokeDasharray="4 4" />
            ))}
            <path d={productLinePath} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {lineX.map((point) => (
              <g key={point.label}>
                <circle cx={point.x} cy={point.y} r="4" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
                <text x={point.x} y="170" textAnchor="middle" fill="#64748b" fontSize="10">{point.label.slice(0, 4)}</text>
              </g>
            ))}
          </svg>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Member Mix</h3>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40 rounded-full" style={{ background: `conic-gradient(${donutGradient})` }}>
              <div className="absolute inset-5 rounded-full bg-white" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Sales</span>
                <span className="text-xl font-black text-slate-800">${(memberStats.totalSales / 1000).toFixed(1)}K</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" />Members</div>
              <span className="font-bold">{((memberStats.totalSales / data.reduce((acc, row) => acc + row.total, 0)) * 100 || 0).toFixed(0)}%</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Normal</div>
              <span className="font-bold">{((normalStats.totalSales / data.reduce((acc, row) => acc + row.total, 0)) * 100 || 0).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
          <MultiChartSection data={data} title="Customer Product Analytics" />
    </div>
  );
};