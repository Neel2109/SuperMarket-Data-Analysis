import { useEffect } from 'react';
import { showNotification } from './Notifications';

const TAB_IDS = [
  'overview', 'customer-product', 'branch-ops', 'sales-analytics',
  'profitability', 'inventory', 'payment-analytics', 'discount-promo',
  'advanced-analytics', 'what-if', 'data-model', 'dax-studio',
  'data-grid', 'college-report',
];

const TAB_LABELS = [
  'Executive Overview', 'Customers & Products', 'Branch & Footfall', 'Sales Analytics',
  'Profitability', 'Inventory', 'Payment Analytics', 'Discount & Promotion',
  'Advanced Analytics', 'What-If Simulator', 'Star Schema Model', 'DAX Measures',
  'Raw Dataset', 'Project Report',
];

interface UseKeyboardShortcutsOptions {
  setActiveTab: (tab: string) => void;
  onResetFilters: () => void;
  onToggleChat: () => void;
}

export function useKeyboardShortcuts({ setActiveTab, onResetFilters, onToggleChat }: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // Number keys 1-9 → switch to tabs 1-9
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 9) {
          e.preventDefault();
          setActiveTab(TAB_IDS[num - 1]);
          showNotification(`Switched to ${TAB_LABELS[num - 1]}`, 'info');
          return;
        }
        // 0 → tab 10
        if (e.key === '0') {
          e.preventDefault();
          setActiveTab(TAB_IDS[9]);
          showNotification(`Switched to ${TAB_LABELS[9]}`, 'info');
          return;
        }
      }

      // Ctrl+F → focus search input
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        const searchInput = document.querySelector('input[aria-label="Search invoices"]') as HTMLInputElement | null;
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
          showNotification('Search focused — type to filter invoices', 'info');
        }
        return;
      }

      // Escape → reset filters
      if (e.key === 'Escape') {
        onResetFilters();
        showNotification('All filters reset', 'success');
        return;
      }

      // Ctrl+/ → toggle AI chat
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        onToggleChat();
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setActiveTab, onResetFilters, onToggleChat]);
}
