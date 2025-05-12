import {repositories} from '../../../repositories';

const getAll = async (include: Record<string, boolean>, noremap: boolean) => {
  if (!Object.keys(include).length) {
    return repositories.TrainStopRepository.GET_ALL_WITH_INCLUDED({ include, noremap });
  }
  return repositories.TrainStopRepository.GET_ALL();
}

export {
  getAll
};
