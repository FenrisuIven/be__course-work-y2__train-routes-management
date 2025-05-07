import prismaClient from "../../setup/orm/prisma";
import type {Train, Voyage, Tracker} from "@prisma/client";

type TrainWithIncludes = Train & {
  voyage: Voyage | null;
  tracker: Tracker | null;
}

class TrainModel{
  public static async GET_ALL(): Promise<Train[]> {
    return prismaClient.train.findMany();
  }
  public static async GET_ALL_WITH_INCLUDED({ include, remap }: {
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

export default TrainModel;