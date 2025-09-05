import prisma from "../lib/prisma.js";

export const logAction = async (userId, action) => {
    try {
        const ipAddress = req?.ip || req?.headers['x-forwarded-for'] || null;
        const userAgent = req?.headers['user-agent'] || null;

        await prisma.auditLog.create({
            data: {
                userId,
                action,
                ipAddress,
                userAgent,
            },
        });
    } catch (err) {
        console.error("Failed to log action", err);
    }
};