import {Train} from "@prisma/client";

export type TrainWithTrackerAndVoyage = Train & Tracker & Voyage;
export type NewTrainRequiredFields = Required<Omit<Train, "id" >>
  // 'name', 'voyageID', 'active', 'trackerSerial'

type Tracker = {
  trackerSerial?: string | null;
}

type Voyage = {
  voyageName?: string | null;
  voyageRouteID?: number | null;
}
