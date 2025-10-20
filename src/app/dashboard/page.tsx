'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import CustomSelect from '@/components/CustomSelect';
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">Dashboard</h1>
          <p className="text-zinc-600 mt-2 text-lg">Brand Deal Review Panel</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-zinc-600 text-white rounded-xl hover:bg-zinc-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            <span className="text-sm font-medium">Export Data</span>
          </button>
          <button className="px-4 py-2 bg-zinc-200 text-zinc-800 rounded-xl hover:bg-zinc-300 transition-all duration-200 border border-zinc-300">
            <span className="text-sm font-medium">Filter</span>
          </button>
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
          <div className="bg-zinc-100 rounded-2xl border border-zinc-300 shadow-lg overflow-hidden">
            {/* Toolbar - Filters & Actions */}
            <div className="px-6 py-6 border-b border-zinc-300 bg-zinc-200">
                     {/* Title Row */}
                     <div className="flex items-center justify-between mb-4">
                       <h2 className="text-xl font-bold text-zinc-900">
                         Applications
                         {(filters.status || filters.riskLevel || filters.search) && (
                           <span className="ml-2 text-sm font-normal text-zinc-500">({filteredItems.length})</span>
                         )}
                       </h2>
                     </div>

              {/* Filters Row - Responsive */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                <div className="flex flex-wrap gap-3 flex-1">
                       <CustomSelect
                         value={filters.status}
                         onChange={(value) => setFilters({ ...filters, status: value })}
                         options={[
                           { value: '', label: 'All Statuses' },
                           { value: 'NEW', label: 'New' },
                           { value: 'IN_REVIEW', label: 'In Review' },
                           { value: 'APPROVED', label: 'Approved' },
                           { value: 'REJECTED', label: 'Rejected' }
                         ]}
                         className="flex-1 sm:flex-none sm:w-36"
                       />

                       <CustomSelect
                         value={filters.riskLevel}
                         onChange={(value) => setFilters({ ...filters, riskLevel: value })}
                         options={[
                           { value: '', label: 'All Risks' },
                           { value: 'LOW', label: 'Low' },
                           { value: 'MEDIUM', label: 'Medium' },
                           { value: 'HIGH', label: 'High' }
                         ]}
                         className="flex-1 sm:flex-none sm:w-32"
                       />

                       {(filters.status || filters.riskLevel || filters.search) && (
                         <button
                           onClick={() => setFilters({ status: '', riskLevel: '', search: '' })}
                           className="px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
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
                         placeholder="Search applications..."
                         className="w-full sm:w-72 px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 transition-all duration-200 placeholder:text-zinc-400 text-zinc-900"
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
              <table className="w-full table-fixed">
                <thead className="bg-zinc-200 border-b border-zinc-300">
                  <tr>
                    <th className="text-left px-4 py-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider w-[25%] sm:w-[22%]">
                      Influencer
                    </th>
                       <th className="text-left px-4 py-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider hidden md:table-cell w-[20%]">
                         Application
                       </th>
                       <th className="text-left px-4 py-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider hidden lg:table-cell w-[15%]">
                         Brand
                       </th>
                       <th className="text-right px-4 py-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider w-[15%] sm:w-[12%]">
                         Amount
                       </th>
                       <th className="text-left px-4 py-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider hidden sm:table-cell w-[15%]">
                         Date
                       </th>
                       <th className="text-left px-4 py-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider w-[18%] sm:w-[16%]">
                         Status
                       </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-300">
                 {filteredItems.map((item) => {
                   const statusConfig: Record<ItemStatus, { dot: string; text: string; label: string }> = {
                     NEW: { dot: 'bg-zinc-400', text: 'text-zinc-600', label: 'New' },
                     IN_REVIEW: { dot: 'bg-zinc-500', text: 'text-zinc-700', label: 'In Review' },
                     APPROVED: { dot: 'bg-zinc-600', text: 'text-zinc-800', label: 'Approved' },
                     REJECTED: { dot: 'bg-zinc-700', text: 'text-zinc-900', label: 'Rejected' },
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
                      className="hover:bg-zinc-200 cursor-pointer transition-colors"
                    >
                      {/* Influencer with Avatar */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-white text-sm font-semibold">{initials}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-zinc-900 truncate">{item.influencerName}</div>
                            <div className="text-xs text-zinc-500 truncate">{item.influencerHandle}</div>
                          </div>
                        </div>
                      </td>

                      {/* Başvuru */}
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="text-sm font-medium text-zinc-900 truncate">{item.title}</div>
                      </td>

                      {/* Marka */}
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="text-sm text-zinc-600 truncate">{item.brandName}</div>
                      </td>

                      {/* Tutar */}
                      <td className="px-4 py-4 text-right">
                        <div className="text-sm font-bold text-zinc-900">
                          ${item.amount >= 1000 ? `${(item.amount / 1000).toFixed(1)}K` : item.amount}
                        </div>
                      </td>

                      {/* Tarih */}
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <div className="text-sm text-zinc-500 truncate">{timeAgo}</div>
                      </td>

                      {/* Durum - Dot + Text */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
                          <span className={`text-sm font-medium ${status.text} whitespace-nowrap`}>{status.label}</span>
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


