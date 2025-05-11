import prismaClient from "../../setup/orm/prisma";
import type {Train, Voyage, Tracker, TrainStop} from "@prisma/client";

import {NewTrainRequiredFields, TrainWithTrackerAndVoyage} from "./types";
import Repository from "../../classes/Repository";
import {PrismaClientKnownRequestError} from "../../../prisma/generated/runtime/library";

type TrainWithIncludes = Train & {
  voyage: Voyage | null;
  tracker: Tracker | null;
}

class TrainRepository extends Repository{
  public async GET_ALL(): Promise<Train[]> {
    return prismaClient.train.findMany();
  }
  public async GET_ALL_WITH_INCLUDED({ include, noremap }: {
    include: {
      voyage?: boolean,
      tracker?: boolean
    },
    noremap?: boolean
  }): Promise<TrainWithIncludes[] | TrainWithTrackerAndVoyage[]> {
    const trains: TrainWithIncludes[] = await prismaClient.train.findMany({ include });

    if (noremap) {
      return trains;
    }
    return trains.map(row => TrainRepository.mapToDestructed(row, Object.keys(include)));
  }

  public async POST_CREATE_ONE(data: Record<typeof NewTrainRequiredFields[number], any>){
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

    try {
      const row = await prismaClient.train.create({ data: createData });
      return {status: 200, data: row};
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        return {status: 400, data: { code: e.code, message: e.meta?.cause } };
      }
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