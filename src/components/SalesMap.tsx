import React, { useMemo } from 'react';
import { SaleRecord } from '../types';
import { MapPin, TrendingUp, DollarSign, Users } from 'lucide-react';

interface SalesMapProps {
  data: SaleRecord[];
  onSelectCity?: (city: string) => void;
}

const CITY_COORDS: Record<string, { lat: number; lng: number; branch: string }> = {
  Yangon: { lat: 16.8661, lng: 96.1951, branch: 'A' },
  Mandalay: { lat: 21.9588, lng: 96.0891, branch: 'B' },
  Naypyitaw: { lat: 19.7633, lng: 96.0785, branch: 'C' },
};

export const SalesMap: React.FC<SalesMapProps> = ({ data, onSelectCity }) => {
  const cityStats = useMemo(() => {
    const stats: Record<string, { revenue: number; transactions: number; avgRating: number; ratingSum: number }> = {};
    Object.keys(CITY_COORDS).forEach(city => {
      stats[city] = { revenue: 0, transactions: 0, avgRating: 0, ratingSum: 0 };
    });
    data.forEach(r => {
      const city = r.city || 'Unknown';
      if (stats[city]) {
        stats[city].revenue += r.total;
        stats[city].transactions += 1;
        stats[city].ratingSum += r.rating;
      }
    });
    Object.keys(stats).forEach(city => {
      stats[city].avgRating = stats[city].transactions > 0
        ? stats[city].ratingSum / stats[city].transactions
        : 0;
    });
    return stats;
  }, [data]);

  const maxRevenue = Math.max(...Object.values(cityStats).map(s => s.revenue), 1);

  // SVG positions for simplified Myanmar map layout
  const cityPositions: Record<string, { x: number; y: number }> = {
    Mandalay: { x: 200, y: 100 },
    Naypyitaw: { x: 180, y: 200 },
    Yangon: { x: 160, y: 320 },
  };

  return (
    <div className="themed-card rounded-2xl p-5 shadow-sm border">
      <h4 className="text-sm font-semibold themed-text-muted mb-4 uppercase tracking-wider flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        Sales Distribution Map — Myanmar
      </h4>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SVG Map */}
        <div className="relative">
          <svg viewBox="0 0 360 440" className="w-full h-auto" style={{ maxHeight: '380px' }}>
            {/* Simplified Myanmar outline */}
            <path
              d="M120,30 C140,20 180,15 220,25 C250,35 270,60 275,90 C280,120 265,140 255,165 C245,190 240,210 235,240 C230,270 220,290 210,310 C200,330 190,350 175,370 C165,385 150,395 140,400 C130,395 120,380 115,360 C110,340 105,310 108,280 C110,250 115,220 118,190 C120,160 115,130 112,100 C110,70 112,45 120,30 Z"
              fill="var(--bg-card)"
              stroke="var(--border-color)"
              strokeWidth="2"
              opacity="0.8"
            />

            {/* River system decorative lines */}
            <path
              d="M195,50 C190,80 185,110 182,140 C179,170 176,200 170,230 C165,260 162,290 160,320 C158,340 157,360 155,375"
              fill="none"
              stroke="var(--chart-line-color)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.3"
            />

            {Object.entries(cityPositions).map(([city, pos]) => {
              const stat = cityStats[city];
              const sizeRatio = stat ? stat.revenue / maxRevenue : 0;
              const bubbleR = 15 + sizeRatio * 30;

              return (
                <g
                  key={city}
                  className="cursor-pointer"
                  onClick={() => onSelectCity?.(city)}
                >
                  {/* Pulse ring */}
                  <circle cx={pos.x} cy={pos.y} r={bubbleR + 8} fill="none" stroke="var(--chart-bar-color)" strokeWidth="1" opacity="0.3">
                    <animate attributeName="r" from={bubbleR + 4} to={bubbleR + 16} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>

                  {/* Main bubble */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={bubbleR}
                    fill="var(--chart-bar-color)"
                    opacity="0.7"
                    className="hover:opacity-100 transition-opacity"
                  />

                  {/* Revenue label */}
                  <text
                    x={pos.x}
                    y={pos.y - 2}
                    textAnchor="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    ${stat ? (stat.revenue / 1000).toFixed(0) : 0}k
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 12}
                    textAnchor="middle"
                    fill="white"
                    fontSize="9"
                    opacity="0.9"
                  >
                    {stat?.transactions || 0} txns
                  </text>

                  {/* City label */}
                  <text
                    x={pos.x + bubbleR + 8}
                    y={pos.y + 4}
                    fill="var(--text-main)"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {city}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* City Stats Cards */}
        <div className="space-y-3">
          {Object.entries(CITY_COORDS).map(([city, info]) => {
            const stat = cityStats[city];
            return (
              <button
                key={city}
                onClick={() => onSelectCity?.(city)}
                className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all themed-card group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition">
                      {info.branch}
                    </div>
                    <div>
                      <span className="font-bold text-sm themed-text">{city}</span>
                      <span className="text-xs themed-text-muted ml-2">Branch {info.branch}</span>
                    </div>
                  </div>
                  <MapPin className="w-4 h-4 themed-text-muted group-hover:text-blue-500 transition" />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div className="text-center">
                    <DollarSign className="w-3.5 h-3.5 mx-auto text-emerald-500 mb-1" />
                    <div className="text-xs font-bold themed-text">${stat ? (stat.revenue / 1000).toFixed(1) : 0}k</div>
                    <div className="text-[10px] themed-text-muted">Revenue</div>
                  </div>
                  <div className="text-center">
                    <Users className="w-3.5 h-3.5 mx-auto text-blue-500 mb-1" />
                    <div className="text-xs font-bold themed-text">{stat?.transactions || 0}</div>
                    <div className="text-[10px] themed-text-muted">Invoices</div>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-3.5 h-3.5 mx-auto text-amber-500 mb-1" />
                    <div className="text-xs font-bold themed-text">{stat ? stat.avgRating.toFixed(1) : 0}★</div>
                    <div className="text-[10px] themed-text-muted">Avg Rating</div>
                  </div>
                </div>
              </button>
            );
          })}

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
            <span><strong>Click</strong> on a city bubble or card to filter the entire dashboard by that branch.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
