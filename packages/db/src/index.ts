import { PrismaClient } from "../generated/prisma";

// dotenv.config({ path: './.env' })

declare global {
    var prisma: PrismaClient | undefined;
}
export const prismaSingletonClient = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production")
    globalThis.prisma = prismaSingletonClient;
