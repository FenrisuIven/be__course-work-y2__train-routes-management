import { repositories } from "../../../repositories";
import {ResponseMessage} from "../../../types/responseMessage";
import getAll, {GetAllPayload} from "../../handlers/getAll";

const scheduleGetAll = async (params: GetAllPayload): Promise<ResponseMessage> => {
  return getAll(params, repositories.ScheduleRepository);
}

export {
  scheduleGetAll
};