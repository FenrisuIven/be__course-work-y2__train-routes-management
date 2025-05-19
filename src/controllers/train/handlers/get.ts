import { repositories } from "../../../repositories";
import {ResponseMessage} from "../../../types/responseMessage";
import {RequestPayload} from "../../types/requestPayload";
import getAll, {GetAllPayload} from "../../handlers/getAll";

const trainGetAll = async (params: GetAllPayload): Promise<ResponseMessage> => {
  return getAll(params, repositories.TrainRepository);
}

export {
  trainGetAll
};