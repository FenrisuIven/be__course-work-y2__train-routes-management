import {Train} from "@prisma/client";

export type TrainWithTrackerAndVoyage = Train & Tracker & Voyage;

type Tracker = {
  trackerSerial: string | null;
}

type Voyage = {
  voyageName: string | null;
  voyageRouteID: number | null;
}
