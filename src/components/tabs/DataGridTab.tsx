import React, { useState } from 'react';
import { SaleRecord } from '../../types';
import { MultiChartSection } from '../MultiChartSection';


import { convertToCSV, downloadFile } from '../../data/supermarketData';
import {
  FileSpreadsheet,
  Download,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface DataGridTabProps {
  data: SaleRecord[];
  onAddTransaction: (record: SaleRecord) => void;
}

export const DataGridTab: React.FC<DataGridTabProps> = ({ data, onAddTransaction }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Transaction Form State
  const [branch, setBranch] = useState<'A' | 'B' | 'C'>('A');
  const [customerType, setCustomerType] = useState<'Member' | 'Normal'>('Member');
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');
  const [productLine, setProductLine] = useState<SaleRecord['productLine']>('Food and beverages');
  const [unitPrice, setUnitPrice] = useState<number>(45.5);
  const [quantity, setQuantity] = useState<number>(3);
  const [payment, setPayment] = useState<'Cash' | 'Credit card' | 'Ewallet'>('Ewallet');
  const [rating, setRating] = useState<number>(8.5);

  const filtered = data.filter((row) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      row.invoiceId.toLowerCase().includes(s) ||
      row.city.toLowerCase().includes(s) ||
      row.productLine.toLowerCase().includes(s) ||
      row.payment.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const currentRows = filtered.slice(startIndex, startIndex + pageSize);

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const cityMap: Record<'A' | 'B' | 'C', 'Yangon' | 'Naypyitaw' | 'Mandalay'> = {
      A: 'Yangon',
      B: 'Mandalay',
      C: 'Naypyitaw',
    };

    const cogs = parseFloat((unitPrice * quantity).toFixed(2));
    const tax5Percent = parseFloat((cogs * 0.05).toFixed(4));
    const total = parseFloat((cogs + tax5Percent).toFixed(4));
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const invoiceId = `INV-${branch}${dateStr.replace(/-/g, '').slice(2, 6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord: SaleRecord = {
      invoiceId,
      branch,
      city: cityMap[branch],
      customerType,
      gender,
      productLine,
      unitPrice,
      quantity,
      tax5Percent,
      total,
      date: dateStr,
      time: timeStr,
      payment,
      cogs,
      grossMarginPercentage: 4.7619,
      grossIncome: tax5Percent,
      rating,
    };

    onAddTransaction(newRecord);
    setIsModalOpen(false);
  };

  const handleDownloadCSV = () => {
    const csv = convertToCSV(data);
    downloadFile(csv, 'Supermarket_Sales_Dataset.csv', 'text/csv;charset=utf-8;');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            Supermarket Fact Table Data Grid (1,000 Transactions)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full transactional dataset matching Kaggle & Walmart retail schema standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add POS Record</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV (1,000 Rows)</span>
          </button>
        </div>
      </div>

      {/* Search & Pagination Control */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search invoice, branch, city, product..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              aria-label="Rows per page"
              className="bg-slate-50 border border-slate-300 text-slate-800 rounded px-2 py-1 text-xs"
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            {startIndex + 1} - {Math.min(startIndex + pageSize, filtered.length)} of {filtered.length}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 border border-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs text-blue-700 px-1 font-bold">
              {page}/{totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 border border-slate-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Invoice ID</th>
                <th className="py-2.5 px-2">Branch</th>
                <th className="py-2.5 px-2">City</th>
                <th className="py-2.5 px-2">Customer</th>
                <th className="py-2.5 px-2">Product Line</th>
                <th className="py-2.5 px-2 text-right">Unit Price</th>
                <th className="py-2.5 px-2 text-right">Qty</th>
                <th className="py-2.5 px-2 text-right">Tax (5%)</th>
                <th className="py-2.5 px-2 text-right">Total ($)</th>
                <th className="py-2.5 px-2">Date & Time</th>
                <th className="py-2.5 px-2">Payment</th>
                <th className="py-2.5 px-3 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {currentRows.map((r) => (
                <tr key={r.invoiceId} className="hover:bg-blue-50/40 transition">
                  <td className="py-2 px-3 font-bold text-blue-700">{r.invoiceId}</td>
                  <td className="py-2 px-2 text-slate-800 font-sans font-semibold">{r.branch}</td>
                  <td className="py-2 px-2 text-slate-600 font-sans">{r.city}</td>
                  <td className="py-2 px-2 font-sans">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        r.customerType === 'Member'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {r.customerType}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-slate-700 font-sans">{r.productLine}</td>
                  <td className="py-2 px-2 text-right text-slate-700">${r.unitPrice.toFixed(2)}</td>
                  <td className="py-2 px-2 text-right text-slate-700">{r.quantity}</td>
                  <td className="py-2 px-2 text-right text-slate-500">${r.tax5Percent.toFixed(2)}</td>
                  <td className="py-2 px-2 text-right font-bold text-slate-900">${r.total.toFixed(2)}</td>
                  <td className="py-2 px-2 text-slate-500 font-sans text-[10px]">
                    {r.date} {r.time}
                  </td>
                  <td className="py-2 px-2 font-sans text-slate-700">{r.payment}</td>
                  <td className="py-2 px-3 text-right text-amber-600 font-bold">★ {r.rating.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add POS Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xl max-w-lg w-full p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              Add New Point-of-Sale Record
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a simulated supermarket transaction. Changes immediately update all Power BI dashboard visuals.
            </p>

            <form onSubmit={handleCreateRecord} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                  >
                    <option value="A">Branch A (Yangon)</option>
                    <option value="B">Branch B (Mandalay)</option>
                    <option value="C">Branch C (Naypyitaw)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Customer Type</label>
                  <select
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                  >
                    <option value="Member">Loyalty Member</option>
                    <option value="Normal">Normal Walk-in</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Product Line</label>
                  <select
                    value={productLine}
                    onChange={(e) => setProductLine(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                  >
                    <option value="Electronic accessories">Electronic accessories</option>
                    <option value="Fashion accessories">Fashion accessories</option>
                    <option value="Food and beverages">Food and beverages</option>
                    <option value="Health and beauty">Health and beauty</option>
                    <option value="Home and lifestyle">Home and lifestyle</option>
                    <option value="Sports and travel">Sports and travel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Payment Method</label>
                  <select
                    value={payment}
                    onChange={(e) => setPayment(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                  >
                    <option value="Ewallet">E-Wallet</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit card">Credit Card</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Quantity (Items)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Rating (1-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(parseFloat(e.target.value) || 5)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 text-slate-600 font-mono text-[11px] bg-slate-50 p-2.5 rounded border border-slate-200">
                Calculated Total: <span className="text-blue-700 font-bold">${(unitPrice * quantity * 1.05).toFixed(2)}</span> (Tax 5%: ${(unitPrice * quantity * 0.05).toFixed(2)})
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
          <MultiChartSection data={data} title="Data Grid Analytics" />
    </div>
  );
};