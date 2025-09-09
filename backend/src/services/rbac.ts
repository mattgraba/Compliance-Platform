// RBAC Helper

export function requireRole(user: any, allowed: string[]) {
    const roles = user?.roles || [];
    if (!roles.some((r: string) => allowed.includes(r))) {
      throw Object.assign(new Error("Forbidden"), { name: "ForbiddenError" });
    }
  }
  