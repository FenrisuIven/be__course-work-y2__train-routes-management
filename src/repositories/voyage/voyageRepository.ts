import Repository from "../../classes/Repository";
import prismaClient from "../../setup/orm/prisma";
import {PrismaClientKnownRequestError, PrismaClientValidationError} from "@prisma/client/runtime/library";
import {SelectManyHandler} from "../types/selectManyHandler";
import type {Route, Train, Voyage, Schedule} from "@prisma/client";
import {getResponseMessage} from "../../utils/responses/getResponseMessage";

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
      return getResponseMessage({rows: responseData, count});
    }
    catch (e) {
      return getResponseMessage(e as any, 500);
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
        return getResponseMessage({ rows: schedule, count });
      }
      const remapped = schedule.map(row => VoyageRepository.mapToDestructed(row, Object.keys(include)));
      return getResponseMessage({ rows: remapped, count });
    }
    catch (e) {
      return getResponseMessage(e as any, 500)
    }
  }
  public async POST_CREATE_ONE(data: {
    name: string
    routeID: number,
    trainIDs?: number[]
  }) {
    const createData = {
      name: data.name,
      route: { connect: { id: data.routeID } },
      trains: { connect: [...data.trainIDs?.map(trainId => ({ id: trainId })) || []] }
    };

    try {
      const row = await prismaClient.voyage.create({ data: createData });
      return getResponseMessage(row, 201);
    }
    catch (e) {
      console.log({e})
      if (e instanceof PrismaClientKnownRequestError) {
        console.log({e})
        return getResponseMessage({ code: e.code, message: e.meta?.cause }, 400);
      }
      if (e instanceof PrismaClientValidationError) {
        const messageLines = e.message.trim().split('\n');
        return getResponseMessage({ message: messageLines[messageLines.length - 1] }, 400);
      }
      return getResponseMessage({data: e}, 500)
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