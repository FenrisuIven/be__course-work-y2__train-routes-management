import Repository from "../../classes/Repository";
import prismaClient from "../../setup/orm/prisma";
import {PrismaClientKnownRequestError, PrismaClientValidationError} from "../../../prisma/generated/runtime/library";
import {resolveError} from "../../utils/requests/resolveError";

class ScheduleRepository extends Repository {
  public async GET_ALL(): Promise<any[]> {
    return prismaClient.schedule.findMany();
  }
  public async GET_ALL_WITH_INCLUDED({ include, noremap }: {
    include: {
      voyage?: boolean,
      train?: boolean,
      stop?: boolean
    };
    noremap?: boolean;
  }): Promise<any[]> {
    const schedule = await prismaClient.schedule.findMany({ include });
    if (noremap) {
      return schedule;
    }
    return schedule.map(row => ScheduleRepository.mapToDestructed(row, Object.keys(include)));
  }
  public async POST_CREATE_ONE(data: {
    voyageID: number,
    trainID: number,
    stopID: number,
    date: string
  }): Promise<any> {
    const createData = {
      date: new Date(data.date).toISOString(),
      voyage: { connect: { id: data.voyageID } },
      train: { connect: { id: data.trainID } },
      stop: { connect: { id: data.stopID } }
    };

    try {
      const row = await prismaClient.schedule.create({ data: createData });
      return { status: 201, data: row };
    }
    catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        return resolveError(400, { code: e.code, message: e.meta?.cause });
      }
      if (e instanceof PrismaClientValidationError) {
        const messageLines = e.message.trim().split('\n');
        return resolveError(400, { message: messageLines[messageLines.length - 1] });
      }
      return resolveError(500, {data: e})
    }
  }

  public static mapToDestructed(targetObject: any, requested: string[]){
    return targetObject;
  }
}

export { ScheduleRepository }