import { TrainRepository } from './train'
import { TrainStopRepository } from "./trainStop";
import { StationRepository } from "./station";
import {ScheduleRepository} from "./schedule";

const repositories = {
    TrainRepository: new TrainRepository(),
    TrainStopRepository: new TrainStopRepository(),
    StationRepository: new StationRepository(),
    ScheduleRepository: new ScheduleRepository(),
}

export { repositories };