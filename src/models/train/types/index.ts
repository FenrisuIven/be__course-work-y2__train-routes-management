import {Train} from "@prisma/client";

export type TrainWithTrackerAndVoyage = Train & Tracker & Voyage;
export const NewTrainRequiredFields = [
  'name', 'voyageID', 'active',
  'trackerSerial'
] as const;

type Tracker = {
  trackerSerial: string | null;
}

type Voyage = {
  voyageName: string | null;
  voyageRouteID: number | null;
}
