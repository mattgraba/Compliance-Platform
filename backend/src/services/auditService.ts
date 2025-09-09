// Audit Service

import prisma from "../lib/prisma";

export async function writeAudit({
  tenantId,
  actorId,
  action,
  entityType,
  entityId,
  result,
  ipAddress,
  userAgent,
  beforeRef,
  afterRef,
}: {
  tenantId: number;
  actorId: number;
  action: string;
  entityType: string;
  entityId: string;
  result: "success" | "deny" | "error";
  ipAddress?: string;
  userAgent?: string;
  beforeRef?: string;
  afterRef?: string;
}) {
  await prisma.auditLog.create({
    data: {
      tenantId,
      actorId,
      action,
      entityType,
      entityId,
      result,
      ipAddress,
      userAgent,
      beforeRef,
      afterRef,
    },
  });
}
