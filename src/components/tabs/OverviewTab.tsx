import React from 'react';
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Percent,
  Star,
  Receipt,
  Store,
  CreditCard,
  Award,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { SaleRecord } from '../../types';
import { MultiChartSection } from '../MultiChartSection';
import { SalesMap } from '../SalesMap';

interface OverviewTabProps {
  data: SaleRecord[];
  onSelectProductLine: (product: string) => void;
  onSelectBranch: (branch: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  onSelectProductLine,
  onSelectBranch,
}) => {
  // Aggregate KPIs
  const totalSales = data.reduce((acc, r) => acc + r.total, 0);
  const totalCogs = data.reduce((acc, r) => acc + r.cogs, 0);
  const grossProfit = totalSales - totalCogs;
  const grossMarginPercent = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;
  const totalInvoices = data.length;
  const aov = totalInvoices > 0 ? totalSales / totalInvoices : 0;
  const avgRating = totalInvoices > 0 ? data.reduce((acc, r) => acc + r.rating, 0) / totalInvoices : 0;
  const totalUnits = data.reduce((acc, r) => acc + r.quantity, 0);

  // Group by Product Line
  const productLineMap: Record<string, { sales: number; units: number; count: number }> = {};
  data.forEach((r) => {
    if (!productLineMap[r.productLine]) {
      productLineMap[r.productLine] = { sales: 0, units: 0, count: 0 };
    }
    productLineMap[r.productLine].sales += r.total;
    productLineMap[r.productLine].units += r.quantity;
    productLineMap[r.productLine].count += 1;
  });

  const productLineStats = Object.entries(productLineMap).sort((a, b) => b[1].sales - a[1].sales);
  const maxProductSales = productLineStats[0]?.[1]?.sales || 1;

  // Group by Branch
  const branchMap: Record<string, { sales: number; cogs: number; count: number; rating: number; city: string }> = {
    A: { sales: 0, cogs: 0, count: 0, rating: 0, city: 'Yangon' },
    B: { sales: 0, cogs: 0, count: 0, rating: 0, city: 'Mandalay' },
    C: { sales: 0, cogs: 0, count: 0, rating: 0, city: 'Naypyitaw' },
  };

  data.forEach((r) => {
    if (branchMap[r.branch]) {
      branchMap[r.branch].sales += r.total;
      branchMap[r.branch].cogs += r.cogs;
      branchMap[r.branch].count += 1;
      branchMap[r.branch].rating += r.rating;
    }
  });

  // Group by Payment Method
  const paymentMap: Record<string, { sales: number; count: number }> = {
    Cash: { sales: 0, count: 0 },
    'Credit card': { sales: 0, count: 0 },
    Ewallet: { sales: 0, count: 0 },
  };
  data.forEach((r) => {
    if (paymentMap[r.payment]) {
      paymentMap[r.payment].sales += r.total;
      paymentMap[r.payment].count += 1;
    }
  });

  // Group by Month (Jan, Feb, Mar)
  const monthMap: Record<string, { sales: number; cogs: number; profit: number; count: number }> = {
    '2025-01': { sales: 0, cogs: 0, profit: 0, count: 0 },
    '2025-02': { sales: 0, cogs: 0, profit: 0, count: 0 },
    '2025-03': { sales: 0, cogs: 0, profit: 0, count: 0 },
  };

  data.forEach((r) => {
    const monthKey = r.date.slice(0, 7);
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { sales: 0, cogs: 0, profit: 0, count: 0 };
    }
    monthMap[monthKey].sales += r.total;
    monthMap[monthKey].cogs += r.cogs;
    monthMap[monthKey].profit += r.grossIncome;
    monthMap[monthKey].count += 1;
  });

  const recommendationItems = [
    {
      title: 'Highest revenue driver',
      text: 'Food and beverages remains the strongest category; prioritize stock depth and bundled promotional strategies.',
      tone: 'emerald',
    },
    {
      title: 'Customer retention opportunity',
      text: 'Member customers are the biggest repeat buyers; increase loyalty offers and personalized cross-sell bundles.',
      tone: 'blue',
    },
    {
      title: 'Payment channel opportunity',
      text: 'Digital payments are increasing; keep promotions aligned to E-wallet adoption to reduce checkout friction.',
      tone: 'violet',
    },
  ];

  const trendData = Object.entries(monthMap).map(([monthKey, stats]) => ({
    month: monthKey === '2025-01' ? 'Jan' : monthKey === '2025-02' ? 'Feb' : 'Mar',
    sales: stats.sales,
    profit: stats.profit,
  }));
  const maxTrendSales = Math.max(...trendData.map((point) => point.sales), 1);
  const linePoints = trendData.map((point, index) => {
    const x = 30 + (index * 110);
    const y = 150 - (point.sales / maxTrendSales) * 110;
    return { ...point, x, y };
  });
  const linePath = linePoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
  const areaPath = `${linePath} L ${linePoints[linePoints.length - 1].x} 150 L ${linePoints[0].x} 150 Z`;

  let paymentGradient = '';
  let cumulative = 0;
  const paymentEntries = Object.entries(paymentMap).map(([method, stats]) => {
    const share = totalSales > 0 ? (stats.sales / totalSales) * 100 : 0;
    const start = cumulative;
    cumulative += share;
    const color = method === 'Cash' ? '#10b981' : method === 'Credit card' ? '#2563eb' : '#4f46e5';
    return { method, sales: stats.sales, share, color, start, end: cumulative };
  });
  paymentGradient = paymentEntries
    .map((item) => `${item.color} ${item.start}% ${item.end}%`)
    .join(', ');

  return (
    <div className="space-y-6 bg-[#e8ebf0] p-3 rounded-[36px]">
      <div className="rounded-[30px] bg-gradient-to-r from-[#4c4d7c] via-[#7a6fa0] to-[#f3b17a] p-4 shadow-[0_18px_30px_rgba(107,99,149,0.22)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">KPI Dashboard</h2>
            <p className="text-xs font-medium text-slate-100/90">Executive overview snapshot</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/90 shadow-inner flex items-center justify-center text-2xl font-black text-slate-700">19</div>
        </div>
      </div>

      {/* Friendly Guide Callout */}
      <div className="bg-[#f7f9fb] border border-slate-200 rounded-[28px] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-[0_12px_26px_rgba(15,23,42,0.04)]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Supermarket Sales Executive Dashboard
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Interactive Power BI report replica. Click any product line or branch below to instantly filter the dataset.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <span className="bg-white border border-blue-200 text-blue-700 text-xs px-3 py-1.5 rounded-lg font-bold shadow-2xs">
            Dataset: 1,000 Invoices
          </span>
          <span className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-medium shadow-2xs">
            3 Retail Branches
          </span>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Total Sales */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Sales</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
            ${totalSales.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>Target Achieved</span>
          </div>
        </div>

        {/* Card 2: Total COGS */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total COGS</span>
            <div className="p-1.5 bg-slate-100 text-slate-600 rounded-md">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-slate-800 font-mono tracking-tight">
            ${totalCogs.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Wholesale Cost
          </div>
        </div>

        {/* Card 3: Gross Profit */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Gross Profit</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-emerald-600 font-mono tracking-tight">
            ${grossProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">
            5% Markup Income
          </div>
        </div>

        {/* Card 4: Gross Margin % */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Gross Margin</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-blue-700 font-mono tracking-tight">
            {grossMarginPercent.toFixed(2)}%
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Stable Margin Structure
          </div>
        </div>

        {/* Card 5: Invoices / Orders */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-purple-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Invoices</span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
            {totalInvoices.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {totalUnits.toLocaleString()} units sold
          </div>
        </div>

        {/* Card 6: Average Order Value & Rating */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-amber-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>AOV / CSAT</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
            ${aov.toFixed(1)}
          </div>
          <div className="mt-1 text-[11px] text-amber-600 font-bold flex items-center">
            ★ {avgRating.toFixed(2)} / 10 Avg CSAT
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1.7fr] gap-4">
        <div className="bg-white/95 border border-slate-200 rounded-[30px] p-4 shadow-[0_12px_26px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Overview</h3>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Q1</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
              <div className="text-[10px] uppercase text-slate-500">Sales</div>
              <div className="mt-2 text-lg font-black text-slate-900 font-mono">23K</div>
              <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-rose-400 to-orange-400" />
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
              <div className="text-[10px] uppercase text-slate-500">Revenue</div>
              <div className="mt-2 text-lg font-black text-slate-900 font-mono">12K</div>
              <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full w-[55%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
              <div className="text-[10px] uppercase text-slate-500">Profit</div>
              <div className="mt-2 text-lg font-black text-slate-900 font-mono">8K</div>
              <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500" />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] bg-gradient-to-br from-slate-50 via-white to-slate-100 p-3 border border-slate-200">
            <div className="flex items-end justify-between h-28 gap-2">
              {[42, 58, 35, 60, 72, 54, 68, 50, 62].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2">
                  <div className="w-full rounded-t-2xl bg-gradient-to-t from-blue-500 via-cyan-400 to-emerald-300" style={{ height: `${height}%` }} />
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-[9px] text-slate-500">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Data Analysis #1', value: '96%', color: 'from-rose-400 to-orange-300', ring: '#f59e0b' },
            { label: 'Data Analysis #2', value: '75%', color: 'from-cyan-400 to-blue-500', ring: '#38bdf8' },
            { label: 'Data Analysis #3', value: '60%', color: 'from-emerald-400 to-teal-500', ring: '#34d399' },
            { label: 'Data Analysis #4', value: '85%', color: 'from-violet-400 to-indigo-500', ring: '#a78bfa' },
          ].map((item) => (
            <div key={item.label} className="bg-white/95 border border-slate-200 rounded-[28px] p-3 shadow-[0_10px_22px_rgba(15,23,42,0.03)]">
              <div className="flex justify-end">
                <div className="w-9 h-9 rounded-full border-[5px] border-slate-100" style={{ background: `conic-gradient(${item.ring} 0 ${item.value}, #f1f5f9 ${item.value} 100%)` }} />
              </div>
              <div className="mt-3 text-2xl font-black text-slate-900 font-mono">{item.value}</div>
              <div className="text-[10px] text-slate-500 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {recommendationItems.map((item) => (
          <div key={item.title} className="bg-white/95 border border-slate-200 rounded-[24px] p-4 shadow-[0_10px_22px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between mb-3">
              <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                item.tone === 'emerald' ? 'bg-emerald-50 text-emerald-700' :
                item.tone === 'blue' ? 'bg-blue-50 text-blue-700' : 'bg-violet-50 text-violet-700'
              }`}>
                Recommendation
              </span>
              <Info className={`w-4 h-4 ${
                item.tone === 'emerald' ? 'text-emerald-600' :
                item.tone === 'blue' ? 'text-blue-600' : 'text-violet-600'
              }`} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">{item.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 bg-white/95 border border-slate-200 rounded-[30px] p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue Trend</h3>
              <p className="text-xs text-slate-500">Line chart showing monthly sales pattern</p>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-700 px-2 py-1 rounded">Q1 2025</span>
          </div>
          <svg viewBox="0 0 360 180" className="w-full h-44">
            <defs>
              <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[0, 25, 50, 75, 100].map((tick) => (
              <line key={tick} x1="30" x2="330" y1={150 - (tick / 100) * 110} y2={150 - (tick / 100) * 110} stroke="#e2e8f0" strokeDasharray="4 4" />
            ))}
            <path d={areaPath} fill="url(#areaFill)" />
            <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {linePoints.map((point) => (
              <g key={point.month}>
                <circle cx={point.x} cy={point.y} r="4" fill="#fff" stroke="#2563eb" strokeWidth="2" />
                <text x={point.x} y="170" textAnchor="middle" fill="#64748b" fontSize="11">{point.month}</text>
              </g>
            ))}
          </svg>
        </div>

        <div className="xl:col-span-4 bg-white/95 border border-slate-200 rounded-[30px] p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Payment Mix</h3>
              <p className="text-xs text-slate-500">Donut chart showing sales share</p>
            </div>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-40 h-40 rounded-full border-[16px] border-slate-100"
              style={{ background: `conic-gradient(${paymentGradient})` }}
            >
              <div className="w-full h-full rounded-full bg-white m-6 flex flex-col items-center justify-center">
                <span className="text-[11px] uppercase text-slate-500">Sales</span>
                <span className="text-lg font-black text-slate-900 font-mono">${totalSales.toFixed(0)}</span>
              </div>
            </div>
            <div className="w-full space-y-2">
              {paymentEntries.map((item) => (
                <div key={item.method} className="flex items-center justify-between text-[11px] text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.method}
                  </div>
                  <span className="font-semibold">{item.share.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-[0_12px_22px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Top Product Segment</h3>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+18.4%</span>
          </div>
          <div className="flex items-end justify-between h-24 gap-3">
            {productLineStats.slice(0, 4).map(([label, value], index) => {
              const barHeight = (value.sales / maxProductSales) * 100;
              const palette = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
              return (
                <div key={label} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full flex justify-center items-end h-20">
                    <div
                      className="w-full rounded-t-xl"
                      style={{ height: `${Math.max(barHeight, 18)}%`, background: palette[index % palette.length] }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">{label.slice(0, 3)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-[0_12px_22px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Customer Mix</h3>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Members</span>
          </div>
          <div className="flex items-center justify-center">
            <div
              className="relative w-28 h-28 rounded-full border-[12px] border-slate-100"
              style={{ background: `conic-gradient(#3b82f6 0 58%, #10b981 58% 100%)` }}
            >
              <div className="absolute inset-3 rounded-full bg-white flex items-center justify-center">
                <span className="text-sm font-black text-slate-800 font-mono">58%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs text-slate-700">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Members</span><span className="font-bold">58%</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Normal</span><span className="font-bold">42%</span></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-[0_12px_22px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Branch Snapshot</h3>
            <span className="text-[10px] font-semibold text-violet-600 bg-violet-50 px-2 py-1 rounded-full">3 stores</span>
          </div>
          <div className="space-y-3">
            {(['A', 'B', 'C'] as const).map((branch) => {
              const branchData = branchMap[branch];
              const share = totalSales > 0 ? (branchData.sales / totalSales) * 100 : 0;
              return (
                <div key={branch}>
                  <div className="flex justify-between text-[11px] text-slate-700 mb-1">
                    <span>Branch {branch}</span>
                    <span className="font-bold">{share.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500" style={{ width: `${share}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Monthly Revenue & Product Line Contribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Trend Bar Visual */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Monthly Revenue & Profit Growth (Q1 2025)
              </h3>
              <p className="text-xs text-slate-500">
                Power BI Visual: Clustered Column & Line Chart (DAX: [Total Sales] vs [Gross Profit])
              </p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-semibold border border-blue-100">
              Q1 Jan - Mar 2025
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {Object.entries(monthMap).map(([mKey, stats]) => {
              const monthName = mKey === '2025-01' ? 'January' : mKey === '2025-02' ? 'February' : 'March';
              const maxMonthSales = Math.max(...Object.values(monthMap).map((v) => v.sales), 1);
              const percentage = (stats.sales / maxMonthSales) * 100;

              return (
                <div key={mKey} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" />
                      {monthName} 2025
                    </span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-900 font-bold">
                        ${stats.sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-emerald-600 font-semibold text-[11px]">
                        Profit: ${stats.profit.toFixed(0)}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        ({stats.count} inv)
                      </span>
                    </div>
                  </div>
                  {/* Two-tone bar */}
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                    <div
                      className="bg-blue-600 h-full rounded-l transition-all duration-500"
                      style={{ width: `${percentage * 0.95}%` }}
                      title={`COGS: $${stats.cogs.toFixed(2)}`}
                    />
                    <div
                      className="bg-emerald-500 h-full rounded-r transition-all duration-500"
                      style={{ width: `${percentage * 0.05}%` }}
                      title={`Gross Margin: $${stats.profit.toFixed(2)}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-sm" /> Revenue (COGS)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> Gross Income (Tax 5%)
              </span>
            </div>
            <span className="font-medium text-slate-700">
              Avg Monthly: ${(totalSales / 3).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* Right: Product Category Bars */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Product Category Contribution
              </h3>
              <p className="text-xs text-slate-500">
                Click any bar to filter dashboard data
              </p>
            </div>
            <Award className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-3 pt-1">
            {productLineStats.map(([product, stats]) => {
              const widthPct = (stats.sales / maxProductSales) * 100;
              const shareOfTotal = totalSales > 0 ? (stats.sales / totalSales) * 100 : 0;

              return (
                <button
                  key={product}
                  onClick={() => onSelectProductLine(product)}
                  className="w-full text-left group hover:bg-blue-50/60 p-2 rounded-lg transition"
                >
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-medium text-slate-700 group-hover:text-blue-700 transition truncate max-w-[180px]">
                      {product}
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-900 font-bold">
                        ${stats.sales.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        ({shareOfTotal.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500 group-hover:bg-blue-700"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Branch Performance Table & Payment Share */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Branch Comparative Matrix */}
        <div className="lg:col-span-7 bg-white/95 border border-slate-200 rounded-[30px] p-5 shadow-[0_12px_20px_rgba(15,23,42,0.03)] overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Branch Performance Matrix (Power BI Table Visual)
              </h3>
              <p className="text-xs text-slate-500">
                Branch-by-branch revenue, customer satisfaction index, and order size
              </p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded font-medium">
              3 Branches
            </span>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] bg-slate-50">
                <th className="py-2.5 px-3">Branch Location</th>
                <th className="py-2.5 px-2 text-right">Invoices</th>
                <th className="py-2.5 px-2 text-right">Total Revenue</th>
                <th className="py-2.5 px-2 text-right">Avg Basket (AOV)</th>
                <th className="py-2.5 px-2 text-right">Avg Rating</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {(['A', 'B', 'C'] as const).map((bCode) => {
                const b = branchMap[bCode];
                const bAov = b.count > 0 ? b.sales / b.count : 0;
                const bAvgRating = b.count > 0 ? b.rating / b.count : 0;

                return (
                  <tr key={bCode} className="hover:bg-blue-50/50 transition">
                    <td className="py-3 px-3 font-sans">
                      <div className="font-bold text-slate-900">Branch {bCode}</div>
                      <div className="text-[11px] text-slate-500">{b.city}, Myanmar</div>
                    </td>
                    <td className="py-3 px-2 text-right text-slate-700">{b.count}</td>
                    <td className="py-3 px-2 text-right font-bold text-blue-700">
                      ${b.sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 text-right text-slate-800">${bAov.toFixed(2)}</td>
                    <td className="py-3 px-2 text-right">
                      <span className="text-amber-600 font-bold">
                        ★ {bAvgRating.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-sans">
                      <button
                        onClick={() => onSelectBranch(bCode)}
                        className="px-2.5 py-1 text-[11px] bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200 rounded-md transition font-medium"
                      >
                        Filter
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Payment Methods Share */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Payment Channel Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Power BI Visual: Donut Chart (DAX: [Payment Share %])
              </p>
            </div>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-4 pt-1">
            {Object.entries(paymentMap).map(([method, stats]) => {
              const share = totalSales > 0 ? (stats.sales / totalSales) * 100 : 0;
              const color =
                method === 'Cash'
                  ? 'bg-emerald-500'
                  : method === 'Credit card'
                  ? 'bg-blue-600'
                  : 'bg-indigo-600';

              return (
                <div key={method} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                      {method}
                    </span>
                    <div className="font-mono text-slate-800">
                      <span className="font-bold">${stats.sales.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                      <span className="text-slate-500 ml-2 font-sans font-medium">({share.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-500`}
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-3 bg-blue-50/70 rounded-lg border border-blue-100 text-[11px] text-slate-700 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-900">Retail Analyst Key Takeaway: </strong>
              E-Wallet and digital cards account for ~66% of all revenue, proving that digital POS infrastructure is strongly embraced by supermarket shoppers.
            </div>
          </div>
        </div>
      </div>
      <SalesMap data={data} onSelectCity={(city) => {
        const branchMap: Record<string, string> = { Yangon: 'A', Mandalay: 'B', Naypyitaw: 'C' };
        if (branchMap[city]) onSelectBranch(branchMap[city]);
      }} />
      <MultiChartSection data={data} title="Executive Analytics & Trends" onFilter={(key, value) => {
        if (key === 'bar') onSelectBranch(value);
        if (key === 'pie') onSelectProductLine(value);
      }} />
    </div>
  );
};
