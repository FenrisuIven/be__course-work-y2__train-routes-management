import {repositories} from '../../../repositories';
import getAll, {GetAllPayload} from "../../handlers/getAll";
import {ResponseMessage} from "../../../types/responseMessage";

const trainStopGetAll = async (params: GetAllPayload): Promise<ResponseMessage> => {
  return getAll(params, repositories.TrainStopRepository);
}

export {
  trainStopGetAll
};
