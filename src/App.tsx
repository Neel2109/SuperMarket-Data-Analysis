/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { User } from 'firebase/auth';
import {
  SaleRecord,
  FilterState,
  CollegeProjectInfo,
  ChatMessage,
} from './types';
import { generateInitialSupermarketData, convertToCSV, downloadFile } from './data/supermarketData';
import {
  generateAllDAXFileContent,
  generateFullCollegeReportMarkdown,
} from './data/powerBiProjectAssets';
import {
  auth,
  db,
  loginWithGoogle,
  logoutUser,
  subscribeToAuth,
  getUserProjectInfo,
  saveUserProjectInfo,
  loadUserChatHistory,
  saveCustomUserTransaction,
} from './services/firebase';
import { generateProjectInsights } from './services/gemini';

// Components
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { OverviewTab } from './components/tabs/OverviewTab';
import { CustomerProductTab } from './components/tabs/CustomerProductTab';
import { BranchAnalyticsTab } from './components/tabs/BranchAnalyticsTab';
import { SalesAnalyticsTab } from './components/tabs/SalesAnalyticsTab';
import { ProfitabilityTab } from './components/tabs/ProfitabilityTab';
import { InventoryTab } from './components/tabs/InventoryTab';
import { PaymentAnalyticsTab } from './components/tabs/PaymentAnalyticsTab';
import { DiscountPromotionTab } from './components/tabs/DiscountPromotionTab';
import { AdvancedAnalyticsTab } from './components/tabs/AdvancedAnalyticsTab';
import { DataModelTab } from './components/tabs/DataModelTab';
import { DaxStudioTab } from './components/tabs/DaxStudioTab';
import { WhatIfSimulatorTab } from './components/tabs/WhatIfSimulatorTab';
import { DataGridTab } from './components/tabs/DataGridTab';
import { ProjectReportTab } from './components/tabs/ProjectReportTab';
import { ExportModal } from './components/ExportModal';
import { ChatDrawer } from './components/ChatDrawer';
import { AnimatedTab } from './components/AnimatedTab';
import { AnimatePresence } from 'framer-motion';
import { NotificationContainer, showNotification } from './components/Notifications';
import { SkeletonLoader } from './components/SkeletonLoader';
import { useKeyboardShortcuts } from './components/KeyboardShortcuts';
import { ComparisonMode } from './components/ComparisonMode';
import {
  Sparkles,
  X,
  CheckCircle2,
  FileSpreadsheet,
  Code2,
  FileText,
  HelpCircle,
  FolderArchive,
  Download,
} from 'lucide-react';

export default function App() {
  // Full Dataset State (1,000 transactions)
  const [data, setData] = useState<SaleRecord[]>(() => generateInitialSupermarketData());

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Power BI Slicers State
  const [filters, setFilters] = useState<FilterState>({
    dateRange: ['2025-01-01', '2025-03-31'],
    branch: 'All',
    productLine: 'All',
    customerType: 'All',
    payment: 'All',
    gender: 'All',
    searchQuery: '',
  });

  // User Authentication
  const [user, setUser] = useState<User | null>(null);

  // College Project Submission Info
  const [projectInfo, setProjectInfo] = useState<CollegeProjectInfo>({
    studentName: 'Parvathy S.',
    rollNumber: '23MCA-DA-108',
    university: 'School of Computer Science & Information Technology',
    course: 'Master of Computer Applications (MCA) - Data Analytics Specialization',
    academicYear: '2024 - 2025',
    facultyGuide: 'Dr. V. Ramanathan, Professor of Business Intelligence',
    projectTitle: 'Supermarket Sales Multidimensional Business Intelligence Dashboard in Power BI',
  });

  // Chat & AI State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const firebaseStatus = useMemo(() => ({
    configured: !!auth && !!db,
    authenticated: !!user,
    statusLabel: user ? 'Authenticated and ready for Firestore sync' : 'Configured; sign in to enable live cloud write-back',
  }), [user]);

  // 1-Click AI Insights State
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [insightsModalOpen, setInsightsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useKeyboardShortcuts({
    setActiveTab,
    onResetFilters: () => {
      setFilters({
        dateRange: ['2025-01-01', '2025-03-31'],
        branch: 'All',
        productLine: 'All',
        customerType: 'All',
        payment: 'All',
        gender: 'All',
        searchQuery: '',
      });
    },
    onToggleChat: () => setChatOpen(prev => !prev),
  });

  const showToast = (msg: string) => {
    showNotification(msg, 'info'); // Map old showToast to new showNotification
  };

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load user saved college project info from Firestore
        const savedInfo = await getUserProjectInfo(currentUser.uid);
        if (savedInfo) {
          setProjectInfo(savedInfo);
        }
        // Load chat history from Firestore
        const history = await loadUserChatHistory(currentUser.uid);
        if (history.length > 0) {
          setMessages(history);
        }
        showToast(`Welcome back, ${currentUser.displayName || currentUser.email}!`);
      }
    });

    return () => unsubscribe();
  }, []);

  // Filtered dataset according to active slicers
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (filters.branch !== 'All' && row.branch !== filters.branch) return false;
      if (filters.productLine !== 'All' && row.productLine !== filters.productLine) return false;
      if (filters.customerType !== 'All' && row.customerType !== filters.customerType) return false;
      if (filters.payment !== 'All' && row.payment !== filters.payment) return false;
      if (filters.gender !== 'All' && row.gender !== filters.gender) return false;
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const match =
          row.invoiceId.toLowerCase().includes(q) ||
          row.city.toLowerCase().includes(q) ||
          row.productLine.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [data, filters]);

  // Aggregate stats for AI prompt context
  const datasetSummaryText = useMemo(() => {
    const totalSales = filteredData.reduce((acc, r) => acc + r.total, 0);
    const totalCogs = filteredData.reduce((acc, r) => acc + r.cogs, 0);
    const grossProfit = totalSales - totalCogs;
    const margin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;
    const aov = filteredData.length > 0 ? totalSales / filteredData.length : 0;
    return `Supermarket Dataset: 1,000 POS transactions across Yangon, Naypyitaw, Mandalay.
Total Invoices: ${filteredData.length}
Total Sales: $${totalSales.toFixed(2)}
Total COGS: $${totalCogs.toFixed(2)}
Gross Profit: $${grossProfit.toFixed(2)}
Gross Margin %: ${margin.toFixed(2)}%
Average Order Value: $${aov.toFixed(2)}
Active Slicers: Branch=${filters.branch}, Category=${filters.productLine}, Customer=${filters.customerType}, Payment=${filters.payment}`;
  }, [filteredData, filters]);

  // Handle Login / Logout
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      showNotification('Signed in successfully', 'success');
    } catch (e: any) {
      showNotification(`Login failed: ${e?.message || 'Could not sign in'}`, 'warning');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      showNotification('Signed out successfully.', 'info');
    } catch (e: any) {
      console.error(e);
      showNotification('Error signing out', 'warning');
    }
  };

  // Reset Slicers
  const handleResetFilters = () => {
    setFilters({
      dateRange: ['2025-01-01', '2025-03-31'],
      branch: 'All',
      productLine: 'All',
      customerType: 'All',
      payment: 'All',
      gender: 'All',
      searchQuery: '',
    });
  };

  // Quick Direct Downloads
  const handleQuickDownloadCSV = () => {
    const csv = convertToCSV(data);
    downloadFile(csv, 'Supermarket_Sales_Dataset.csv', 'text/csv;charset=utf-8;');
    showNotification('Downloaded Supermarket_Sales_Dataset.csv!', 'success');
  };

  const handleQuickDownloadDAX = () => {
    const dax = generateAllDAXFileContent();
    downloadFile(dax, 'Supermarket_PowerBI_DAX_Measures.dax', 'text/plain;charset=utf-8;');
    showNotification('Downloaded Supermarket_PowerBI_DAX_Measures.dax!', 'success');
  };

  const handleQuickDownloadReport = () => {
    const report = generateFullCollegeReportMarkdown(projectInfo);
    downloadFile(report, 'Supermarket_College_Project_Report.md', 'text/markdown;charset=utf-8;');
    showNotification('Downloaded Supermarket_College_Project_Report.md!', 'success');
  };

  // Add POS record
  const handleAddTransaction = (newRecord: SaleRecord) => {
    setData((prev) => [newRecord, ...prev]);
    if (user) {
      saveCustomUserTransaction(user.uid, newRecord);
    }
    showNotification(`Invoice ${newRecord.invoiceId} added successfully!`, 'success');
  };

  // Save Project Info to Firestore
  const handleSaveProjectToCloud = async () => {
    if (!user) {
      showNotification('Please sign in with Google to persist your project to Firebase.', 'warning');
      return;
    }
    setIsSavingProject(true);
    try {
      await saveUserProjectInfo(user.uid, projectInfo);
      showNotification('College project info saved to Firebase Firestore!', 'success');
    } catch (e: any) {
      showNotification(`Save failed: ${e?.message}`, 'warning');
    } finally {
      setIsSavingProject(false);
    }
  };

  // Run AI Insights
  const handleRunAiInsights = async () => {
    setIsGeneratingInsights(true);
    setInsightsModalOpen(true);
    try {
      const totalSales = filteredData.reduce((acc, r) => acc + r.total, 0);
      const totalCogs = filteredData.reduce((acc, r) => acc + r.cogs, 0);
      const grossProfit = totalSales - totalCogs;
      const margin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;
      const aov = filteredData.length > 0 ? totalSales / filteredData.length : 0;
      const avgRating = filteredData.length > 0 ? filteredData.reduce((acc, r) => acc + r.rating, 0) / filteredData.length : 0;

      const insights = await generateProjectInsights({
        totalSales,
        totalCogs,
        grossProfit,
        marginPercent: margin,
        totalInvoices: filteredData.length,
        aov,
        avgRating,
        topBranch: 'Branch A (Yangon)',
        topProductLine: 'Food & Beverages',
      });
      setAiInsights(insights);
    } catch (e: any) {
      setAiInsights(`Failed to generate insights: ${e?.message}`);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-white border border-blue-200 text-blue-900 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenExportModal={() => setExportModalOpen(true)}
        onToggleChat={() => setChatOpen(!chatOpen)}
        chatOpen={chatOpen}
        onRunAiInsights={handleRunAiInsights}
        isGeneratingInsights={isGeneratingInsights}
      />

      <div className="bg-slate-900 text-white border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">System status</p>
              <h3 className="text-sm font-semibold text-slate-100">
                Firebase database: {firebaseStatus.configured ? 'Configured' : 'Not configured'}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 font-medium border ${firebaseStatus.authenticated ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'}`}>
                <span className={`h-2 w-2 rounded-full ${firebaseStatus.authenticated ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {firebaseStatus.authenticated ? 'Signed in' : 'Cloud write-back locked'}
              </span>
              <span className="text-slate-300">{firebaseStatus.statusLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Easy-To-Use Quick Action Toolbar for Students */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-600" />
            <span>Quick College Project Actions:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleQuickDownloadCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold border border-blue-200 transition shadow-2xs"
              title="Download 1,000 row CSV dataset"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
              <span>1. Download Dataset (.CSV)</span>
            </button>

            <button
              onClick={handleQuickDownloadDAX}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold border border-blue-200 transition shadow-2xs"
              title="Download 25+ DAX Formulas"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span>2. DAX Formulas (.DAX)</span>
            </button>

            <button
              onClick={handleQuickDownloadReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold border border-blue-200 transition shadow-2xs"
              title="Download 15-page project report"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>3. Project Report (.MD)</span>
            </button>

            <button
              onClick={() => setActiveTab('college-report')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200 transition"
              title="Open Viva Questions"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
              <span>4. Viva Voce Q&A</span>
            </button>

            <button
              onClick={() => setExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs"
              title="View all 5 files"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>View All Files</span>
            </button>
          </div>
        </div>
      </div>

      {/* Power BI Slicers & Context Bar (Shown for interactive analysis tabs) */}
      {['overview', 'customer-product', 'branch-ops', 'sales-analytics', 'profitability', 'inventory', 'payment-analytics', 'discount-promo', 'advanced-analytics', 'what-if', 'data-grid'].includes(activeTab) && (
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          totalRecords={data.length}
          filteredCount={filteredData.length}
          onReset={handleResetFilters}
        />
      )}

      {/* Main Power BI Canvas Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 overflow-hidden">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <AnimatePresence mode="wait">
            <AnimatedTab key={activeTab}>
              {activeTab === 'overview' && (
                <>
                  <OverviewTab
                    data={filteredData}
                    onSelectProductLine={(prod) => setFilters((prev) => ({ ...prev, productLine: prod }))}
                    onSelectBranch={(b) => setFilters((prev) => ({ ...prev, branch: b }))}
                  />
                  {/* Added Comparison Mode to bottom of Overview Tab for quick access */}
                  <ComparisonMode data={filteredData} />
                </>
              )}

              {activeTab === 'customer-product' && <CustomerProductTab data={filteredData} />}
              {activeTab === 'branch-ops' && <BranchAnalyticsTab data={filteredData} />}
              {activeTab === 'sales-analytics' && <SalesAnalyticsTab data={filteredData} />}
              {activeTab === 'profitability' && <ProfitabilityTab data={filteredData} />}
              {activeTab === 'inventory' && <InventoryTab data={filteredData} />}
              {activeTab === 'payment-analytics' && <PaymentAnalyticsTab data={filteredData} />}
              {activeTab === 'discount-promo' && <DiscountPromotionTab data={filteredData} />}
              {activeTab === 'advanced-analytics' && <AdvancedAnalyticsTab data={filteredData} />}
              {activeTab === 'data-model' && <DataModelTab />}
              {activeTab === 'dax-studio' && <DaxStudioTab />}
              {activeTab === 'what-if' && <WhatIfSimulatorTab data={filteredData} />}
              {activeTab === 'data-grid' && <DataGridTab data={data} onAddTransaction={handleAddTransaction} />}
              {activeTab === 'college-report' && (
                <ProjectReportTab
                  projectInfo={projectInfo}
                  setProjectInfo={setProjectInfo}
                  onSaveToCloud={handleSaveProjectToCloud}
                  isSaving={isSavingProject}
                />
              )}
            </AnimatedTab>
          </AnimatePresence>
        )}
      </main>

      {/* Export Project Files Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        data={data}
        projectInfo={projectInfo}
      />

      {/* Multi-turn AI BI Chatbot Drawer */}
      <ChatDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={messages}
        setMessages={setMessages}
        user={user}
        datasetContext={datasetSummaryText}
      />

      {/* 1-Click AI Insights Modal */}
      {insightsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4 max-h-[85vh] flex flex-col">
            <button
              onClick={() => setInsightsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Gemini Pro Automated Project Evaluation
                </h3>
                <span className="text-xs text-blue-700 font-mono font-medium">
                  Model: gemini-3.1-pro-preview
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
              {isGeneratingInsights ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3 text-slate-500">
                  <Sparkles className="w-8 h-8 text-blue-600 animate-spin" />
                  <span>Synthesizing multi-variable retail performance report...</span>
                </div>
              ) : (
                aiInsights || 'No insights generated.'
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  if (aiInsights) {
                    navigator.clipboard.writeText(aiInsights);
                    showToast('Copied evaluation report to clipboard!');
                  }
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-200"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setInsightsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <NotificationContainer />
    </div>
  );
}
