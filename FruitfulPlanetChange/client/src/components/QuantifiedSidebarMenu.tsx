import React, { useEffect, useState } from 'react';

interface SidebarItem {
  id: string;
  label: string;
  description: string;
  metadata: string;
  route: string;
  category: string;
  icon: string;
  active: boolean;
  dataSource: string;
}

interface SidebarResponse {
  timestamp: string;
  totalItems: number;
  categories: string[];
  items: SidebarItem[];
}

interface FrontendSummary {
  uiData: {
    sectors: number;
    brands: number;
    coreElements: number;
    subnodes: number;
    totalElements: number;
    systemStatus: number;
  };
  canonicalValues: {
    totalElementsDisplay: string;
    brandsDisplay: string;
    sectorsDisplay: string;
    coreElementsDisplay: string;
    subnodesDisplay: string;
  };
  renderingInfo: {
    lastQueried: string;
    responseTime: string;
    dataFreshness: string;
    renderReady: boolean;
  };
}

const QuantifiedSidebarMenu = () => {
  const [sidebarData, setSidebarData] = useState<SidebarResponse | null>(null);
  const [summary, setSummary] = useState<FrontendSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch sidebar items and frontend summary in parallel
        const [sidebarRes, summaryRes] = await Promise.all([
          fetch('/api/sidebar/items'),
          fetch('/api/frontend/summary')
        ]);

        if (!sidebarRes.ok || !summaryRes.ok) {
          throw new Error('Failed to fetch sidebar data');
        }

        const sidebarJson = await sidebarRes.json();
        const summaryJson = await summaryRes.json();

        setSidebarData(sidebarJson);
        setSummary(summaryJson);
        setError(null);
      } catch (err) {
        console.error('QuantifiedSidebarMenu fetch error:', err);
        setError('Failed to load sidebar menu data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Auto-refresh every 5 seconds for live data
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getEnhancedMetadata = (item: SidebarItem): string => {
    if (!summary) return item.metadata || '...';
    
    // Map sidebar items to canonical frontend summary data
    switch (item.id) {
      case 'home':
        return `${summary.canonicalValues.totalElementsDisplay} Elements`;
      case 'sectors':
        return `${summary.canonicalValues.sectorsDisplay} Total (45 Public)`;
      case 'seedwave-admin':
        return `${summary.canonicalValues.brandsDisplay} Brands`;
      case 'sector-mapping':
        return `${summary.canonicalValues.coreElementsDisplay} Core Brands`;
      case 'system-status':
        return `${summary.uiData.systemStatus} Services`;
      case 'vaultmesh-products':
        return 'Product Inventory';
      case 'omnilevel':
        return 'Interstellar Ops';
      case 'planet-change':
        return 'Ecosystem Control';
      case 'sector-onboarding':
        return 'Integration Pipeline';
      case 'legal-documents':
        return item.metadata || 'Legal Portal';
      default:
        return item.metadata || 'Active';
    }
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      primary: '🎯',
      admin: '⚙️',
      visualization: '📊',
      products: '📦',
      operations: '🚀',
      ecosystem: '🌍',
      onboarding: '📋',
      monitoring: '🔍',
      legal: '📄'
    };
    return icons[category] || '🔹';
  };

  if (loading) {
    return (
      <div className="p-6 bg-white shadow-md rounded-xl border border-gray-200">
        <h2 className="text-lg font-bold mb-3">🔍 Quantified Sidebar Menu</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 shadow-md rounded-xl border border-red-200">
        <h2 className="text-lg font-bold mb-3 text-red-700">🚨 Sidebar Menu Error</h2>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!sidebarData) {
    return (
      <div className="p-6 bg-gray-50 shadow-md rounded-xl border border-gray-200">
        <h2 className="text-lg font-bold mb-3">🔍 Quantified Sidebar Menu</h2>
        <p className="text-gray-600 text-sm">No sidebar data available</p>
      </div>
    );
  }

  // Group items by category
  const itemsByCategory = sidebarData.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SidebarItem[]>);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">🔍 Quantified Sidebar Menu</h2>
        <div className="text-xs text-gray-500">
          {sidebarData.totalItems} items • {summary?.renderingInfo.dataFreshness || 'live'}
        </div>
      </div>

      {/* Sector Reconciliation Alert */}
      <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
          🔍 <strong>Sector Sync Reconciliation:</strong> 48 Canonical (database) vs 45 Displayable (UI filtered)
        </p>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="text-xs font-semibold text-blue-700 mb-1">🌍 Global System Overview</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div><strong>Elements:</strong> {summary.canonicalValues.totalElementsDisplay}</div>
            <div><strong>Sectors:</strong> {summary.canonicalValues.sectorsDisplay} Total</div>
            <div><strong>Brands:</strong> {summary.canonicalValues.brandsDisplay}</div>
            <div><strong>Core:</strong> {summary.canonicalValues.coreElementsDisplay}</div>
          </div>
        </div>
      )}

      {/* Categorized Sidebar Items */}
      <div className="space-y-4">
        {Object.entries(itemsByCategory).map(([category, items]) => (
          <div key={category} className="border-l-4 border-blue-200 pl-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 capitalize flex items-center gap-1">
              {getCategoryIcon(category)} {category} ({items.length})
            </h3>
            <ul className="space-y-2">
              {items.map(item => (
                <li key={item.id} className="flex justify-between items-start py-1">
                  <div className="flex-1 min-w-0">
                    <a 
                      href={item.route} 
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm transition-colors duration-200 flex items-center gap-1"
                      data-testid={`sidebar-link-${item.id}`}
                    >
                      <span className="text-xs">{item.icon}</span>
                      {item.label}
                    </a>
                    <div className="text-xs text-gray-500 mt-0.5 truncate">
                      {item.description}
                    </div>
                  </div>
                  <span 
                    className="text-xs font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded-full ml-2 whitespace-nowrap"
                    data-testid={`sidebar-metadata-${item.id}`}
                  >
                    {getEnhancedMetadata(item)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Data Freshness Info */}
      {summary && (
        <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex justify-between items-center">
            <span>Last updated: {new Date(summary.renderingInfo.lastQueried).toLocaleTimeString()}</span>
            <span>Response: {summary.renderingInfo.responseTime}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantifiedSidebarMenu;