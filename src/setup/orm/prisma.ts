import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient({
  log: ['query'],
  errorFormat: 'pretty'
});

export default prismaClient;

// prismaClient.$queryRaw`UPDATE "public"."TrainStop" as t0 SET "position" = ST_MakePoint(32.049893, 49.425982) WHERE t0."id" = 4`.catch(e=>console.log(e))
// prismaClient.$queryRaw`SELECT ST_AsGeoJSON("position") as pos FROM "public"."TrainStop" as t0 WHERE t0."id" = 4`.then(d=>console.log(JSON.parse(d[0].pos).coordinates)).catch(e=>console.log(e))