import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { SaleRecord } from '../types';
import { ArrowUpRight, ArrowDownRight, Minus, GitCompare } from 'lucide-react';

interface ComparisonModeProps {
  data: SaleRecord[];
}

type CompareBy = 'month' | 'branch';

export const ComparisonMode: React.FC<ComparisonModeProps> = ({ data }) => {
  const [compareBy, setCompareBy] = useState<CompareBy>('month');

  const monthOptions = useMemo(() => {
    const months = new Set<string>();
    data.forEach(r => { if (r.date) months.add(r.date.slice(0, 7)); });
    return Array.from(months).sort();
  }, [data]);

  const [leftMonth, setLeftMonth] = useState(monthOptions[0] || '');
  const [rightMonth, setRightMonth] = useState(monthOptions[monthOptions.length - 1] || '');
  const [leftBranch, setLeftBranch] = useState('A');
  const [rightBranch, setRightBranch] = useState('B');

  const fmtMonth = (m: string) => {
    const labels: Record<string, string> = { '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec' };
    const parts = m.split('-');
    return parts.length === 2 ? `${labels[parts[1]] || parts[1]} '${parts[0].slice(2)}` : m;
  };

  const stats = useMemo(() => {
    let leftData: SaleRecord[];
    let rightData: SaleRecord[];
    let leftLabel: string;
    let rightLabel: string;

    if (compareBy === 'month') {
      leftData = data.filter(r => r.date?.startsWith(leftMonth));
      rightData = data.filter(r => r.date?.startsWith(rightMonth));
      leftLabel = fmtMonth(leftMonth);
      rightLabel = fmtMonth(rightMonth);
    } else {
      leftData = data.filter(r => r.branch === leftBranch);
      rightData = data.filter(r => r.branch === rightBranch);
      leftLabel = `Branch ${leftBranch}`;
      rightLabel = `Branch ${rightBranch}`;
    }

    const calc = (subset: SaleRecord[]) => ({
      revenue: subset.reduce((s, r) => s + r.total, 0),
      transactions: subset.length,
      avgOrder: subset.length > 0 ? subset.reduce((s, r) => s + r.total, 0) / subset.length : 0,
      avgRating: subset.length > 0 ? subset.reduce((s, r) => s + r.rating, 0) / subset.length : 0,
      grossIncome: subset.reduce((s, r) => s + r.grossIncome, 0),
    });

    return {
      left: calc(leftData),
      right: calc(rightData),
      leftLabel,
      rightLabel,
    };
  }, [data, compareBy, leftMonth, rightMonth, leftBranch, rightBranch]);

  const delta = (a: number, b: number) => {
    if (b === 0) return 0;
    return ((a - b) / b) * 100;
  };

  const DeltaBadge = ({ left, right }: { left: number; right: number }) => {
    const d = delta(right, left);
    const isUp = d > 0;
    const isFlat = Math.abs(d) < 0.5;
    return (
      <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${isFlat ? 'bg-slate-100 text-slate-500' : isUp ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
        {isFlat ? <Minus className="w-3 h-3" /> : isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {Math.abs(d).toFixed(1)}%
      </span>
    );
  };

  const metrics = [
    { label: 'Revenue', leftVal: stats.left.revenue, rightVal: stats.right.revenue, fmt: (v: number) => `$${(v / 1000).toFixed(1)}k` },
    { label: 'Transactions', leftVal: stats.left.transactions, rightVal: stats.right.transactions, fmt: (v: number) => v.toString() },
    { label: 'Avg Order', leftVal: stats.left.avgOrder, rightVal: stats.right.avgOrder, fmt: (v: number) => `$${v.toFixed(2)}` },
    { label: 'Avg Rating', leftVal: stats.left.avgRating, rightVal: stats.right.avgRating, fmt: (v: number) => `${v.toFixed(1)}★` },
    { label: 'Gross Income', leftVal: stats.left.grossIncome, rightVal: stats.right.grossIncome, fmt: (v: number) => `$${(v / 1000).toFixed(1)}k` },
  ];

  const chartData = metrics.map(m => ({
    name: m.label,
    [stats.leftLabel]: Math.round(m.leftVal * 100) / 100,
    [stats.rightLabel]: Math.round(m.rightVal * 100) / 100,
  }));

  return (
    <div className="themed-card rounded-2xl p-6 border shadow-sm mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h3 className="text-base font-bold themed-text flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-blue-500" />
          Comparison Mode
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCompareBy('month')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${compareBy === 'month' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            By Month
          </button>
          <button
            onClick={() => setCompareBy('branch')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${compareBy === 'branch' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            By Branch
          </button>
        </div>
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap gap-3 mb-5">
        {compareBy === 'month' ? (
          <>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
              <span className="text-[11px] font-semibold text-blue-700">Left:</span>
              <select value={leftMonth} onChange={e => setLeftMonth(e.target.value)} className="text-xs bg-transparent font-semibold text-blue-900 cursor-pointer">
                {monthOptions.map(m => <option key={m} value={m}>{fmtMonth(m)}</option>)}
              </select>
            </div>
            <span className="text-xs font-bold themed-text-muted self-center">vs</span>
            <div className="flex items-center gap-2 bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-200">
              <span className="text-[11px] font-semibold text-violet-700">Right:</span>
              <select value={rightMonth} onChange={e => setRightMonth(e.target.value)} className="text-xs bg-transparent font-semibold text-violet-900 cursor-pointer">
                {monthOptions.map(m => <option key={m} value={m}>{fmtMonth(m)}</option>)}
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
              <span className="text-[11px] font-semibold text-blue-700">Left:</span>
              <select value={leftBranch} onChange={e => setLeftBranch(e.target.value)} className="text-xs bg-transparent font-semibold text-blue-900 cursor-pointer">
                <option value="A">Branch A (Yangon)</option>
                <option value="B">Branch B (Mandalay)</option>
                <option value="C">Branch C (Naypyitaw)</option>
              </select>
            </div>
            <span className="text-xs font-bold themed-text-muted self-center">vs</span>
            <div className="flex items-center gap-2 bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-200">
              <span className="text-[11px] font-semibold text-violet-700">Right:</span>
              <select value={rightBranch} onChange={e => setRightBranch(e.target.value)} className="text-xs bg-transparent font-semibold text-violet-900 cursor-pointer">
                <option value="A">Branch A (Yangon)</option>
                <option value="B">Branch B (Mandalay)</option>
                <option value="C">Branch C (Naypyitaw)</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {metrics.map(m => (
          <div key={m.label} className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
            <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1">{m.label}</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-bold text-blue-700">{m.fmt(m.leftVal)}</span>
              <DeltaBadge left={m.leftVal} right={m.rightVal} />
              <span className="text-xs font-bold text-violet-700">{m.fmt(m.rightVal)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Side-by-side bar chart */}
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <RechartsTooltip
              contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '10px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey={stats.leftLabel} fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey={stats.rightLabel} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
