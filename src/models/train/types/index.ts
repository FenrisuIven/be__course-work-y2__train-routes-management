type TrainWithTrackerAndVoyage = Train & Tracker & Voyage;

type Train = {
  id: number;
  name: string;
  trackerID: number
  voyageID: number | null;
  active: boolean;
};

type Tracker = {
  trackerSerial: string | null;
}

type Voyage = {
  voyageName: string | null;
  voyageRouteID: number | null;
}
