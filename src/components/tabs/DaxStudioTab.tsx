import React, { useState } from 'react';
import { MultiChartSection } from '../MultiChartSection';
import { DAX_MEASURES } from '../../data/daxMeasures';
import { generateCustomDAXFormula } from '../../services/gemini';
import {
  Code2,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Filter,
  Send,
  Loader2,
  Terminal,
} from 'lucide-react';

export const DaxStudioTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    'All',
    'Key Metrics',
    'Time Intelligence',
    'Customer & Basket',
    'Ranking & Pareto',
    'Profitability',
  ];

  const filteredMeasures =
    selectedCategory === 'All'
      ? DAX_MEASURES
      : DAX_MEASURES.filter((m) => m.category === selectedCategory);

  const handleCopy = (formula: string, id: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateCustomDax = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setAiResult(null);
    try {
      const res = await generateCustomDAXFormula(aiPrompt);
      setAiResult(res);
    } catch (err: any) {
      setAiResult(`Error: ${err?.message || 'Failed to generate DAX measure'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-600" />
            Power BI DAX Studio & Measures Repository
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            25+ production-tested DAX formulas ready to copy and paste into Power BI Desktop or cite in your college project.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg font-bold">
            {DAX_MEASURES.length} Formulas Available
          </span>
        </div>
      </div>

      {/* AI DAX Generator Card (Soft Blue & White) */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Ask Gemini AI to Write Any Custom DAX Measure
          </h3>
          <span className="text-[10px] bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded font-bold">
            gemini-3.1-flash-lite
          </span>
        </div>
        <p className="text-xs text-slate-600 mb-3">
          Need a specific measure for your assignment? Type what you want to calculate in plain English:
        </p>

        <form onSubmit={handleGenerateCustomDax} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Calculate 30-day rolling sales for Member customers paying with E-Wallet"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
          />
          <button
            type="submit"
            disabled={isGenerating || !aiPrompt.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shrink-0 shadow-xs"
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Generate DAX</span>
          </button>
        </form>

        {aiResult && (
          <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap relative shadow-inner">
            <button
              onClick={() => handleCopy(aiResult, 'custom-ai')}
              className="absolute top-3 right-3 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Copy custom formula"
            >
              {copiedId === 'custom-ai' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            {aiResult}
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* DAX Measures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeasures.map((measure) => (
          <div
            key={measure.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3 hover:border-blue-300 transition"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-600" />
                  {measure.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 font-semibold">
                    {measure.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      measure.difficulty === 'Beginner'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : measure.difficulty === 'Intermediate'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {measure.difficulty}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleCopy(measure.formula, measure.id)}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition flex items-center gap-1.5 text-xs font-medium"
                title="Copy DAX code to clipboard"
              >
                {copiedId === measure.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[11px] text-emerald-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[11px]">Copy DAX</span>
                  </>
                )}
              </button>
            </div>

            {/* DAX Code Block */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 font-mono text-xs text-blue-900 overflow-x-auto leading-relaxed">
              <pre>{measure.formula}</pre>
            </div>

            {/* Explanation & Visual Suggestion */}
            <div className="space-y-1.5 text-xs">
              <p className="text-slate-600 leading-normal">{measure.description}</p>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Recommended Visual: <strong className="text-slate-800">{measure.powerBiVisual}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
          <MultiChartSection data={[]} title="Dax Studio Analytics" />
    </div>
  );
};