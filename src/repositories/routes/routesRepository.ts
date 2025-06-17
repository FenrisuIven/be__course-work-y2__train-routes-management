import Repository from "../../classes/Repository";
import prismaClient from "../../setup/orm/prisma";
import {PrismaClientKnownRequestError, PrismaClientValidationError} from "@prisma/client/runtime/library";
import {SelectManyHandler} from "../types/selectManyHandler";
import {getResponseMessage} from "../../utils/responses/getResponseMessage";
import {Route, TrainStop} from "@prisma/client";

class RoutesRepository extends Repository {
  public async GET_ALL({ skip, take, filter } : {
    skip?:number,
    take?:number,
    filter?: Record<string, any> & { where: Record<string, any> }
  }) {
    try {
      const count = await prismaClient.route.count();
      const responseData = await prismaClient.route.findMany({skip: skip || 0, take: take || count, ...filter,  });
      return getResponseMessage({rows: responseData, count});
    }
    catch (e) {
      return getResponseMessage(e as any, 500);
    }
  }
  public async GET_ALL_WITH_INCLUDED({ include, noremap, skip, take }: {
    include: {
      voyage?: boolean,
      stops?: boolean
    }} & SelectManyHandler) {
    try {
      const count = await prismaClient.route.count();
      const routes = await prismaClient.route.findMany({ include, skip: skip || 0, take: take || count });

      if (noremap) {
        return getResponseMessage({ rows: routes, count });
      }
      const remapped = routes.map(row =>
        RoutesRepository.mapToDestructed(row, Object.keys(include)));
      return getResponseMessage({ rows: remapped, count });
    }
    catch (e) {
      return getResponseMessage(e as any, 500)
    }
  }
  public async POST_CREATE_ONE(data: {
    name: string,
    stopIDs: number[],
  }) {
    const createData = {
      name: data.name,
      stops: { connect: data.stopIDs.map(stopId=>({ id: stopId })) }
    };

    try {
      const row = await prismaClient.route.create({ data: createData });
      return getResponseMessage(row, 201);
    }
    catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        return getResponseMessage({ code: e.code, message: e.meta?.cause }, 400);
      }
      if (e instanceof PrismaClientValidationError) {
        const messageLines = e.message.trim().split('\n');
        return getResponseMessage({ message: messageLines[messageLines.length - 1] }, 400);
      }
      return getResponseMessage({data: e}, 500)
    }
  }

  public async GET_TRANSFER({ startStopID, endStopID }: {
    startStopID: number,
    endStopID: number
  }) {
    const routesWithStart = await prismaClient.route.findMany({
      where: {
        stops: { some: { id: startStopID } }
      },
      include: {
        stops: { include: { station: true } }
      }
    });

    if (routesWithStart.length < 1) {
      return getResponseMessage({message: `No routes that contain start stop with ID ${startStopID} were found`}, 404);
    }

    const routesWithEnd = await prismaClient.route.findMany({
      where: {
        stops: {
          some: { id: endStopID }
        }
      },
      include: {
        stops: {include: {station: true}}
      }
    });

    if (routesWithEnd.length < 1) {
      return getResponseMessage({message: `No routes that contain this end stop with ID ${endStopID} were found`}, 404);
    }

    const possibleTransfers: {routeStart: Object, routeEnd: Object, transferStops: Object[]}[] = [];
    
    for (const routeStart of routesWithStart) {
      for (const routeEnd of routesWithEnd) {
        if (routeStart.id === routeEnd.id) continue;
        const transferStops = routeStart.stops.filter(stopFromStartRoute =>
          routeEnd.stops.some(stopFromEndRoute => stopFromEndRoute.id === stopFromStartRoute.id)
        );

        if (transferStops.length > 0) {
          possibleTransfers.push({
            routeStart,
            routeEnd,
            transferStops,
          });
        }
      }
    }

    return getResponseMessage({rows: possibleTransfers, count: possibleTransfers.length});
  }

  public static mapToDestructed(targetObject: Route & {stops: TrainStop[] | undefined}, requested: string[]){
    return targetObject;
  }
}

export { RoutesRepository }