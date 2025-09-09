// Rate Limiter Middleware

import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                  // 20 login attempts
  message: { error: "Too many attempts, try later" },
});
