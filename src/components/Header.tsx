import React from 'react';
import {
  BarChart3,
  Download,
  Bot,
  LogIn,
  LogOut,
  User as UserIcon,
  Sparkles,
  FileSpreadsheet,
  GraduationCap,
  Layers,
  Code2,
  Sliders,
  Database,
  Store,
  TrendingUp,
  Warehouse,
  CreditCard,
  Percent,
  Palette
} from 'lucide-react';
import { User } from 'firebase/auth';
import { useTheme } from './ThemeContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenExportModal: () => void;
  onToggleChat: () => void;
  chatOpen: boolean;
  onRunAiInsights: () => void;
  isGeneratingInsights: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLogin,
  onLogout,
  onOpenExportModal,
  onToggleChat,
  chatOpen,
  onRunAiInsights,
  isGeneratingInsights,
}) => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = () => {
    if (theme === 'light') setTheme('dark-magenta');
    else if (theme === 'dark-magenta') setTheme('dark-blue');
    else setTheme('light');
  };

  const tabs = [
    { id: 'overview', label: '1. Executive Overview', icon: BarChart3 },
    { id: 'customer-product', label: '2. Customers & Products', icon: Store },
    { id: 'branch-ops', label: '3. Branch & Footfall', icon: Layers },
    { id: 'sales-analytics', label: '4. Sales Analytics', icon: BarChart3 },
    { id: 'profitability', label: '5. Profitability', icon: TrendingUp },
    { id: 'inventory', label: '6. Inventory', icon: Warehouse },
    { id: 'payment-analytics', label: '7. Payment Analytics', icon: CreditCard },
    { id: 'discount-promo', label: '8. Discount & Promotion', icon: Percent },
    { id: 'advanced-analytics', label: '9. Advanced Analytics', icon: Sparkles },
    { id: 'what-if', label: '10. What-If Simulator', icon: Sliders },
    { id: 'data-model', label: '11. Star Schema Model', icon: Database },
    { id: 'dax-studio', label: '12. DAX Measures', icon: Code2 },
    { id: 'data-grid', label: '13. Raw Dataset', icon: FileSpreadsheet },
    { id: 'college-report', label: '14. Project Report & Viva', icon: GraduationCap },
  ];

  return (
    <header className="bg-white border-b border-slate-200 text-slate-800 sticky top-0 z-40 shadow-sm">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold shadow-sm">
              <span className="text-xl tracking-tight">BI</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                  Supermarket Sales Analytics
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                  Power BI Project
                </span>
                <span className="hidden md:inline-flex px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                  College Capstone
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Simple & Complete College Submission Package • 1,000 POS Rows • Star Schema • Viva Voce
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeChange}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Toggle Theme"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Quick 1-Click AI Analysis */}
            <button
              onClick={onRunAiInsights}
              disabled={isGeneratingInsights}
              className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-semibold text-blue-700 transition shadow-sm disabled:opacity-50"
              title="Generate summary review with Gemini Pro"
            >
              <Sparkles className={`w-3.5 h-3.5 text-blue-600 ${isGeneratingInsights ? 'animate-spin' : ''}`} />
              <span>{isGeneratingInsights ? 'Analyzing...' : 'AI Insights'}</span>
            </button>

            {/* Prominent Download Project Files Button */}
            <button
              onClick={onOpenExportModal}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Project Files</span>
            </button>

            {/* AI Assistant Chatbot Toggle */}
            <button
              onClick={onToggleChat}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                chatOpen
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
              }`}
            >
              <Bot className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Ask AI Copilot</span>
            </button>

            {/* Google Authentication */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-full border border-blue-200"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <div className="hidden xl:block text-left text-xs">
                  <div className="font-semibold text-slate-800 truncate max-w-[100px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">Logged In</div>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition"
              >
                <LogIn className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="bg-slate-50/80 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto py-1.5 scrollbar-thin">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition font-medium ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
