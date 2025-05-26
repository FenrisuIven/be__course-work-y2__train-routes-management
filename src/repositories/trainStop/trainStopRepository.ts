import prismaClient from "../../setup/orm/prisma";
import type {TrainStop, Station, Route} from "@prisma/client";
import Repository from "../../classes/Repository";
import {TrainStopWithStationAndRoute} from "./types";
import {getSuccess} from "../../utils/responses/getSuccess";
import {getError} from "../../utils/responses/getError";
import {SelectManyHandler} from "../types/selectManyHandler";
import {ResponseMessage} from "../../types/responseMessage";

type TrainStopWithIncludes = TrainStop & {
  station: Station | null;
  routes: Route[] | null;
}

class TrainStopRepository extends Repository{
  public async GET_ALL({ skip, take } : {
    skip?:number,
    take?:number
  }) {
    try {
      const count = await prismaClient.trainStop.count();
      const responseData = await prismaClient.trainStop.findMany({skip: skip || 0, take: take || count});
      return getSuccess({rows: responseData, count});
    }
    catch (e) {
      return getError(e as any);
    }
  }
  public async GET_ALL_WITH_INCLUDED({ include, noremap, skip, take }: {
    include: {
      station?: boolean,
      routes?: boolean
    }} & SelectManyHandler) {
    try {
      const count = await prismaClient.trainStop.count();
      const stops = await prismaClient.trainStop.findMany({ include, skip: skip || 0, take: take || count });

      if (noremap) {
        return getSuccess({rows: stops, count });
      }
      const remapped = await Promise.all(stops.map(row => TrainStopRepository.mapToDestructed(row, Object.keys(include))));
      return getSuccess({rows: remapped, count});
    }
    catch (e) {
      return getError(e as any)
    }
  }

  public async POST_CREATE_ONE() {
    return getError({ message: "Independent creation of train stops is not allowed" }, 405)
  }

  public static async mapToDestructed(targetObject: TrainStopWithIncludes, requested: string[]){
    const { station, routes, ...trainStop } = targetObject;
    let remappedObj: TrainStop | TrainStopWithStationAndRoute = { ...trainStop };

    if (station || requested.includes("station")) {
      const stationPosition: {coordinates: string}[] = await prismaClient.$queryRaw`WITH p AS (SELECT ST_AsGeoJSON("position") as pos FROM "public"."TrainStop" as t0 WHERE t0."id" = ${trainStop.id}) SELECT "pos"::json->>'coordinates' as coordinates FROM p`;
      const coordinates = JSON.parse(stationPosition[0]?.coordinates) || null;
      remappedObj = {
        ...remappedObj,
        stationName: station?.name,
        stationCity: station?.city,
        stationRegion: station?.region,
        stationStreet: station?.street,
        stopPosition: coordinates
      }
    }
    return remappedObj;
  }
}

export {TrainStopRepository}