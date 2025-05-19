import Repository, {ErrorResponseData, SuccessResponseData} from "../../classes/Repository";
import prismaClient from "../../setup/orm/prisma";
import {Station, TrainStop} from "@prisma/client";
import {SelectManyHandler} from "../types/selectManyHandler";
import {getSuccess} from "../../utils/responses/getSuccess";
import {getError} from "../../utils/responses/getError";

type StationWithIncludes = Station & {
  stop: TrainStop | null
}

class StationRepository extends Repository {
  public async GET_ALL(): Promise<SuccessResponseData | ErrorResponseData> {
    try {
      const responseData = await prismaClient.station.findMany();
      const count = await prismaClient.station.count();
      return getSuccess({rows: responseData, count});
    }
    catch (e) {
      return getError(e as any)
    }
  }

  public async GET_ALL_WITH_INCLUDED({include, noremap}: {
    include: {
      stop?: boolean
    }} & SelectManyHandler): Promise<SuccessResponseData | ErrorResponseData> {
    const stations = await prismaClient.station.findMany({include})

    if (noremap) {
      return getSuccess(stations);
    }
    const remapped = await Promise.all(stations.map((
        row
      ) =>
        StationRepository.mapToDestructed(row, Object.keys(include))
    ));
    return getSuccess(remapped);
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