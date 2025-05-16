import { PrismaClient } from '../../../prisma/generated/client'

const prismaClient = new PrismaClient({
  log: ['query'],
  errorFormat: 'pretty'
});

export default prismaClient;
