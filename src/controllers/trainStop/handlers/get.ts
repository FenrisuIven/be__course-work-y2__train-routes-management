import { TrainStopModel } from "../../../repositories/trainStop";

const getAll = async (include: Record<string, boolean>, remap: boolean) => {
  const trainStopModel = new TrainStopModel();
  if (!Object.keys(include).length) {
    return trainStopModel.GET_ALL_WITH_INCLUDED({ include, remap });
  }
  return trainStopModel.GET_ALL();
}

export {
  getAll
};
