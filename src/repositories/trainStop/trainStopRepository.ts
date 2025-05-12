import prismaClient from "../../setup/orm/prisma";
import type {TrainStop, Station, Route} from "@prisma/client";
import Repository from "../../classes/Repository";
import {TrainStopWithStationAndRoute} from "./types";

type TrainStopWithIncludes = TrainStop & {
  station: Station | null;
  routes: Route[] | null;
}

class TrainStopRepository extends Repository{
  public async GET_ALL(){
    return prismaClient.trainStop.findMany();
  }
  public async GET_ALL_WITH_INCLUDED({ include, noremap }: {
    include: {
      station?: boolean,
      routes?: boolean
    },
    noremap?: boolean
  }): Promise<TrainStopWithIncludes[] | TrainStopWithStationAndRoute[]> {
    const stops = await prismaClient.trainStop.findMany({ include })

    if(noremap) { return stops; }
    return stops.map(row => TrainStopRepository.mapToDestructed(row, Object.keys(include)));
  }

  public async POST_CREATE_ONE() {
    throw Error('Independent TrainStop creation is not allowed');
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