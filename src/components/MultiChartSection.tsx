import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, Area, AreaChart,
  PieChart, Pie, Cell
} from 'recharts';
import { useTheme } from './ThemeContext';

interface MultiChartSectionProps {
  data: any[];
  title?: string;
  onFilter?: (key: string, value: string) => void;
}

/* ── Month label formatter ───────────────────────────────── */
const MONTH_LABELS: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
};

function fmtMonth(key: string): string {
  // "2025-01" → "Jan '25"
  const parts = key.split('-');
  if (parts.length === 2) {
    const label = MONTH_LABELS[parts[1]] || parts[1];
    return `${label} '${parts[0].slice(2)}`;
  }
  return key;
}

/* ── Data aggregation helpers ────────────────────────────── */
function groupSum(arr: any[], keyFn: (r: any) => string, valFn: (r: any) => number) {
  const map: Record<string, number> = {};
  arr.forEach(r => {
    const k = keyFn(r) || 'Other';
    map[k] = (map[k] || 0) + valFn(r);
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function groupAvg(arr: any[], keyFn: (r: any) => string, valFn: (r: any) => number) {
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};
  arr.forEach(r => {
    const k = keyFn(r) || 'Other';
    sums[k] = (sums[k] || 0) + valFn(r);
    counts[k] = (counts[k] || 0) + 1;
  });
  return Object.entries(sums)
    .map(([name, s]) => ({ name, value: Math.round((s / (counts[name] || 1)) * 100) / 100 }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function groupCount(arr: any[], keyFn: (r: any) => string) {
  const map: Record<string, number> = {};
  arr.forEach(r => {
    const k = keyFn(r) || 'Other';
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/* ── Sort + format month-based data ──────────────────────── */
function monthSorted(data: { name: string; value: number }[]) {
  return data
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(d => ({ ...d, name: fmtMonth(d.name) }));
}

/* ── Key extractors ──────────────────────────────────────── */
const byMonth = (r: any) => r.date?.slice(0, 7) || 'Unknown';
const byBranch = (r: any) => {
  const b = r.branch;
  if (b === 'A') return 'Branch A';
  if (b === 'B') return 'Branch B';
  if (b === 'C') return 'Branch C';
  return b || 'Unknown';
};
const byCity = (r: any) => r.city || 'Unknown';
const byProduct = (r: any) => r.productLine || 'Unknown';
const byCustType = (r: any) => r.customerType || 'Unknown';
const byPayment = (r: any) => r.payment || 'Unknown';
const byGender = (r: any) => r.gender || 'Unknown';

/* ── Chart config builder ────────────────────────────────── */
interface ChartConfig {
  lineTitle: string;
  barTitle: string;
  pieTitle: string;
  lineData: any[];
  barData: any[];
  pieData: any[];
}

function buildConfig(title: string, data: any[]): ChartConfig {
  const t = title.toLowerCase();

  // Tab 2: Customers & Products
  if (t.includes('customer') || t.includes('product')) {
    return {
      lineTitle: 'Monthly Transactions',
      barTitle: 'Revenue by Product Line',
      pieTitle: 'Customer Type Split',
      lineData: monthSorted(groupCount(data, byMonth)),
      barData: groupSum(data, byProduct, r => r.total),
      pieData: groupSum(data, byCustType, r => r.total),
    };
  }

  // Tab 3: Branch & Footfall
  if (t.includes('branch')) {
    return {
      lineTitle: 'Footfall by Month',
      barTitle: 'Revenue by City',
      pieTitle: 'Branch Revenue Share',
      lineData: monthSorted(groupCount(data, byMonth)),
      barData: groupSum(data, byCity, r => r.total),
      pieData: groupSum(data, byBranch, r => r.total),
    };
  }

  // Tab 4: Sales Analytics
  if (t.includes('sales')) {
    return {
      lineTitle: 'Monthly Sales Revenue',
      barTitle: 'Avg Unit Price by Category',
      pieTitle: 'Sales by Gender',
      lineData: monthSorted(groupSum(data, byMonth, r => r.total)),
      barData: groupAvg(data, byProduct, r => r.unitPrice),
      pieData: groupSum(data, byGender, r => r.total),
    };
  }

  // Tab 5: Profitability
  if (t.includes('profit')) {
    return {
      lineTitle: 'Monthly Gross Income',
      barTitle: 'Gross Income by Branch',
      pieTitle: 'Profit by Product Line',
      lineData: monthSorted(groupSum(data, byMonth, r => r.grossIncome)),
      barData: groupSum(data, byBranch, r => r.grossIncome),
      pieData: groupSum(data, byProduct, r => r.grossIncome),
    };
  }

  // Tab 6: Inventory
  if (t.includes('inventory')) {
    return {
      lineTitle: 'Quantity Sold by Month',
      barTitle: 'Quantity by Product Line',
      pieTitle: 'COGS by Category',
      lineData: monthSorted(groupSum(data, byMonth, r => r.quantity)),
      barData: groupSum(data, byProduct, r => r.quantity),
      pieData: groupSum(data, byProduct, r => r.cogs),
    };
  }

  // Tab 7: Payment Analytics
  if (t.includes('payment')) {
    return {
      lineTitle: 'Monthly Transaction Count',
      barTitle: 'Revenue by Payment Method',
      pieTitle: 'Payment Method Share',
      lineData: monthSorted(groupCount(data, byMonth)),
      barData: groupSum(data, byPayment, r => r.total),
      pieData: groupCount(data, byPayment),
    };
  }

  // Tab 8: Discount & Promotion
  if (t.includes('discount') || t.includes('promotion')) {
    return {
      lineTitle: 'Monthly Gross Margin',
      barTitle: 'Avg Rating by Branch',
      pieTitle: 'Member vs Normal',
      lineData: monthSorted(groupSum(data, byMonth, r => r.grossIncome)),
      barData: groupAvg(data, byBranch, r => r.rating),
      pieData: groupCount(data, byCustType),
    };
  }

  // Tab 9: Advanced Analytics
  if (t.includes('advanced')) {
    const sorted = [...data].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    let cum = 0;
    const cumMap: Record<string, number> = {};
    sorted.forEach(r => {
      cum += r.total || 0;
      cumMap[r.date?.slice(0, 7) || 'Unknown'] = cum;
    });
    return {
      lineTitle: 'Cumulative Revenue',
      barTitle: 'Avg Order Value by Category',
      pieTitle: 'Tax Contribution by Branch',
      lineData: Object.entries(cumMap)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, value]) => ({ name: fmtMonth(name), value: Math.round(value) })),
      barData: groupAvg(data, byProduct, r => r.total),
      pieData: groupSum(data, byBranch, r => r.tax5Percent),
    };
  }

  // Tab 10: What-If Simulator
  if (t.includes('what if') || t.includes('simulator')) {
    return {
      lineTitle: 'Simulated Revenue (+15%)',
      barTitle: 'Simulated Branch Revenue',
      pieTitle: 'Simulated Category Mix',
      lineData: monthSorted(groupSum(data, byMonth, r => r.total * 1.15)),
      barData: groupSum(data, byBranch, r => r.total * 1.15),
      pieData: groupSum(data, byProduct, r => r.total * 1.15),
    };
  }

  // Default: Tab 1 Executive Overview
  return {
    lineTitle: 'Monthly Revenue Trend',
    barTitle: 'Revenue by Branch',
    pieTitle: 'Product Line Mix',
    lineData: monthSorted(groupSum(data, byMonth, r => r.total)),
    barData: groupSum(data, byBranch, r => r.total),
    pieData: groupSum(data, byProduct, r => r.total),
  };
}

/* ── Consistent chart colors ─────────────────────────────── */
const LINE_COLOR = '#10b981';
const BAR_COLOR = '#3b82f6';
const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f43f5e'];

/* ── Component ───────────────────────────────────────────── */
export const MultiChartSection: React.FC<MultiChartSectionProps> = ({ data, title = "Analytics Trends", onFilter }) => {
  useTheme(); // subscribe to theme changes

  const config = useMemo(() => buildConfig(title, data), [title, data]);

  const { lineTitle, barTitle, pieTitle } = config;
  let { lineData, barData, pieData } = config;

  if (!lineData.length) lineData = [{ name: 'No Data', value: 0 }];
  if (!barData.length) barData = [{ name: 'No Data', value: 0 }];
  if (!pieData.length) pieData = [{ name: 'No Data', value: 0 }];

  const axisStyle = { fill: 'var(--text-muted)', fontSize: 11 };
  const tooltipStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-main)',
    fontSize: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  };

  const fmtVal = (v: any) => {
    if (typeof v !== 'number') return v;
    return v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : v.toFixed(1);
  };

  /* ── Shared card class ─────────────────────────────────── */
  const cardClass = "themed-card rounded-2xl p-5 shadow-sm border transition-shadow hover:shadow-md";

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold themed-text mb-4">{title}</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ═══ LINE / AREA CHART ═══ */}
        <div className={cardClass}>
          <h4 className="text-[11px] font-semibold themed-text-muted mb-3 uppercase tracking-wider">{lineTitle}</h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={LINE_COLOR} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={LINE_COLOR} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={fmtVal} />
                <RechartsTooltip
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: 'var(--text-main)' }}
                  formatter={(v: any) => [fmtVal(v), lineTitle]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={LINE_COLOR}
                  strokeWidth={3}
                  fill="url(#areaFill)"
                  dot={{ r: 5, fill: LINE_COLOR, stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: LINE_COLOR, stroke: '#fff', strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ═══ BAR CHART ═══ */}
        <div className={cardClass}>
          <h4 className="text-[11px] font-semibold themed-text-muted mb-3 uppercase tracking-wider">{barTitle}</h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BAR_COLOR} stopOpacity={1} />
                    <stop offset="100%" stopColor={BAR_COLOR} stopOpacity={0.55} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={fmtVal} />
                <RechartsTooltip
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: 'var(--text-main)' }}
                  cursor={{ fill: 'var(--border-color)', opacity: 0.3 }}
                  formatter={(v: any) => [fmtVal(v), barTitle]}
                />
                <Bar
                  dataKey="value"
                  fill="url(#barGrad)"
                  radius={[6, 6, 0, 0]}
                  onClick={(d: any) => { if (onFilter && d?.name) onFilter('bar', d.name); }}
                  className="cursor-pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ═══ DONUT CHART ═══ */}
        <div className={cardClass}>
          <h4 className="text-[11px] font-semibold themed-text-muted mb-3 uppercase tracking-wider">{pieTitle}</h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                  onClick={(d: any) => { if (onFilter && d?.name) onFilter('pie', d.name); }}
                  className="cursor-pointer"
                >
                  {pieData.map((_entry, idx) => (
                    <Cell key={`pie-cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: 'var(--text-main)' }}
                  formatter={(v: any, name: any) => [fmtVal(v), name]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)' }}
                  formatter={(value: string) => <span style={{ color: 'var(--text-main)', fontSize: '11px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
