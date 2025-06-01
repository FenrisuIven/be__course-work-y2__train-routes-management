import { TrainRepository } from './train'
import { TrainStopRepository } from "./trainStop";
import { StationRepository } from "./station";
import {ScheduleRepository} from "./schedule";
import {VoyageRepository} from "./voyage";
import {RoutesRepository} from "./routes";

const repositories = {
    TrainRepository: new TrainRepository(),
    TrainStopRepository: new TrainStopRepository(),
    StationRepository: new StationRepository(),
    ScheduleRepository: new ScheduleRepository(),
    VoyageRepository: new VoyageRepository(),
    RoutesRepository: new RoutesRepository()
}

export { repositories };