// Risk Score Calculation API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { calculateRiskScore } from '@/lib/risk-engine';
import { createAuditLog } from '@/lib/audit';

// POST /api/score/[id] - Calculate and update risk score
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item bulunamadı' }, { status: 404 });
    }

    // Calculate risk score
    const riskResult = calculateRiskScore({
      amount: item.amount,
      followers: item.followers,
      engagementRate: item.engagementRate,
      storyEngagementRate: item.storyEngagementRate,
      avgLikes: item.avgLikes,
      brandName: item.brandName,
    });

    // Update item with risk score
    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        riskScore: riskResult.score,
        riskLevel: riskResult.level,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create audit log
    await createAuditLog(
      updatedItem.id,
      (session.user as { id: string }).id,
      'SCORE_CALCULATED',
      {
        score: riskResult.score,
        level: riskResult.level,
        factors: riskResult.factors,
      }
    );

    return NextResponse.json({
      item: updatedItem,
      riskResult,
    });
  } catch (error) {
    console.error('POST /api/score/[id] error:', error);
    return NextResponse.json(
      { error: 'Risk skoru hesaplanırken hata oluştu' },
      { status: 500 }
    );
  }
}

