'use client';

import Link from 'next/link';
import type { ItemStatus, RiskLevel } from '@/types';

interface ItemCardProps {
  item: {
    id: string;
    title: string;
    description: string;
    amount: number;
    influencerName: string;
    influencerHandle: string;
    followers: number;
    engagementRate: number;
    brandName: string;
    tags: string[];
    status: ItemStatus;
    riskScore: number | null;
    riskLevel: RiskLevel | null;
    createdAt: string;
  };
  onUpdate: () => void;
}

export default function ItemCard({ item }: ItemCardProps) {
  const statusLabels: Record<ItemStatus, string> = {
    NEW: 'Yeni',
    IN_REVIEW: 'İnceleniyor',
    APPROVED: 'Onaylandı',
    REJECTED: 'Reddedildi',
  };

  const riskLabels: Record<RiskLevel, string> = {
    LOW: 'Düşük',
    MEDIUM: 'Orta',
    HIGH: 'Yüksek',
  };

  const getBorderColor = () => {
    switch (item.status) {
      case 'NEW': return 'border-l-[#6B7280]'; // Gri - Yeni
      case 'IN_REVIEW': return 'border-l-[#6B7280]'; // Gri - İnceleniyor
      case 'APPROVED': return 'border-l-[#10B981]'; // Yeşil - Onaylandı
      case 'REJECTED': return 'border-l-[#EF4444]'; // Kırmızı - Reddedildi
    }
  };

  const getRiskDotColor = () => {
    // Nokta rengi, kartın status'üne göre aynı renk
    switch (item.status) {
      case 'NEW': return 'bg-[#6B7280]'; // Gri
      case 'IN_REVIEW': return 'bg-[#6B7280]'; // Gri
      case 'APPROVED': return 'bg-[#10B981]'; // Yeşil
      case 'REJECTED': return 'bg-[#EF4444]'; // Kırmızı
      default: return 'bg-[#6B7280]';
    }
  };

  const getStatusBadgeColor = () => {
    switch (item.status) {
      case 'NEW': return 'bg-gray-100 text-gray-700';
      case 'IN_REVIEW': return 'bg-gray-100 text-gray-700';
      case 'APPROVED': return 'bg-green-50 text-green-700';
      case 'REJECTED': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Link
      href={`/dashboard/items/${item.id}`}
      className={`block bg-white rounded-xl border ${getBorderColor()} border-l-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6 group relative`}
    >
      {/* Status Badge - Üst Sol */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${getStatusBadgeColor()}`}>
          {statusLabels[item.status]}
        </span>
      </div>

      {/* Title - Sade ve Klasik */}
      <h3 className="text-base font-semibold text-gray-900 mb-2 leading-snug">
        {item.title}
      </h3>

      {/* Influencer Name - Subtle */}
      <p className="text-sm text-gray-500 mb-6">
        {item.influencerName} <span className="text-gray-400">• {item.brandName}</span>
      </p>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-4"></div>

      {/* Bottom Section - Fiyat */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Deal Value</div>
        <div className="text-lg font-bold text-gray-900">
          ${item.amount >= 1000 ? `${(item.amount / 1000).toFixed(1)}K` : item.amount}
        </div>
      </div>
    </Link>
  );
}

