import Repository from "../../classes/Repository";
import prismaClient from "../../setup/orm/prisma";
import {PrismaClientKnownRequestError, PrismaClientValidationError} from "@prisma/client/runtime/library";
import {SelectManyHandler} from "../types/selectManyHandler";
import {getSuccess} from "../../utils/responses/getSuccess";
import {getError} from "../../utils/responses/getError";

class RoutesRepository extends Repository {
  public async GET_ALL({ skip, take } : {
    skip?:number,
    take?:number
  }) {
    try {
      const count = await prismaClient.route.count();
      const responseData = await prismaClient.route.findMany({skip: skip || 0, take: take || count});
      return getSuccess({rows: responseData, count});
    }
    catch (e) {
      return getError(e as any);
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
        return getSuccess({ rows: routes, count });
      }
      const remapped = routes.map(row => RoutesRepository.mapToDestructed(row, Object.keys(include)));
      return getSuccess({ rows: remapped, count });
    }
    catch (e) {
      return getError(e as any)
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
      return getSuccess(row, 201);
    }
    catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        return getError({ code: e.code, message: e.meta?.cause }, 400);
      }
      if (e instanceof PrismaClientValidationError) {
        const messageLines = e.message.trim().split('\n');
        return getError({ message: messageLines[messageLines.length - 1] }, 400);
      }
      return getError({data: e})
    }
  }

  public static mapToDestructed(targetObject: any, requested: string[]){
    return targetObject;
  }
}

export { RoutesRepository }