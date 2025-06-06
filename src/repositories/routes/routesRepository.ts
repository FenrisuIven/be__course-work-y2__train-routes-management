import Repository from "../../classes/Repository";
import prismaClient from "../../setup/orm/prisma";
import {PrismaClientKnownRequestError, PrismaClientValidationError} from "@prisma/client/runtime/library";
import {SelectManyHandler} from "../types/selectManyHandler";
import {getResponseMessage} from "../../utils/responses/getResponseMessage";

class RoutesRepository extends Repository {
  public async GET_ALL({ skip, take } : {
    skip?:number,
    take?:number
  }) {
    try {
      const count = await prismaClient.route.count();
      const responseData = await prismaClient.route.findMany({skip: skip || 0, take: take || count});
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
      const routes = await prismaClient.route.findMany({ include, skip, take });
      const count = await prismaClient.route.count();

      if (noremap) {
        return getResponseMessage({ rows: routes, count });
      }
      const remapped = routes.map(row => RoutesRepository.mapToDestructed(row, Object.keys(include)));
      return getResponseMessage({ rows: remapped, count });
    }
    catch (e) {
      return getResponseMessage(e as any, 500)
    }
  }
  public async POST_CREATE_ONE(data: {
    name: string,
    voyageID: number,
    stops: number[],
  }) {
    const createData = {
      name: data.name,
      voyage: { connect: { id: data.voyageID } },
      stops: { connect: data.stops.map(stopId=>({ id: stopId })) }
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

  public static mapToDestructed(targetObject: any, requested: string[]){
    return targetObject;
  }
}

export { RoutesRepository }