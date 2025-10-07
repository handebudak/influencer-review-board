'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import type { ItemStatus, RiskLevel } from '@/types';

interface Item {
  id: string;
  title: string;
  description: string;
  amount: number;
  influencerName: string;
  influencerHandle: string;
  followers: number;
  engagementRate: number;
  storyEngagementRate: number;
  avgLikes: number;
  brandName: string;
  status: ItemStatus;
  riskScore: number | null;
  riskLevel: RiskLevel | null;
  createdAt: string;
}

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    riskLevel: '',
    search: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const filtered = items.filter((item) => {
      const matchesSearch = !filters.search || 
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.influencerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.brandName.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = !filters.status || item.status === filters.status;
      const matchesRisk = !filters.riskLevel || item.riskLevel === filters.riskLevel;

      return matchesSearch && matchesStatus && matchesRisk;
    });

    setFilteredItems(filtered);
  }, [items, filters]);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items');
      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      console.error('Items yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  // Calculate stats - safe with fallback
  const totalDeals = items?.length || 0;
  const newDeals = items?.filter((item) => item.status === 'NEW').length || 0;
  const approvedDeals = items?.filter((item) => item.status === 'APPROVED').length || 0;
  const highRiskDeals = items?.filter((item) => item.riskLevel === 'HIGH').length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Brand Deal Review Panel</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Applications"
          value={totalDeals}
          color="lightBlue"
        />
        <StatCard
          title="New Applications"
          value={newDeals}
          color="lavender"
        />
        <StatCard
          title="Approved"
          value={approvedDeals}
          color="mint"
        />
        <StatCard
          title="High Risk"
          value={highRiskDeals}
          color="skyBlue"
        />
      </div>

      {/* Items List with Integrated Filters */}
      <div>
        {filteredItems.length === 0 && !filters.status && !filters.riskLevel && !filters.search ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg mb-2">No applications yet</p>
            <p className="text-gray-400 text-sm">Demo applications will be loaded from the database</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Toolbar - Filters & Actions */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-slate-50">
                     {/* Title Row */}
                     <div className="flex items-center justify-between mb-3">
                       <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                         Applications
                         {(filters.status || filters.riskLevel || filters.search) && (
                           <span className="ml-2 text-sm font-normal text-gray-500">({filteredItems.length})</span>
                         )}
                       </h2>
                     </div>

              {/* Filters Row - Responsive */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                <div className="flex flex-wrap gap-2 flex-1">
                       <select
                         value={filters.status}
                         onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                         className="flex-1 sm:flex-none sm:w-32 px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:outline-none transition-colors"
                       >
                         <option value="">All Statuses</option>
                         <option value="NEW">New</option>
                         <option value="IN_REVIEW">In Review</option>
                         <option value="APPROVED">Approved</option>
                         <option value="REJECTED">Rejected</option>
                       </select>

                       <select
                         value={filters.riskLevel}
                         onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                         className="flex-1 sm:flex-none sm:w-28 px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:outline-none transition-colors"
                       >
                         <option value="">All Risks</option>
                         <option value="LOW">Low</option>
                         <option value="MEDIUM">Medium</option>
                         <option value="HIGH">High</option>
                       </select>


                       {(filters.status || filters.riskLevel || filters.search) && (
                         <button
                           onClick={() => setFilters({ status: '', riskLevel: '', search: '' })}
                           className="px-3 py-2 text-xs font-medium rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-white"
                           title="Clear Filters"
                         >
                           Clear
                         </button>
                       )}
                </div>

                       {/* Search */}
                       <input
                         type="text"
                         value={filters.search}
                         onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                         placeholder="Search..."
                         className="w-full sm:w-64 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:outline-none transition-colors placeholder:text-gray-400"
                       />
              </div>
            </div>

            {/* Table */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No applications match your filters</p>
                <button
                  onClick={() => setFilters({ status: '', riskLevel: '', search: '' })}
                  className="mt-3 text-sm text-slate-600 hover:text-slate-900 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-1.5 sm:px-4 py-1.5 sm:py-3 text-[9px] sm:text-xs font-medium text-gray-500 uppercase tracking-tight sm:tracking-wider">
                      Influencer
                    </th>
                       <th className="text-left px-1 sm:px-2 py-1.5 sm:py-3 text-[9px] sm:text-xs font-medium text-gray-500 uppercase tracking-tight sm:tracking-wider hidden md:table-cell">
                         App
                       </th>
                       <th className="text-left px-1 sm:px-2 py-1.5 sm:py-3 text-[9px] sm:text-xs font-medium text-gray-500 uppercase tracking-tight sm:tracking-wider hidden lg:table-cell">
                         Brand
                       </th>
                       <th className="text-right px-1.5 sm:px-4 py-1.5 sm:py-3 text-[9px] sm:text-xs font-medium text-gray-500 uppercase tracking-tight sm:tracking-wider">
                         Amount
                       </th>
                       <th className="text-left px-1.5 sm:px-4 py-1.5 sm:py-3 text-[9px] sm:text-xs font-medium text-gray-500 uppercase tracking-tight sm:tracking-wider hidden sm:table-cell">
                         Date
                       </th>
                       <th className="text-left px-1.5 sm:px-6 py-1.5 sm:py-3 text-[9px] sm:text-xs font-medium text-gray-500 uppercase tracking-tight sm:tracking-wider">
                         Status
                       </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                 {filteredItems.map((item) => {
                   const statusConfig: Record<ItemStatus, { dot: string; text: string; label: string }> = {
                     NEW: { dot: 'bg-gray-400', text: 'text-gray-600', label: 'New' },
                     IN_REVIEW: { dot: 'bg-sky-400', text: 'text-sky-600', label: 'In Review' },
                     APPROVED: { dot: 'bg-emerald-400', text: 'text-emerald-600', label: 'Approved' },
                     REJECTED: { dot: 'bg-rose-400', text: 'text-rose-600', label: 'Rejected' },
                   };

                  const status = statusConfig[item.status];
                  const createdDate = new Date(item.createdAt);
                  const now = new Date();
                  const diffMs = now.getTime() - createdDate.getTime();
                  const diffMins = Math.floor(diffMs / 60000);
                  const diffHours = Math.floor(diffMs / 3600000);
                  const diffDays = Math.floor(diffMs / 86400000);

                   let timeAgo = '';
                   if (diffMins < 1) timeAgo = 'Just now';
                   else if (diffMins < 60) timeAgo = `${diffMins} min ago`;
                   else if (diffHours < 24) timeAgo = `${diffHours} hours ago`;
                   else if (diffDays === 1) timeAgo = 'Yesterday';
                   else if (diffDays < 7) timeAgo = `${diffDays} days ago`;
                   else timeAgo = createdDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

                  // Generate initials for avatar
                  const initials = item.influencerName
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2);

                  return (
                    <tr 
                      key={item.id}
                      onClick={() => window.location.href = `/dashboard/items/${item.id}`}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      {/* Influencer with Avatar */}
                      <td className="px-1.5 sm:px-4 py-1.5 sm:py-3">
                        <div className="flex items-center gap-1 sm:gap-3">
                          <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[9px] sm:text-xs font-semibold">{initials}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] sm:text-sm font-medium text-gray-900 truncate">{item.influencerName}</div>
                            <div className="text-[9px] sm:text-xs text-gray-500 truncate hidden sm:block">{item.influencerHandle}</div>
                          </div>
                        </div>
                      </td>

                      {/* Başvuru */}
                      <td className="px-1 sm:px-2 py-1.5 sm:py-3 hidden md:table-cell">
                        <div className="text-[10px] sm:text-sm text-gray-900 dark:text-gray-100 font-medium truncate max-w-[120px] sm:max-w-xs">{item.title}</div>
                      </td>

                      {/* Marka */}
                      <td className="px-1 sm:px-2 py-1.5 sm:py-3 hidden lg:table-cell">
                        <div className="text-[10px] sm:text-sm text-gray-700 dark:text-gray-300 truncate">{item.brandName}</div>
                      </td>

                      {/* Tutar */}
                      <td className="px-1.5 sm:px-4 py-1.5 sm:py-3 text-right">
                        <div className="text-[10px] sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                          ${item.amount >= 1000 ? `${(item.amount / 1000).toFixed(1)}K` : item.amount}
                        </div>
                      </td>

                      {/* Tarih */}
                      <td className="px-1.5 sm:px-4 py-1.5 sm:py-3 hidden sm:table-cell">
                        <div className="text-[9px] sm:text-sm text-gray-600 dark:text-gray-400 truncate">{timeAgo}</div>
                      </td>

                      {/* Durum - Dot + Text */}
                      <td className="px-1.5 sm:px-6 py-1.5 sm:py-3">
                        <div className="flex items-center gap-0.5 sm:gap-2">
                          <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${status.dot}`}></span>
                          <span className={`text-[9px] sm:text-sm font-medium ${status.text} whitespace-nowrap`}>{status.label}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


