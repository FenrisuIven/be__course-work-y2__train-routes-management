export * from './trainStopRouter'

// retrieve train stops with their positions in world
// await prismaClient.$queryRaw`SELECT "name", "stationID", "position"::text FROM "TrainStop"`;

// set train stop position after its creation
// await prismaClient.$executeRaw`UPDATE "TrainStop" SET "position" = ST_MakePoint(<lon>, <lat>) WHERE "id" = <id>`;

// create new train stop without its position set
/*prismaClient.trainStop.create({
  data: {
    name: 'Train Stop 2',
    station: {
      create: {
        name: 'Station 2',
        city: "City 2",
        region: "Region 2",
        street: "Street 2"
      }
    },
    routes: {
      create: [
        {
          name: "Route 2"
        }
      ]
    }
  }
}).then(res => console.log(res)).catch(err => console.log(err));*/