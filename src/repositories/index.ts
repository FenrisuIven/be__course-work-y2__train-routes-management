import { TrainRepository } from './train'
import { TrainStopRepository } from "./trainStop";

const repositories = {
    TrainRepository: new TrainRepository(),
    TrainStopRepository: new TrainStopRepository(),
}

export { repositories };