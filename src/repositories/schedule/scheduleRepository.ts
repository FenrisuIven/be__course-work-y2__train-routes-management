import Repository, {ErrorResponseData, SuccessResponseData} from "../../classes/Repository";
import prismaClient from "../../setup/orm/prisma";
import {PrismaClientKnownRequestError, PrismaClientValidationError} from "../../../prisma/generated/runtime/library";
import {SelectManyHandler} from "../types/selectManyHandler";
import {getSuccess} from "../../utils/responses/getSuccess";
import {getError} from "../../utils/responses/getError";
import {ResponseMessage} from "../../types/responseMessage";

class ScheduleRepository extends Repository {
  public async GET_ALL() {
    try {
      const responseData = await prismaClient.schedule.findMany();
      const count = await prismaClient.schedule.count();
      return getSuccess({rows: responseData, count});
    }
    catch (e) {
      return getError(e as any);
    }
  }
  public async GET_ALL_WITH_INCLUDED({ include, noremap, skip, take }: {
    include: {
      voyage?: boolean,
      train?: boolean,
      stop?: boolean
    }} & SelectManyHandler): Promise<SuccessResponseData | ErrorResponseData> {
    try {
      const schedule = await prismaClient.schedule.findMany({ include, skip, take });
      const count = await prismaClient.schedule.count();

      if (noremap) {
        return { data: schedule, count };
      }
      const remapped = schedule.map(row => ScheduleRepository.mapToDestructed(row, Object.keys(include)));
      return { data: remapped, count };
    }
    catch (e) {
      return {error: true, data: e, status: 500}
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

export { ScheduleRepository }