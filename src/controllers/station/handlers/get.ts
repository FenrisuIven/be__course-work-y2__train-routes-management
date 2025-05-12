import { repositories } from "../../../repositories";

const getAll = async (include: Record<string, boolean>, noremap: boolean) => {
  if (Object.keys(include).length > 0) {
    return repositories.StationRepository.GET_ALL_WITH_INCLUDED({ include, noremap })
  }
  return repositories.StationRepository.GET_ALL();
}

export {
  getAll
};