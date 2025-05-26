import {ResponseMessage} from "../../types/responseMessage";
import {getError} from "../../utils/responses/getError";
import {getSuccess} from "../../utils/responses/getSuccess";
import {RequestPayload} from "../types/requestPayload";
import Repository from "../../classes/Repository";

export type GetAllPayload = Required<Omit<RequestPayload, "body">>;

const getAll = async (params: GetAllPayload, repository: Repository): Promise<ResponseMessage> => {
  let responseData;
  if (params.include && Object.keys(params.include)?.length > 0) {
    responseData = await repository.GET_ALL_WITH_INCLUDED(params)
  } else {
    responseData = await repository.GET_ALL(params);
  }

  if (responseData.error){
    return getError(responseData.data, responseData.status);
  }
  else {
    return getSuccess(responseData.data);
  }
}

export default getAll;