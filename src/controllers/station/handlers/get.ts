import { repositories } from "../../../repositories";
import {ResponseMessage} from "../../../types/responseMessage";
import getAll, {GetAllPayload} from "../../handlers/getAll";

const stationGetAll = async (params: GetAllPayload) => {
  return getAll(params, repositories.StationRepository);
}

export {
  stationGetAll
};