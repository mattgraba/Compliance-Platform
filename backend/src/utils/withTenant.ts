// Tenant Query Helper
export const withTenant = (tenantId: number, where: object = {}) => ({
    AND: [{ tenantId }, where],
  });
  