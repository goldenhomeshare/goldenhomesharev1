import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

// Health check function
export async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Disconnect function
export async function disconnectPrisma() {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
}