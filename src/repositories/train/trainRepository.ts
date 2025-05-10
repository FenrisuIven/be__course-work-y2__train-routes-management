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
  public async GET_ALL_WITH_INCLUDED({ include, remap }: {
    include: {
      voyage?: boolean,
      tracker?: boolean
    },
    remap?: boolean
  }): Promise<TrainWithIncludes[] | TrainWithTrackerAndVoyage[]> {
    const trains: TrainWithIncludes[] = await prismaClient.train.findMany({ include });

    if (remap) {
      return trains.map(row => TrainRepository.mapToDestructed(row));
    }
    return trains;
  }

  public async POST_CREATE_ONE(data: Record<typeof NewTrainRequiredFields[number], any>){
    let createData = {
      name: data.name,
      active: data.active,
      voyage: data.voyageID && { connect: { id: data.voyageID } },
      tracker: data.trackerSerial && { create: { serial: data.trackerSerial } }
    };

    try {
      const row = await prismaClient.train.create({ data: createData });
      return {status: 200, data: row};
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        return {status: 400, data: { code: e.code, message: e.meta?.cause } };
      }
    }

    return ;
  }

  public static mapToDestructed(targetObject: TrainWithIncludes): TrainWithTrackerAndVoyage {
    const {
      voyage,
      tracker,
      ...train
    } = targetObject;

    return {...train,
      trackerSerial: tracker?.serial || null,
      voyageName: voyage?.name || null,
      voyageRouteID: voyage?.routeID || null
    };
  }
}

export { TrainRepository };