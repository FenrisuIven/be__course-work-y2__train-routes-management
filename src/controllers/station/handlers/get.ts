import { repositories } from "../../../repositories";
import getAll, {GetAllPayload} from "../../handlers/getAll";
import searchInTable, {SearchInTablePayload} from "../../handlers/searchInTable";
import {checkRequiredFieldsPresent} from "../../../utils/validation/checkRequiredFieldsPresent";
import {getResponseMessage} from "../../../utils/responses/getResponseMessage";

const stationGetAll = async (params: GetAllPayload) => {
  return getAll(params, repositories.StationRepository);
}

export {
  stationGetAll
};