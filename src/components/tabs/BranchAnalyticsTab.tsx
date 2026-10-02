import React from 'react';
import { SaleRecord } from '../../types';
import { MultiChartSection } from '../MultiChartSection';
import { SalesMap } from '../SalesMap';

import { MapPin, Clock, AlertCircle } from 'lucide-react';

interface BranchAnalyticsTabProps {
  data: SaleRecord[];
}

export const BranchAnalyticsTab: React.FC<BranchAnalyticsTabProps> = ({ data }) => {
  const branches: Array<{ code: 'A' | 'B' | 'C'; city: string }> = [
    { code: 'A', city: 'Yangon' },
    { code: 'B', city: 'Mandalay' },
    { code: 'C', city: 'Naypyitaw' },
  ];

  const hours = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  const heatmap: Record<string, Record<number, number>> = {
    A: {},
    B: {},
    C: {},
  };

  hours.forEach((h) => {
    heatmap.A[h] = 0;
    heatmap.B[h] = 0;
    heatmap.C[h] = 0;
  });

  data.forEach((r) => {
    const hour = parseInt(r.time.split(':')[0], 10);
    if (heatmap[r.branch] && heatmap[r.branch][hour] !== undefined) {
      heatmap[r.branch][hour]++;
    }
  });

  let maxHourlyCount = 1;
  Object.values(heatmap).forEach((hourObj) => {
    Object.values(hourObj).forEach((cnt) => {
      if (cnt > maxHourlyCount) maxHourlyCount = cnt;
    });
  });

  const getHeatmapColor = (count: number) => {
    const ratio = count / maxHourlyCount;
    if (ratio >= 0.8) return 'bg-blue-600 text-white font-bold';
    if (ratio >= 0.55) return 'bg-blue-400 text-white font-semibold';
    if (ratio >= 0.3) return 'bg-blue-100 text-blue-900 font-medium';
    if (ratio > 0) return 'bg-slate-100 text-slate-700';
    return 'bg-white text-slate-400 border border-slate-200';
  };

  return (
    <div className="space-y-6 bg-[#e8ebf0] p-3 rounded-[36px]">
      <div className="rounded-[30px] bg-gradient-to-r from-[#4c4d7c] via-[#7a6fa0] to-[#f3b17a] p-4 shadow-[0_18px_30px_rgba(107,99,149,0.22)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">Branch Dashboard</h2>
            <p className="text-xs font-medium text-slate-100/90">Operational footfall and branch health</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/90 shadow-inner flex items-center justify-center text-2xl font-black text-slate-700">3</div>
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-white/95 border border-slate-200 rounded-[28px] p-4 flex items-center justify-between shadow-[0_12px_26px_rgba(15,23,42,0.04)]">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Branch Operations & Hourly Footfall Dynamics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Optimize cashier schedules and understand customer traffic across operating store hours (10:00 to 20:00).
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 font-semibold">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>POS Footfall Heatmap</span>
        </div>
      </div>

      {/* Hourly Footfall Heatmap Table */}
      <div className="bg-white/95 border border-slate-200 rounded-[30px] p-5 shadow-[0_12px_20px_rgba(15,23,42,0.03)] overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Peak Shopping Hour Heatmap (10:00 - 20:59)
            </h3>
            <p className="text-xs text-slate-500">
              Power BI Matrix visual with conditional blue gradient formatting (DAX: [Transactions Count])
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300" /> Normal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-200" /> Busy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-600" /> Peak
            </span>
          </div>
        </div>

        <table className="w-full text-center text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-semibold bg-slate-50">
              <th className="text-left py-2.5 px-3">Branch Location</th>
              {hours.map((h) => (
                <th key={h} className="py-2 px-1">
                  {h}:00
                </th>
              ))}
              <th className="py-2.5 px-3 text-right">Total Invoices</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {branches.map((b) => {
              const bTotal = hours.reduce((acc, h) => acc + (heatmap[b.code][h] || 0), 0);
              return (
                <tr key={b.code} className="hover:bg-slate-50">
                  <td className="text-left py-3 px-3 font-sans">
                    <div className="font-bold text-slate-900">Branch {b.code}</div>
                    <div className="text-[11px] text-slate-500">{b.city}</div>
                  </td>
                  {hours.map((h) => {
                    const count = heatmap[b.code][h] || 0;
                    return (
                      <td key={h} className="py-2 px-1">
                        <span
                          className={`inline-block w-8 sm:w-10 py-1.5 rounded-md text-[11px] transition-transform hover:scale-105 shadow-2xs ${getHeatmapColor(
                            count
                          )}`}
                          title={`Branch ${b.code} at ${h}:00 - ${count} checkouts`}
                        >
                          {count}
                        </span>
                      </td>
                    );
                  })}
                  <td className="py-3 px-3 text-right font-bold text-blue-700">
                    {bTotal}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Operational Staffing Insight Banner */}
        <div className="mt-5 p-3.5 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-3 text-xs text-slate-700">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <strong className="text-blue-900">Operational Staffing Recommendation: </strong>
            Footfall spikes regularly at <strong>13:00 - 14:00 (lunch peak)</strong> and <strong>19:00 - 20:00 (evening peak)</strong> across all branches. 
            Assigning additional cashiers during these 2-hour peaks reduces register queues and checkout abandonment.
          </div>
        </div>
      </div>

      {/* Row 2: Branch Deep Dives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map((b) => {
          const bData = data.filter((d) => d.branch === b.code);
          const bSales = bData.reduce((acc, r) => acc + r.total, 0);
          const bUnits = bData.reduce((acc, r) => acc + r.quantity, 0);
          const bRating = bData.length > 0 ? bData.reduce((acc, r) => acc + r.rating, 0) / bData.length : 0;
          const memberCount = bData.filter((d) => d.customerType === 'Member').length;
          const memberShare = bData.length > 0 ? (memberCount / bData.length) * 100 : 0;

          return (
            <div key={b.code} className="bg-white/95 border border-slate-200 rounded-[28px] p-5 shadow-[0_10px_22px_rgba(15,23,42,0.03)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Branch {b.code}</h3>
                  <span className="text-xs text-slate-500">{b.city}, Myanmar</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center">
                  {b.code}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Revenue:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${bSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transactions:</span>
                  <span className="font-mono text-slate-800">{bData.length} invoices</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Units Sold:</span>
                  <span className="font-mono text-slate-800">{bUnits} items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Loyalty Member %:</span>
                  <span className="font-mono text-blue-700 font-semibold">{memberShare.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CSAT Score:</span>
                  <span className="font-mono text-amber-600 font-bold">★ {bRating.toFixed(2)} / 10</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Top Payment: </span>
                  {b.code === 'A' ? 'Cash & E-Wallet' : b.code === 'B' ? 'Cash' : 'Credit Card'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <SalesMap data={data} />
      <MultiChartSection data={data} title="Branch Analytics" />
    </div>
  );
};