import prismaClient from "../../setup/orm/prisma";
import type {Train, Voyage, Tracker, TrainStop} from "@prisma/client";

import {NewTrainRequiredFields, TrainWithTrackerAndVoyage} from "./types";
import Model from "../../classes/Model";
import prisma from "../../setup/orm/prisma";
import {resolveError} from "../../utils/requests/resolveError";

type TrainWithIncludes = Train & {
  voyage: Voyage | null;
  tracker: Tracker | null;
}

class TrainModel extends Model{
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
      return trains.map(row => TrainModel.mapToDestructed(row));
    }
    return trains;
  }

  public async POST_CREATE_ONE(data: Record<typeof NewTrainRequiredFields[number], any>){
    let createData = {
      name: data.name,
      active: data.active,
      voyage: undefined,
      tracker: data.trackerSerial && { create: { serial: data.trackerSerial } }
    };

    const trackerPresent = await prismaClient.tracker.findFirst({where: { serial: data.trackerSerial }, include: { train: true }});
    if (trackerPresent) {
      return resolveError(400, { msg: `Tracker with serial ${data.trackerSerial} is already present` });
    }
    const voyagePresent = await prismaClient.voyage.findFirst({where: { id: data.voyageID }});
    if (voyagePresent) {
      createData = {
        ...createData,
        voyage: data.voyageID && { connect: { id: data.voyageID } }
      };
    }

    return prismaClient.train.create({ data: createData });
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

export { TrainModel };