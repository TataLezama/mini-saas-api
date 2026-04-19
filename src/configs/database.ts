import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export class Database {
  static async connect(): Promise<void> {
    try {
      await prisma.$connect();
      console.log('Neon PostgreSQL conectado correctamente');
    } catch (error) {
      throw new Error(`Error al conectar con Neon: ${error}`);
    }
  }

  static async disconnect(): Promise<void> {
    await prisma.$disconnect();
  }
}
