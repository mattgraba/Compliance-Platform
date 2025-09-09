// Tenant Guard

import { Request, Response, NextFunction } from "express";

export function tenantGuard(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user?.tenantId) {
    return res.status(403).json({ error: "Tenant context missing" });
  }
  res.locals.tenantId = user.tenantId;
  next();
}
