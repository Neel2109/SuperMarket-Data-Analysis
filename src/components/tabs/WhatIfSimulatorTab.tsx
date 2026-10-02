import React, { useState } from 'react';
import { SaleRecord } from '../../types';
import { MultiChartSection } from '../MultiChartSection';

import { Sliders, TrendingUp, TrendingDown, RotateCcw, AlertCircle, Calculator } from 'lucide-react';

interface WhatIfSimulatorTabProps {
  data: SaleRecord[];
}

export const WhatIfSimulatorTab: React.FC<WhatIfSimulatorTabProps> = ({ data }) => {
  // Simulator Parameters
  const [priceDelta, setPriceDelta] = useState<number>(5); // +5% price change
  const [volumeDelta, setVolumeDelta] = useState<number>(0); // 0% transaction volume change
  const [cogsInflation, setCogsInflation] = useState<number>(3); // +3% wholesale cost inflation
  const [memberDiscount, setMemberDiscount] = useState<number>(2); // 2% additional member loyalty rebate

  // Base Numbers
  const baseRevenue = data.reduce((acc, r) => acc + r.total, 0);
  const baseCogs = data.reduce((acc, r) => acc + r.cogs, 0);
  const baseProfit = baseRevenue - baseCogs;
  const baseMargin = baseRevenue > 0 ? (baseProfit / baseRevenue) * 100 : 0;

  // Projected Numbers with Price Elasticity modeling (-0.3 elasticity: a 10% price rise drops volume by 3%)
  const elasticityFactor = 1 - (priceDelta * 0.3) / 100;
  const effectiveVolumeMultiplier = (1 + volumeDelta / 100) * elasticityFactor;

  // Adjusted Price per unit
  const effectivePriceMultiplier = 1 + priceDelta / 100;
  // Cost multiplier
  const effectiveCostMultiplier = 1 + cogsInflation / 100;

  // Member share
  const memberRevenueShare = 0.50; // ~50%
  const discountImpact = (memberRevenueShare * memberDiscount) / 100;

  const projectedRevenue = baseRevenue * effectivePriceMultiplier * effectiveVolumeMultiplier * (1 - discountImpact);
  const projectedCogs = baseCogs * effectiveCostMultiplier * effectiveVolumeMultiplier;
  const projectedProfit = projectedRevenue - projectedCogs;
  const projectedMargin = projectedRevenue > 0 ? (projectedProfit / projectedRevenue) * 100 : 0;

  const profitDiff = projectedProfit - baseProfit;
  const revenueDiff = projectedRevenue - baseRevenue;

  const handleReset = () => {
    setPriceDelta(0);
    setVolumeDelta(0);
    setCogsInflation(0);
    setMemberDiscount(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            Power BI What-If Parameter & Scenario Modeling
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulate revenue, profit margins, and price elasticity using dynamic Power BI parameter sliders.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sliders</span>
        </button>
      </div>

      {/* Simulator Controls & KPI Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: What-If Parameter Slicers */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              What-If Parameter Sliders
            </h3>
            <span className="text-[11px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-semibold">
              Elasticity Model Active
            </span>
          </div>

          {/* Slider 1: Retail Price Adjustment */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-700 font-medium">1. Retail Unit Price Adjustment</span>
              <span className="font-mono font-bold text-blue-600">
                {priceDelta > 0 ? `+${priceDelta}%` : `${priceDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              step="1"
              value={priceDelta}
              onChange={(e) => setPriceDelta(Number(e.target.value))}
              aria-label="Retail Unit Price Adjustment"
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-20% (Discount)</span>
              <span>0% (Baseline)</span>
              <span>+30% (Price Hike)</span>
            </div>
          </div>

          {/* Slider 2: Footfall / Transaction Volume Change */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-700 font-medium">2. Footfall / Volume Growth</span>
              <span className="font-mono font-bold text-blue-600">
                {volumeDelta > 0 ? `+${volumeDelta}%` : `${volumeDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="1"
              value={volumeDelta}
              onChange={(e) => setVolumeDelta(Number(e.target.value))}
              aria-label="Footfall / Volume Growth"
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-30%</span>
              <span>0%</span>
              <span>+50% (Marketing Surge)</span>
            </div>
          </div>

          {/* Slider 3: Wholesale COGS Inflation */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-700 font-medium">3. Wholesale Cost Inflation (COGS)</span>
              <span className="font-mono font-bold text-rose-600">
                {cogsInflation > 0 ? `+${cogsInflation}%` : `${cogsInflation}%`}
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="25"
              step="1"
              value={cogsInflation}
              onChange={(e) => setCogsInflation(Number(e.target.value))}
              aria-label="Wholesale Cost Inflation"
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-10% Deflation</span>
              <span>0% Flat</span>
              <span>+25% Supply Shock</span>
            </div>
          </div>

          {/* Slider 4: Member Loyalty Rebate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-700 font-medium">4. Additional Member Loyalty Cashback</span>
              <span className="font-mono font-bold text-purple-600">
                {memberDiscount}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={memberDiscount}
              onChange={(e) => setMemberDiscount(Number(e.target.value))}
              aria-label="Additional Member Loyalty Cashback"
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Standard)</span>
              <span>7.5%</span>
              <span>15% (Aggressive Retention)</span>
            </div>
          </div>
        </div>

        {/* Right: Projected vs Baseline KPI Cards */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Projected Financial Impact Analysis
            </h3>
            <span
              className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                profitDiff >= 0
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {profitDiff >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {profitDiff >= 0 ? `+$${profitDiff.toFixed(0)} Net Profit` : `-$${Math.abs(profitDiff).toFixed(0)} Net Profit`}
            </span>
          </div>

          {/* Projected Revenue Comparison */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Projected Gross Revenue:</span>
              <div className="font-mono text-right">
                <span className="text-base font-bold text-slate-900">
                  ${projectedRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
                <span className={`text-[11px] ml-2 font-semibold ${revenueDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ({revenueDiff >= 0 ? '+' : ''}${revenueDiff.toFixed(0)})
                </span>
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Baseline Historical Sales:</span>
              <span className="font-mono font-semibold">${baseRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          {/* Projected Gross Profit Comparison */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Projected Gross Profit:</span>
              <div className="font-mono text-right">
                <span
                  className={`text-base font-bold ${
                    profitDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  ${projectedProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
                <span className={`text-[11px] ml-2 font-semibold ${profitDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ({profitDiff >= 0 ? '+' : ''}${profitDiff.toFixed(0)})
                </span>
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Baseline Historical Profit:</span>
              <span className="font-mono font-semibold">${baseProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          {/* Projected Margin % Gauge */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Projected Margin %:</span>
              <div className="font-mono">
                <span className="font-bold text-slate-900 text-sm">{projectedMargin.toFixed(2)}%</span>
                <span className="text-slate-500 text-xs ml-2">(Baseline: {baseMargin.toFixed(2)}%)</span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  projectedMargin >= baseMargin ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(Math.max(projectedMargin * 10, 5), 100)}%` }}
              />
            </div>
          </div>

          {/* College Viva Defense Card */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-slate-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-blue-900">How to explain What-If parameters to your professor: </strong>
              "In Power BI Desktop, What-If parameters create disconnected DAX calculated tables using <code>GENERATESERIES()</code> and a measure that harvest the slicer value via <code>SELECTEDVALUE()</code> to dynamically simulate scenarios."
            </div>
          </div>
        </div>
      </div>
          <MultiChartSection data={data} title="What If Simulator Analytics" />
    </div>
  );
};