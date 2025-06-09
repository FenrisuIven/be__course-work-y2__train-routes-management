import type { TrainStop } from "@prisma/client";

export type TrainStopWithStationAndRoute = TrainStop & Station & Routes & TrainStopPosition;

export const NewTrainStopRequiredFields = ['name', 'stationID', 'position'] as const;

type TrainStopPosition = {
  stopPosition: number[]
}

type Station = {
  stationName?: string | null;
  stationCity?: string | null;
  stationRegion?: string | null;
  stationStreet?: string | null;
};

type Routes = {
  routeName?: string | null;
  voyageID?: number | null;
}[];