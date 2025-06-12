import {NewStationRequiredFields} from "../../../repositories/station/types";
import {checkRequiredFieldsPresent} from "../../../utils/validation/checkRequiredFieldsPresent";
import { repositories } from '../../../repositories';
import {ResponseMessage} from "../../../types/responseMessage";
import {RequestPayload} from "../../types/requestPayload";
import {getResponseMessage} from "../../../utils/responses/getResponseMessage";

type StationPostNewPayload = Pick<RequestPayload<Record<typeof NewStationRequiredFields[number], any>>, "body">

const postNew = async (requestData: StationPostNewPayload): Promise<ResponseMessage> => {
  if (!requestData.body){
    return getResponseMessage({ message: 'Request body was not provided' }, 400)
  }

  const missingFields = checkRequiredFieldsPresent(NewStationRequiredFields, requestData.body);
  if (missingFields.length > 0) {
    return getResponseMessage({ message: `Missing required fields: ${missingFields}` }, 400);
  }
  const responseData = await repositories.StationRepository.POST_CREATE_ONE(requestData.body);

  if(responseData.error){
    return getResponseMessage(responseData, responseData.status);
  }
  return getResponseMessage(responseData);
}

export {
  postNew
};