// middleware/correlation.ts
import { randomUUID } from "crypto";
export function correlation(req, res, next) {
  const id = req.header("X-Correlation-ID") || randomUUID();
  req.correlationId = id;
  res.setHeader("X-Correlation-ID", id);
  next();
}