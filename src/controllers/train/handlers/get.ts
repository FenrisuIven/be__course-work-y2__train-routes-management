import { TrainModel } from "../../../models/train";

const getAll = (include: Record<string, boolean>, remap: boolean) => {
  const trainModel = new TrainModel();
  if (Object.keys(include).length > 0) {
    return trainModel.GET_ALL_WITH_INCLUDED({ include, remap });
  }
  return trainModel.GET_ALL();
}

export {
  getAll
};