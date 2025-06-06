import Repository from "../../classes/Repository";
import prismaClient from "../../setup/orm/prisma";
import {PrismaClientKnownRequestError, PrismaClientValidationError} from "@prisma/client/runtime/library";
import {SelectManyHandler} from "../types/selectManyHandler";
import {getResponseMessage} from "../../utils/responses/getResponseMessage";

class ScheduleRepository extends Repository {
  public async GET_ALL({ skip, take } : {
    skip?:number,
    take?:number
  }) {
    try {
      const count = await prismaClient.schedule.count();
      const responseData = await prismaClient.schedule.findMany({skip: skip || 0, take: take || count});
      return getResponseMessage({rows: responseData, count});
    }
    catch (e) {
      return getResponseMessage(e as any, 500);
    }
  }
  public async GET_ALL_WITH_INCLUDED({ include, noremap, skip, take }: {
    include: {
      voyage?: boolean,
      train?: boolean,
      stop?: boolean
    }} & SelectManyHandler) {
    try {
      const schedule = await prismaClient.schedule.findMany({ include, skip, take });
      const count = await prismaClient.schedule.count();

      if (noremap) {
        return getResponseMessage({ rows: schedule, count });
      }
      const remapped = schedule.map(row => ScheduleRepository.mapToDestructed(row, Object.keys(include)));
      return getResponseMessage({ rows: remapped, count });
    }
    catch (e) {
      return getResponseMessage(e as any, 500)
    }
  }
  public async POST_CREATE_ONE(data: {
    voyageID: number,
    trainID: number,
    stopID: number,
    date: string
  }) {
    const createData = {
      date: new Date(data.date).toISOString(),
      voyage: { connect: { id: data.voyageID } },
      train: { connect: { id: data.trainID } },
      stop: { connect: { id: data.stopID } }
    };

    try {
      const row = await prismaClient.schedule.create({ data: createData });
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
      return getResponseMessage({data: e})
    }
  }

  public static mapToDestructed(targetObject: any, requested: string[]){
    return targetObject;
  }
}

export { ScheduleRepository }