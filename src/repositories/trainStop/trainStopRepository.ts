import prismaClient from "../../setup/orm/prisma";
import type {TrainStop, Station, Route} from "@prisma/client";
import Repository, {ErrorResponseData, SuccessResponseData} from "../../classes/Repository";
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
  public async GET_ALL(): Promise<SuccessResponseData | ErrorResponseData> {
    try {
      const responseData = await prismaClient.trainStop.findMany();
      const count = await prismaClient.trainStop.count();
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
    }} & SelectManyHandler): Promise<SuccessResponseData | ErrorResponseData> {
    try {
      const stops = await prismaClient.trainStop.findMany({ include, skip, take });
      const count = await prismaClient.trainStop.count();

      if (noremap) {
        return getSuccess({rows: stops, count });
      }
      const remapped = stops.map(row => TrainStopRepository.mapToDestructed(row, Object.keys(include)));
      return getSuccess({rows: remapped, count});
    }
    catch (e) {
      return getError(e as any)
    }
  }

  public async POST_CREATE_ONE() {
    return getError({ message: "Independent creation of train stops is not allowed" }, 405)
  }

  public static mapToDestructed(targetObject: TrainStopWithIncludes, requested: string[]){
    const { station, routes, ...trainStop } = targetObject;
    let remappedObj: TrainStopWithStationAndRoute = { ...trainStop };

    if (station || requested.includes("station")) {
      remappedObj = {
        ...remappedObj,
        stationName: station?.name,
        stationCity: station?.city,
        stationRegion: station?.region,
        stationStreet: station?.street
      }
    }

    return remappedObj;
  }
}

export {TrainStopRepository}