// Audit Log Helper Functions

import { prisma } from './prisma';
import { AuditAction } from '@prisma/client';

export async function createAuditLog(
  itemId: string,
  userId: string,
  action: AuditAction,
  changes: Record<string, unknown>,
  oldValue?: unknown,
  newValue?: unknown
) {
  return await prisma.auditLog.create({
    data: {
      itemId,
      userId,
      action,
      changes: JSON.stringify(changes),
      oldValue: oldValue ? JSON.stringify(oldValue) : null,
      newValue: newValue ? JSON.stringify(newValue) : null,
    },
  });
}

export async function getAuditLogs(itemId: string) {
  const logs = await prisma.auditLog.findMany({
    where: { itemId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return logs.map(log => ({
    ...log,
    changes: JSON.parse(log.changes),
    oldValue: log.oldValue ? JSON.parse(log.oldValue) : null,
    newValue: log.newValue ? JSON.parse(log.newValue) : null,
  }));
}

