// Risk Scoring Engine - CreatorHub
// Basit ama etkili kural tabanlı risk hesaplama

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RiskCalculationInput {
  amount: number;
  followers: number;
  engagementRate: number;
  brandName: string;
  tags: string[];
}

export interface RiskCalculationResult {
  score: number;
  level: RiskLevel;
  factors: string[];
}

export function calculateRiskScore(input: RiskCalculationInput): RiskCalculationResult {
  let score = 0;
  const factors: string[] = [];

  // Rule 1: Amount-based risk (0-30 points)
  if (input.amount > 10000) {
    score += 30;
    factors.push('Yüksek tutar (>$10K)');
  } else if (input.amount > 5000) {
    score += 20;
    factors.push('Orta tutar ($5K-$10K)');
  } else if (input.amount > 2000) {
    score += 10;
    factors.push('Normal tutar ($2K-$5K)');
  } else {
    factors.push('Düşük tutar (<$2K)');
  }

  // Rule 2: Follower/Amount ratio (0-25 points)
  const pricePerFollower = input.amount / input.followers;
  if (pricePerFollower > 0.1) {
    score += 25;
    factors.push('Çok yüksek oran (>$0.10/follower)');
  } else if (pricePerFollower > 0.05) {
    score += 15;
    factors.push('Yüksek oran ($0.05-$0.10/follower)');
  } else if (pricePerFollower < 0.01) {
    score += 5;
    factors.push('Çok düşük oran (<$0.01/follower) - şüpheli');
  } else {
    factors.push('Normal oran ($0.01-$0.05/follower)');
  }

  // Rule 3: Engagement rate (0-20 points)
  if (input.engagementRate < 1.0) {
    score += 20;
    factors.push('Çok düşük engagement (<1%)');
  } else if (input.engagementRate < 2.0) {
    score += 10;
    factors.push('Düşük engagement (1-2%)');
  } else if (input.engagementRate > 10.0) {
    score += 5;
    factors.push('Olağandışı yüksek engagement (>10%) - bot şüphesi');
  } else {
    factors.push('Sağlıklı engagement (2-10%)');
  }

  // Rule 4: Small follower count (0-15 points)
  if (input.followers < 10000) {
    score += 15;
    factors.push('Çok düşük takipçi (<10K)');
  } else if (input.followers < 50000) {
    score += 5;
    factors.push('Mikro influencer (10K-50K)');
  } else {
    factors.push('Yeterli takipçi (>50K)');
  }

  // Rule 5: High-risk categories (0-10 points)
  const highRiskCategories = ['crypto', 'gambling', 'supplements', 'finance'];
  const hasHighRiskTag = input.tags.some(tag =>
    highRiskCategories.some(risk => tag.toLowerCase().includes(risk))
  );
  if (hasHighRiskTag) {
    score += 10;
    factors.push('Yüksek riskli kategori');
  }

  // Rule 6: Unknown/suspicious brands (0-10 points)
  if (input.brandName.length < 3) {
    score += 10;
    factors.push('Bilinmeyen marka');
  }

  // Determine risk level
  let level: RiskLevel;
  if (score <= 30) {
    level = 'LOW';
  } else if (score <= 60) {
    level = 'MEDIUM';
  } else {
    level = 'HIGH';
  }

  return {
    score: Math.min(score, 100), // Cap at 100
    level,
    factors,
  };
}

