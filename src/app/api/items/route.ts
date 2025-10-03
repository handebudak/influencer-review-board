// Items API - Create & List with Filters
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit';
import { z } from 'zod';

// Validation Schema
const createItemSchema = z.object({
  title: z.string().min(3, 'Başlık en az 3 karakter olmalı'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalı'),
  amount: z.number().positive('Tutar pozitif olmalı'),
  influencerName: z.string().min(2, 'Influencer adı gerekli'),
  influencerHandle: z.string().min(2, 'Influencer handle gerekli'),
  followers: z.number().int().positive('Takipçi sayısı pozitif olmalı'),
  engagementRate: z.number().min(0).max(100, 'Engagement rate 0-100 arası olmalı'),
  brandName: z.string().min(2, 'Marka adı gerekli'),
  tags: z.array(z.string()).default([]),
});

// GET /api/items - List items with filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const riskLevel = searchParams.get('riskLevel');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (riskLevel) where.riskLevel = riskLevel;
    if (tag) where.tags = { has: tag };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { influencerName: { contains: search, mode: 'insensitive' } },
        { brandName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.item.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('GET /api/items error:', error);
    return NextResponse.json(
      { error: 'Items alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/items - Create new item
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createItemSchema.parse(body);

    const item = await prisma.item.create({
      data: {
        ...validatedData,
        createdById: (session.user as { id: string }).id,
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
      item.id,
      (session.user as { id: string }).id,
      'CREATED',
      { item: validatedData }
    );

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('POST /api/items error:', error);
    return NextResponse.json(
      { error: 'Item oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}

