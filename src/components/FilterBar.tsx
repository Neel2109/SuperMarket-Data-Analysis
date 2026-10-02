import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { FilterState } from '../types';
import { DateRangePicker } from './DateRangePicker';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalRecords: number;
  filteredCount: number;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  totalRecords,
  filteredCount,
  onReset,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 p-3 sm:p-4 text-xs text-slate-700 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Slicer Group Header */}
        <div className="flex items-center space-x-2 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter Slicers:</span>
          <span className="bg-blue-50 text-blue-700 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
            {filteredCount} / {totalRecords} Invoices
          </span>
        </div>

        {/* Controls Container */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 justify-end">
          <DateRangePicker 
            startDate={filters.dateRange[0]} 
            endDate={filters.dateRange[1]} 
            onChange={(range) => setFilters(prev => ({ ...prev, dateRange: range }))} 
          />
          {/* Branch Slicer */}
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium">Branch:</span>
            <select
              value={filters.branch}
              onChange={(e) => setFilters((prev) => ({ ...prev, branch: e.target.value }))}
              aria-label="Filter by Branch"
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All">All Branches</option>
              <option value="A">Branch A (Yangon)</option>
              <option value="B">Branch B (Mandalay)</option>
              <option value="C">Branch C (Naypyitaw)</option>
            </select>
          </div>

          {/* Product Line Slicer */}
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium">Category:</span>
            <select
              value={filters.productLine}
              onChange={(e) => setFilters((prev) => ({ ...prev, productLine: e.target.value }))}
              aria-label="Filter by Category"
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[170px] truncate"
            >
              <option value="All">All Categories</option>
              <option value="Electronic accessories">Electronic accessories</option>
              <option value="Fashion accessories">Fashion accessories</option>
              <option value="Food and beverages">Food and beverages</option>
              <option value="Health and beauty">Health and beauty</option>
              <option value="Home and lifestyle">Home and lifestyle</option>
              <option value="Sports and travel">Sports and travel</option>
            </select>
          </div>

          {/* Customer Type Slicer */}
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium">Customer:</span>
            <select
              value={filters.customerType}
              onChange={(e) => setFilters((prev) => ({ ...prev, customerType: e.target.value }))}
              aria-label="Filter by Customer Type"
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Member">Member (Loyalty)</option>
              <option value="Normal">Normal (Walk-in)</option>
            </select>
          </div>

          {/* Payment Method Slicer */}
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium">Payment:</span>
            <select
              value={filters.payment}
              onChange={(e) => setFilters((prev) => ({ ...prev, payment: e.target.value }))}
              aria-label="Filter by Payment Method"
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All">All Payments</option>
              <option value="Cash">Cash</option>
              <option value="Credit card">Credit Card</option>
              <option value="Ewallet">E-Wallet</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search invoice or city..."
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="bg-slate-50 text-slate-800 pl-7 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-xs w-32 sm:w-44 placeholder-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
          </div>

          {/* Reset Slicers */}
          <button
            onClick={onReset}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition font-medium"
            title="Clear all filters"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
