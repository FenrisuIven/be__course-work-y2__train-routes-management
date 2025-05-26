import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient({
  log: ['query'],
  errorFormat: 'pretty'
});

export default prismaClient;
