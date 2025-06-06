import prismaClient from "../../setup/orm/prisma";
import type {TrainStop, Station, Route} from "@prisma/client";
import Repository from "../../classes/Repository";
import {TrainStopWithStationAndRoute} from "./types";
import {SelectManyHandler} from "../types/selectManyHandler";
import {getResponseMessage} from "../../utils/responses/getResponseMessage";

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
      return getResponseMessage({rows: responseData, count});
    }
    catch (e) {
      return getResponseMessage(e as any, 500);
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
        return getResponseMessage({rows: stops, count});
      }
      const remapped = await Promise.all(stops.map(row => TrainStopRepository.mapToDestructed(row, Object.keys(include))));
      return getResponseMessage({rows: remapped, count});
    }
    catch (e) {
      return getResponseMessage(e as any, 500)
    }
  }

  public async GET_ALL_WITH_POS({skip, take}: SelectManyHandler ){
    const count = await prismaClient.trainStop.count();
    const result: {id: number, coordinates: string}[] = await prismaClient.$queryRaw`SELECT t0."id", ST_AsGeoJSON(t0."position") as coordinates FROM "public"."TrainStop" as t0 OFFSET ${skip || 0} LIMIT ${take || count}`;
    const remapped = result.map((row) => ({
        id: row.id,
        geojson: row.coordinates ? JSON.parse(row.coordinates) : []
      })
    )
    return getResponseMessage({rows: remapped, count});
  }

  public async POST_CREATE_ONE() {
    return getResponseMessage({ message: "Independent creation of train stops is not allowed" }, 405)
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