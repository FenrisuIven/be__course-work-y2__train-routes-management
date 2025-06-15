import searchInTable, {SearchInTablePayload} from "../../controllers/handlers/searchInTable";
import {checkRequiredFieldsPresent} from "../validation/checkRequiredFieldsPresent";
import {getResponseMessage} from "../responses/getResponseMessage";
import { Prisma } from "@prisma/client";

const handleSearchInTable = (table:Prisma.ModelName) => {
  return async (params: SearchInTablePayload) => {
    const isMissingParams = checkRequiredFieldsPresent(["value", "inColumn"], params.search);
    if(isMissingParams.length !== 0) {
      return getResponseMessage({message: `Requested query has missing parameters: ${isMissingParams}`, missingParameters: isMissingParams}, 400);
    }
    const targetSearchParams: SearchInTablePayload = {
      search: {
        ...params.search,
        inTable: table,
        cmp: 'starts'
      },
      skip: params.skip,
      take: params.take
    };
    return searchInTable(targetSearchParams);
  }
}

export default handleSearchInTable;