import prismaClient from "../../setup/orm/prisma";
import type {Train, Voyage, Tracker} from "@prisma/client";

import {NewTrainRequiredFields, TrainWithTrackerAndVoyage} from "./types";
import Repository from "../../classes/Repository";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {SelectManyHandler} from "../types/selectManyHandler";
import {ResponseMessage} from "../../types/responseMessage";
import {getSuccess} from "../../utils/responses/getSuccess";
import {getError} from "../../utils/responses/getError";

type TrainWithIncludes = Train & {
  voyage: Voyage | null;
  tracker: Tracker | null;
}

class TrainRepository extends Repository{
  public async GET_ALL({ skip, take } : {
    skip?:number,
    take?:number
  }) {
    try {
      const count = await prismaClient.train.count();
      const responseData = await prismaClient.train.findMany({skip: skip || 0, take: take || count});
      return getSuccess({rows: responseData, count});
    }
    catch (e) {
      return getError(e as any)
    }
  }
  public async GET_ALL_WITH_INCLUDED({ include, noremap, skip, take }: {
    include: {
      voyage?: boolean,
      tracker?: boolean
    }} & SelectManyHandler
  ) {
    try {
      console.log({skip, take})
      const trains = await prismaClient.train.findMany({ include, skip, take });
      const count = await prismaClient.train.count();

      if (noremap) {
        return getSuccess({rows: trains, count});
      }
      const remapped = trains.map(row => TrainRepository.mapToDestructed(row, Object.keys(include)));
      return getSuccess({rows: remapped, count});
    }
    catch (e) {
      return getError(e as any)
    }
  }

  public async POST_CREATE_ONE(data: Record<typeof NewTrainRequiredFields[number], any>){
    try {
      let createData: {
        name: string;
        active: boolean;
        tracker: {};
        voyage?: {};
      } = {
        name: data.name,
        active: Boolean(data.active),
        tracker: data.trackerSerial && { create: { serial: data.trackerSerial } }
      };

      const voyageExists = await prismaClient.voyage.findFirst({where: {id: Number(data.voyageID)}});
      if (voyageExists) {
        createData = {
          ...createData,
          voyage: { connect: { id: Number(data.voyageID) } }
        };
      }
      const row = await prismaClient.train.create({ data: createData });

      return getSuccess({row}, 201);
    }
    catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        return getError({ code: e.code, message: e.meta?.cause });
      }
      return getError(e as any)
    }
  }

  public static mapToDestructed(targetObject: TrainWithIncludes, requested: string[]): TrainWithTrackerAndVoyage {
    const {
      voyage,
      tracker,
      ...train
    } = targetObject;

    let remapedObj: TrainWithTrackerAndVoyage = {...train};

    if (tracker || requested.includes("tracker")) {
      remapedObj = {
        ...remapedObj,
        trackerSerial: tracker?.serial || null
      };
    }

    if (voyage || requested.includes("voyage")) {
      remapedObj = {
        ...remapedObj,
        voyageName: voyage?.name || null,
        voyageRouteID: voyage?.routeID || null
      };
    }

    return remapedObj;
  }
}

export { TrainRepository };