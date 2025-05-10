import { repositories } from "../../../repositories";

const getAll = (include: Record<string, boolean>, remap: boolean) => {
  if (Object.keys(include).length > 0) {
    return repositories.TrainRepository.GET_ALL_WITH_INCLUDED({ include, remap });
  }
  return repositories.TrainRepository.GET_ALL();
}

export {
  getAll
};