import React, { useState } from 'react';
import { MultiChartSection } from '../MultiChartSection';
import { Database, Key, ArrowRight, Info, Layers } from 'lucide-react';

export const DataModelTab: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('Fact_SupermarketSales');

  const tables = [
    {
      id: 'Fact_SupermarketSales',
      name: 'Fact_SupermarketSales',
      type: 'Fact Table (Central)',
      records: '1,000 Rows',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Contains high-velocity retail sales transactions and numerical measures.',
      columns: [
        { name: 'Invoice ID', type: 'Text (PK)', key: true },
        { name: 'Branch', type: 'Text (FK)', key: true },
        { name: 'Product line', type: 'Text (FK)', key: true },
        { name: 'Customer type', type: 'Text (FK)', key: true },
        { name: 'Payment', type: 'Text (FK)', key: true },
        { name: 'Date', type: 'Date (FK)', key: true },
        { name: 'Time', type: 'Time', key: false },
        { name: 'Unit price', type: 'Currency / Float', key: false },
        { name: 'Quantity', type: 'Integer', key: false },
        { name: 'Tax 5%', type: 'Currency / Float', key: false },
        { name: 'Total', type: 'Currency / Float', key: false },
        { name: 'cogs', type: 'Currency / Float', key: false },
        { name: 'gross margin %', type: 'Percentage', key: false },
        { name: 'gross income', type: 'Currency / Float', key: false },
        { name: 'Rating', type: 'Float (1-10)', key: false },
      ],
    },
    {
      id: 'Dim_Date',
      name: 'Dim_Date',
      type: 'Dimension Table',
      records: '90 Calendar Days',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      description: 'Dedicated time dimension generated via Power Query M-Code for time intelligence (YTD, MoM, 7D Moving Avg).',
      columns: [
        { name: 'Date', type: 'Date (PK)', key: true },
        { name: 'Year', type: 'Integer (e.g. 2025)', key: false },
        { name: 'Month No', type: 'Integer (1-12)', key: false },
        { name: 'Month Name', type: 'Text (January, February)', key: false },
        { name: 'Month Year', type: 'Text (Jan 2025)', key: false },
        { name: 'Day Name', type: 'Text (Monday, Tuesday)', key: false },
        { name: 'Quarter', type: 'Text (Q1, Q2)', key: false },
      ],
    },
    {
      id: 'Dim_Branch',
      name: 'Dim_Branch',
      type: 'Dimension Table',
      records: '3 Branches',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Store location master containing geographic metadata and city operational profiles.',
      columns: [
        { name: 'Branch', type: 'Text (PK)', key: true },
        { name: 'City', type: 'Text (Yangon, Naypyitaw, Mandalay)', key: false },
        { name: 'Country', type: 'Text (Myanmar)', key: false },
        { name: 'Region Type', type: 'Text (Commercial / Capital)', key: false },
      ],
    },
    {
      id: 'Dim_Product',
      name: 'Dim_Product',
      type: 'Dimension Table',
      records: '6 Product Lines',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      description: 'Merchandise taxonomy categorization across retail departments.',
      columns: [
        { name: 'Product Line', type: 'Text (PK)', key: true },
        { name: 'Department', type: 'Text (FMCG, Apparel, Tech, Leisure)', key: false },
        { name: 'Tax Bracket', type: 'Fixed (5%)', key: false },
        { name: 'Standard Margin Band', type: 'Text (High, Standard)', key: false },
      ],
    },
    {
      id: 'Dim_Customer',
      name: 'Dim_Customer',
      type: 'Dimension Table',
      records: '2 Loyalty Tiers',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      description: 'Customer loyalty tier dimension supporting membership penetration analysis.',
      columns: [
        { name: 'Customer Type', type: 'Text (PK)', key: true },
        { name: 'Loyalty Status', type: 'Text (Enrolled vs Walk-in)', key: false },
        { name: 'Discount Privilege', type: 'Text (Eligible vs Standard)', key: false },
      ],
    },
  ];

  const relationships = [
    { from: 'Dim_Date [Date]', to: 'Fact_SupermarketSales [Date]', cardinality: '1 to Many (1:*)', direction: 'Single' },
    { from: 'Dim_Branch [Branch]', to: 'Fact_SupermarketSales [Branch]', cardinality: '1 to Many (1:*)', direction: 'Single' },
    { from: 'Dim_Product [Product Line]', to: 'Fact_SupermarketSales [Product line]', cardinality: '1 to Many (1:*)', direction: 'Single' },
    { from: 'Dim_Customer [Customer Type]', to: 'Fact_SupermarketSales [Customer type]', cardinality: '1 to Many (1:*)', direction: 'Single' },
  ];

  const activeTableObj = tables.find((t) => t.id === selectedTable) || tables[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Power BI Star Schema & Data Architecture
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enterprise dimensional model designed for VertiPaq memory optimization and 1-to-many relationship navigation.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 font-bold">
          <span>Star Schema: Verified</span>
        </div>
      </div>

      {/* Visual Model Canvas */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-xs relative">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Interactive Star Schema Diagram (Click an entity to inspect attributes)</span>
        </div>

        {/* 4 Dimension Table Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Dim_Date */}
          <div
            onClick={() => setSelectedTable('Dim_Date')}
            className={`cursor-pointer rounded-xl p-4 border bg-white transition shadow-xs ${
              selectedTable === 'Dim_Date'
                ? 'border-blue-600 ring-2 ring-blue-100'
                : 'border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-blue-700">Dim_Date</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-mono px-2 py-0.5 rounded font-bold">1:★</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Calendar Dimension (90 days)</div>
          </div>

          {/* Dim_Branch */}
          <div
            onClick={() => setSelectedTable('Dim_Branch')}
            className={`cursor-pointer rounded-xl p-4 border bg-white transition shadow-xs ${
              selectedTable === 'Dim_Branch'
                ? 'border-blue-600 ring-2 ring-blue-100'
                : 'border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-blue-700">Dim_Branch</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-mono px-2 py-0.5 rounded font-bold">1:★</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Store Locations & Cities</div>
          </div>

          {/* Dim_Product */}
          <div
            onClick={() => setSelectedTable('Dim_Product')}
            className={`cursor-pointer rounded-xl p-4 border bg-white transition shadow-xs ${
              selectedTable === 'Dim_Product'
                ? 'border-blue-600 ring-2 ring-blue-100'
                : 'border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-blue-700">Dim_Product</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-mono px-2 py-0.5 rounded font-bold">1:★</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">6 Product Categories</div>
          </div>

          {/* Dim_Customer */}
          <div
            onClick={() => setSelectedTable('Dim_Customer')}
            className={`cursor-pointer rounded-xl p-4 border bg-white transition shadow-xs ${
              selectedTable === 'Dim_Customer'
                ? 'border-blue-600 ring-2 ring-blue-100'
                : 'border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-blue-700">Dim_Customer</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-mono px-2 py-0.5 rounded font-bold">1:★</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Loyalty Tier (Member/Normal)</div>
          </div>
        </div>

        {/* Central Hub: Fact Table */}
        <div className="flex justify-center">
          <div
            onClick={() => setSelectedTable('Fact_SupermarketSales')}
            className={`cursor-pointer rounded-xl p-5 border bg-white max-w-xl w-full text-center transition shadow-xs ${
              selectedTable === 'Fact_SupermarketSales'
                ? 'border-blue-600 ring-4 ring-blue-100'
                : 'border-slate-300 hover:border-blue-500'
            }`}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold mb-2">
              <Database className="w-3.5 h-3.5" />
              CENTRAL FACT TABLE
            </div>
            <h3 className="text-base font-bold text-slate-900">Fact_SupermarketSales</h3>
            <p className="text-xs text-slate-500 mt-1">
              1,000 Transactional Invoices • Grain: 1 Row per Point-of-Sale Checkout
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Selected Table Details & Active Relationships */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table Details */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">{activeTableObj.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                  {activeTableObj.type}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{activeTableObj.description}</p>
            </div>
            <span className="text-xs font-bold text-blue-700">{activeTableObj.records}</span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Column Name</th>
                  <th className="py-2.5 px-3">Data Type</th>
                  <th className="py-2.5 px-3 text-right">Key Attribute</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {activeTableObj.columns.map((col) => (
                  <tr key={col.name} className="hover:bg-blue-50/40">
                    <td className="py-2 px-3 text-slate-800 font-semibold font-sans">
                      {col.name}
                    </td>
                    <td className="py-2 px-3 text-slate-500">{col.type}</td>
                    <td className="py-2 px-3 text-right">
                      {col.key ? (
                        <span className="inline-flex items-center gap-1 text-blue-700 font-sans text-[11px] font-bold">
                          <Key className="w-3 h-3 text-blue-600" /> Key
                        </span>
                      ) : (
                        <span className="text-slate-400 font-sans text-[11px]">Attribute</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Relationships Table & Viva Defense Notes */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Active Model Relationships
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Single-directional 1-to-Many (*:1) filter propagation paths
            </p>

            <div className="space-y-3">
              {relationships.map((rel, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center justify-between text-slate-800 font-mono text-[11px] mb-1">
                    <span className="font-semibold text-blue-700">{rel.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mx-1" />
                    <span className="font-semibold text-slate-800">{rel.to}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-sans">
                    <span>Cardinality: <strong className="text-slate-800">{rel.cardinality}</strong></span>
                    <span>Filter: <strong className="text-blue-700">{rel.direction}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-xs text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <Info className="w-4 h-4 text-blue-600" />
              <span>College Viva Defense Tip</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Why Star Schema?
              <br />
              <strong className="text-blue-950 font-semibold">
                "VertiPaq utilizes columnar compression and dictionary encoding. Separating dimensions from the central fact table eliminates text repetition, saving memory and speeding up DAX calculations."
              </strong>
            </p>
          </div>
        </div>
      </div>
          <MultiChartSection data={[]} title="Data Model Analytics" />
    </div>
  );
};