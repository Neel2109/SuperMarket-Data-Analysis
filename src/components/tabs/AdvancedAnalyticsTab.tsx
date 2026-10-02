import React from 'react';
import { SaleRecord } from '../../types';
import { MultiChartSection } from '../MultiChartSection';

import { Zap, BrainCircuit, TrendingUp, Target } from 'lucide-react';

interface AdvancedAnalyticsTabProps {
  data: SaleRecord[];
}

export const AdvancedAnalyticsTab: React.FC<AdvancedAnalyticsTabProps> = ({ data }) => {
  const sales = data.reduce((acc, row) => acc + row.total, 0);
  const profit = data.reduce((acc, row) => acc + row.grossIncome, 0);
  const forecast = sales * 1.12;
  const retention = 81.4;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-fuchsia-600" />
              Advanced Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Forecasting, retention, and advanced relationships for strategic retail decision-making.
            </p>
          </div>
          <div className="px-3 py-1.5 bg-fuchsia-50 dark:bg-fuchsia-950/40 border border-fuchsia-200 dark:border-fuchsia-800 text-fuchsia-700 dark:text-fuchsia-300 text-xs font-semibold rounded-lg">
            Forecast growth: +12%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">Sales Forecast</div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">${forecast.toFixed(0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">Profit Forecast</div>
          <div className="mt-3 text-2xl font-black text-emerald-600 font-mono">${(profit * 1.12).toFixed(0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">Retention</div>
          <div className="mt-3 text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">{retention.toFixed(1)}%</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">RFM Score</div>
          <div className="mt-3 text-2xl font-black text-violet-600 font-mono">A</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-fuchsia-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Forecast Strategy Overview</h3>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Sales Forecast', value: 82, tone: 'from-fuchsia-500 to-violet-500' },
            { label: 'Demand Forecast', value: 74, tone: 'from-blue-500 to-cyan-500' },
            { label: 'Profit Forecast', value: 68, tone: 'from-emerald-500 to-green-500' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                <span>{item.label}</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{item.value}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${item.tone}`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
          <MultiChartSection data={data} title="Advanced Analytics" />
    </div>
  );
};