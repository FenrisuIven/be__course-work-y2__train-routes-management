import {ResponseMessage} from "../../types/responseMessage";
import {RequestPayload} from "../types/requestPayload";
import Repository from "../../classes/Repository";
import {getResponseMessage} from "../../utils/responses/getResponseMessage";

export type GetAllPayload = Required<Omit<RequestPayload, "body">>;

const getAll = async (params: GetAllPayload, repository: Repository): Promise<ResponseMessage> => {
  let responseData;
  if (params.include && Object.keys(params.include)?.length > 0) {
    responseData = await repository.GET_ALL_WITH_INCLUDED(params)
  } else {
    responseData = await repository.GET_ALL(params);
  }

  if (responseData.error){
    return getResponseMessage(responseData.data, responseData.status);
  }
  else {
    return getResponseMessage(responseData.data);
  }
}

export default getAll;