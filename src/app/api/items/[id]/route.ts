// Items API - Get, Update, Delete by ID
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit';
import { z } from 'zod';

const updateItemSchema = z.object({
  status: z.enum(['NEW', 'IN_REVIEW', 'APPROVED', 'REJECTED']).optional(),
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  amount: z.number().positive().optional(),
});

// GET /api/items/[id]
export async function GET(
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

    if (!item) {
      return NextResponse.json({ error: 'Item bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error('GET /api/items/[id] error:', error);
    return NextResponse.json(
      { error: 'Item alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

// PATCH /api/items/[id] - Update item
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateItemSchema.parse(body);

    // Get old item for audit
    const oldItem = await prisma.item.findUnique({
      where: { id },
    });

    if (!oldItem) {
      return NextResponse.json({ error: 'Item bulunamadı' }, { status: 404 });
    }

    const item = await prisma.item.update({
      where: { id },
      data: validatedData,
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
    const action = validatedData.status ? 'STATUS_CHANGED' : 'UPDATED';
    await createAuditLog(
      item.id,
      (session.user as { id: string }).id,
      action,
      validatedData,
      oldItem,
      item
    );

    return NextResponse.json({ item });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    console.error('PATCH /api/items/[id] error:', error);
    return NextResponse.json(
      { error: 'Item güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

