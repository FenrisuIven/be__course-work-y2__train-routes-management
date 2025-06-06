import Repository from "../../classes/Repository";
import prismaClient from "../../setup/orm/prisma";
import {Station, TrainStop} from "@prisma/client";
import {SelectManyHandler} from "../types/selectManyHandler";
import {getResponseMessage} from "../../utils/responses/getResponseMessage";

type StationWithIncludes = Station & {
  stop: TrainStop | null
}

class StationRepository extends Repository {
  public async GET_ALL({ skip, take } : {
    skip?:number,
    take?:number
  }) {
    try {
      const count = await prismaClient.station.count();
      const responseData = await prismaClient.station.findMany({skip: skip || 0, take: take || count});
      return getResponseMessage({rows: responseData, count});
    }
    catch (e) {
      return getResponseMessage(e as any, 500)
    }
  }

  public async GET_ALL_WITH_INCLUDED({include, noremap}: {
    include: {
      stop?: boolean
    }} & SelectManyHandler) {
    const stations = await prismaClient.station.findMany({include})

    if (noremap) {
      return getResponseMessage(stations);
    }
    const remapped = await Promise.all(stations.map((
        row
      ) =>
        StationRepository.mapToDestructed(row, Object.keys(include))
    ));
    return getResponseMessage(remapped);
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