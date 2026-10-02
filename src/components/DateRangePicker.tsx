import React, { useState } from 'react';
import { format } from 'date-fns';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (range: [string, string]) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const initialRange: DateRange = {
    from: new Date(startDate),
    to: new Date(endDate)
  };
  
  const [range, setRange] = useState<DateRange | undefined>(initialRange);

  const handleSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
    if (selectedRange?.from && selectedRange?.to) {
      onChange([
        format(selectedRange.from, 'yyyy-MM-dd'),
        format(selectedRange.to, 'yyyy-MM-dd')
      ]);
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 shadow-sm hover:border-blue-400 transition"
      >
        <CalendarIcon className="w-4 h-4 text-blue-500" />
        <span>
          {range?.from ? format(range.from, 'MMM dd, yyyy') : 'Start'} - {range?.to ? format(range.to, 'MMM dd, yyyy') : 'End'}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-2 left-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2"
          >
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">Select Date Range</span>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <DayPicker
              mode="range"
              selected={range}
              onSelect={handleSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
