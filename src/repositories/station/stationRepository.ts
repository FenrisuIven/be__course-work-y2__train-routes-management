import Repository from "../../classes/Repository";
import prismaClient from "../../setup/orm/prisma";
import {Station, TrainStop} from "@prisma/client";

type StationWithIncludes = Station & {
  stop: TrainStop | null
}

class StationRepository extends Repository {
  public async GET_ALL(): Promise<any[]> {
    return prismaClient.station.findMany();
  }

  public async GET_ALL_WITH_INCLUDED({include, noremap}: {
    include: {
      stop?: boolean
    };
    noremap?: boolean }
  ): Promise<any[]> {
    const stations = await prismaClient.station.findMany({ include })

    if(noremap) { return stations; }
    return Promise.all(stations.map((
        row
      ) =>
      StationRepository.mapToDestructed(row, Object.keys(include))
    ));
  }

  public async POST_CREATE_ONE(data: Record<any, any>): Promise<any> {
    return Promise.resolve(undefined);
  }

  public static async mapToDestructed(targetObject: StationWithIncludes, requested: string[]) {
    const {stop, ...station} = targetObject;

    if(requested.includes('stop')){
      const stopData: { stopName: string | null, stopPosition: string | null }[] = await prismaClient.$queryRaw`SELECT "name" as "stopName", ST_AsGeoJson("position")::text as "stopPosition" FROM "TrainStop" WHERE "id" = ${stop?.id}`
      const {stopName, stopPosition} = stopData[0];

      return {
        ...station,
        stopName,
        stopPosition: JSON.parse(stopPosition || '{}').coordinates
      }
    }
    return station;
  }
}

export {StationRepository}