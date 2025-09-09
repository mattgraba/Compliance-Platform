// Error Handler

import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const requestId = crypto.randomUUID();
  const status =
    err instanceof ZodError ? 400 :
    err.name === "AuthError" ? 401 :
    err.name === "ForbiddenError" ? 403 : 500;

  console.error({ requestId, path: req.path, error: err });

  res.status(status).json({
    error: status === 500 ? "Internal Server Error" : err.message,
    requestId,
  });
}
