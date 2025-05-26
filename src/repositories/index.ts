import { TrainRepository } from './train'
import { TrainStopRepository } from "./trainStop";
import { StationRepository } from "./station";
import {ScheduleRepository} from "./schedule";
import {VoyageRepository} from "./voyage";

const repositories = {
    TrainRepository: new TrainRepository(),
    TrainStopRepository: new TrainStopRepository(),
    StationRepository: new StationRepository(),
    ScheduleRepository: new ScheduleRepository(),
    VoyageRepository: new VoyageRepository()
}

export { repositories };