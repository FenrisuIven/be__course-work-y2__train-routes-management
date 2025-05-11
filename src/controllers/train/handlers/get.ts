import { repositories } from "../../../repositories";

const getAll = (include: Record<string, boolean>, noremap: boolean) => {
  if (Object.keys(include).length > 0) {
    return repositories.TrainRepository.GET_ALL_WITH_INCLUDED({ include, noremap });
  }
  return repositories.TrainRepository.GET_ALL();
}

export {
  getAll
};