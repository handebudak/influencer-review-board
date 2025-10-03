// TypeScript Types ve Interfaces

import { ItemStatus, UserRole, AuditAction } from '@prisma/client';
import { RiskLevel } from '@/lib/risk-engine';

export type { ItemStatus, UserRole, AuditAction };
export type { RiskLevel };

export interface Item {
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
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

export interface CreateItemInput {
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
}

export interface ItemFilter {
  status?: ItemStatus;
  riskLevel?: RiskLevel;
  search?: string;
}

export interface RiskRule {
  id: string;
  name: string;
  description: string;
  condition: Record<string, unknown>; // JSON parsed
  scoreImpact: number;
  isActive: boolean;
  priority: number;
}

export interface AuditLogEntry {
  id: string;
  itemId: string;
  userId: string;
  action: AuditAction;
  changes: Record<string, unknown>; // JSON parsed
  oldValue: string | null;
  newValue: string | null;
  createdAt: Date;
}

