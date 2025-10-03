'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { ItemStatus, RiskLevel, AuditAction } from '@/types';

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
  updatedAt: string;
  createdBy: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface AuditLog {
  id: string;
  action: AuditAction;
  changes: Record<string, unknown>;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

export default function ItemDetailPage() {
  const params = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchItem();
    }
  }, [params.id, fetchItem]);

  const fetchItem = useCallback(async () => {
    try {
      const response = await fetch(`/api/items/${params.id}`);
      const data = await response.json();
      setItem(data.item);
      // TODO: Fetch audit logs
    } catch (error) {
      console.error('Error loading item:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const updateStatus = async (newStatus: ItemStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/items/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchItem();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const calculateRisk = async () => {
    setUpdating(true);
    try {
      await fetch(`/api/score/${params.id}`, { method: 'POST' });
      fetchItem();
    } catch (error) {
      console.error('Error calculating risk:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  const statusColors: Record<ItemStatus, string> = {
    NEW: 'bg-gray-100 text-gray-700',
    IN_REVIEW: 'bg-gray-100 text-gray-700',
    APPROVED: 'bg-green-50 text-green-700',
    REJECTED: 'bg-red-50 text-red-700',
  };

  const riskColors = {
    LOW: 'bg-[#A1E3CB]',
    MEDIUM: 'bg-[#FFE5B4]',
    HIGH: 'bg-[#EF4444]',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4 sm:px-6">
      <div>
        <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 text-sm font-medium flex items-center gap-1">
          ← Back
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{item.title}</h1>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[item.status]}`}>
              {item.status}
            </span>
          </div>
          {item.riskLevel && (
            <div className="text-left sm:text-right">
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">Risk Score</div>
              <div className="flex sm:justify-end items-center gap-3">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${riskColors[item.riskLevel]} flex items-center justify-center text-gray-900 text-lg sm:text-xl font-black shadow-sm`}>
                  {item.riskScore}
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  {item.riskLevel === 'LOW' && 'Low Risk'}
                  {item.riskLevel === 'MEDIUM' && 'Medium Risk'}
                  {item.riskLevel === 'HIGH' && 'High Risk'}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Influencer Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900">{item.influencerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Handle:</span>
                <span className="font-medium text-gray-900">{item.influencerHandle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Followers:</span>
                <span className="font-medium text-gray-900">{item.followers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Engagement Rate:</span>
                <span className="font-medium text-gray-900">{item.engagementRate}%</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Deal Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Brand:</span>
                <span className="font-medium text-gray-900">{item.brandName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-gray-900 text-base">${item.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created by:</span>
                <span className="font-medium text-gray-900">{item.createdBy.name || item.createdBy.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium text-gray-900">
                  {new Date(item.createdAt).toLocaleDateString('en-US')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
          <p className="text-gray-700">{item.description}</p>
        </div>


        <div className="border-t border-gray-100 pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Actions</h3>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            {!item.riskScore && (
              <button
                onClick={calculateRisk}
                disabled={updating}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
              >
                Calculate Risk Score
              </button>
            )}
            
            {item.status === 'NEW' && (
              <button
                onClick={() => updateStatus('IN_REVIEW')}
                disabled={updating}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
              >
                Start Review
              </button>
            )}

            {item.status === 'IN_REVIEW' && (
              <>
                <button
                  onClick={() => updateStatus('APPROVED')}
                  disabled={updating}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus('REJECTED')}
                  disabled={updating}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                >
                  Reject
                </button>
              </>
            )}

            {(item.status === 'APPROVED' || item.status === 'REJECTED') && (
              <button
                onClick={() => updateStatus('IN_REVIEW')}
                disabled={updating}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
              >
                Review Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

