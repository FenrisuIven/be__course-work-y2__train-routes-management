import { repositories } from "../../../repositories";
import {ResponseMessage} from "../../../types/responseMessage";
import getAll, {GetAllPayload} from "../../handlers/getAll";
import {SearchInTablePayload} from "../../handlers/searchInTable";
import searchInTable from "../../handlers/searchInTable";
import {checkRequiredFieldsPresent} from "../../../utils/validation/checkRequiredFieldsPresent";
import {getResponseMessage} from "../../../utils/responses/getResponseMessage";

const scheduleGetAll = async (params: GetAllPayload): Promise<ResponseMessage> => {
  return getAll(params, repositories.ScheduleRepository);
}

const scheduleFind = async (params: SearchInTablePayload) => {
  const isMissingParams = checkRequiredFieldsPresent(["value", "inColumn"], params.search);
  if(isMissingParams.length !== 0) {
    return getResponseMessage({message: `Requested query has missing parameters: ${isMissingParams}`, missingParameters: isMissingParams}, 400);
  }
  const targetSearchParams: SearchInTablePayload = {
    search: {
      ...params.search,
      inTable: "Schedule",
      cmp: 'starts'
    },
    skip: params.skip,
    take: params.take
  };
  return searchInTable(targetSearchParams);
}

export {
  scheduleGetAll,
  scheduleFind
};