import Repository from "../../classes/Repository";
import prismaClient from "../../setup/orm/prisma";
import {PrismaClientKnownRequestError, PrismaClientValidationError} from "../../../prisma/generated/runtime/library";
import {SelectManyHandler} from "../types/selectManyHandler";
import {getSuccess} from "../../utils/responses/getSuccess";
import {getError} from "../../utils/responses/getError";
import type {Route, Train, Voyage, Schedule} from "@prisma/client";

type VoyageWithIncludes = Voyage & {
  trains: Train[] | null;
  route: Route | null;
  schedule: Schedule[] | null;
}

class VoyageRepository extends Repository {
  public async GET_ALL({ skip, take } : {
    skip?:number,
    take?:number
  }) {
    try {
      const count = await prismaClient.voyage.count();
      const responseData = await prismaClient.voyage.findMany({skip: skip || 0, take: take || count});
      return getSuccess({rows: responseData, count});
    }
    catch (e) {
      return getError(e as any);
    }
  }
  public async GET_ALL_WITH_INCLUDED({ include, noremap, skip, take }: {
    include: {
      trains?: boolean,
      route?: boolean,
      schedule?: boolean
    }} & SelectManyHandler) {
    try {
      const schedule = await prismaClient.voyage.findMany({ include, skip, take });
      const count = await prismaClient.voyage.count();

      if (noremap) {
        return getSuccess({ rows: schedule, count });
      }
      const remapped = schedule.map(row => VoyageRepository.mapToDestructed(row, Object.keys(include)));
      return getSuccess({ rows: remapped, count });
    }
    catch (e) {
      return getError(e as any)
    }
  }
  public async POST_CREATE_ONE(data: {
    name: string
    routeID: number,
  }) {
    const createData = {
      name: data.name,
      route: { connect: { id: data.routeID } }
    };

    try {
      const row = await prismaClient.voyage.create({ data: createData });
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

  public static mapToDestructed(targetObject: VoyageWithIncludes, requested: string[]){
    const {
      trains,
      route,
      schedule,
      ...voyage
    } = targetObject;

    return {...voyage, ...trains, ...route, ...schedule};
  }
}

export { VoyageRepository }