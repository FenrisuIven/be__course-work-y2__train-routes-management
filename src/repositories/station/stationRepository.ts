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
    if (!data.lon || !data.lat || isNaN(Number(data.lon)) || isNaN(Number(data.lat))) {
      return getResponseMessage({message: 'Invalid or missing coordinates'}, 400);
    }
    const createData = {
      name: data.name,
      city: data.city,
      region: data.region,
      street: data.street,
      stop: { create: { name: data.streetName || data.name } }
    };
    const res = await prismaClient.station.create({data: createData});
    // TODO: query new station and then its stop to get the ID
    // const rawRes = await prismaClient.$queryRaw`UPDATE public."TrainStop" SET "position" = ST_MakePoint(${data.lon}, ${data.lat}) WHERE "id"=${res.id}`
    // console.log(res.id, {res})
    return getResponseMessage(res, 201);
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