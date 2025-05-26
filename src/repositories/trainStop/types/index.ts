import { TrainStop } from "@prisma/client";

export type TrainStopWithStationAndRoute = TrainStop & Station & Routes & TrainStopPosition;

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