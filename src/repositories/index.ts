import { TrainRepository } from './train'
import { TrainStopRepository } from "./trainStop";
import { StationRepository } from "./station";

const repositories = {
    TrainRepository: new TrainRepository(),
    TrainStopRepository: new TrainStopRepository(),
    StationRepository: new StationRepository(),
}

export { repositories };