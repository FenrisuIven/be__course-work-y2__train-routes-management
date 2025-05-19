import {checkRequiredFieldsPresent} from "../../../utils/validation/isRequiredFieldsPresent";
import {repositories} from '../../../repositories';
import {NewScheduleRequiredFields} from "../../../repositories/schedule/types";
import {ResponseMessage} from "../../../types/responseMessage";
import {getError} from "../../../utils/responses/getError";
import {getSuccess} from "../../../utils/responses/getSuccess";
import {RequestPayload} from "../../types/requestPayload";

type SchedulePostNewPayload = Pick<RequestPayload<Record<typeof NewScheduleRequiredFields[number], any>>, "body">

const postNew = async (requestData: SchedulePostNewPayload): Promise<ResponseMessage> => {
  if (!requestData.body){
    return getError({ msg: 'Request body was not provided' }, 400)
  }

  const missingFields = checkRequiredFieldsPresent(NewScheduleRequiredFields, requestData.body);
  if (missingFields.length > 0) {
    return getError({ msg: `Missing required fields: ${missingFields}` }, 400);
  }
  const responseData = await repositories.ScheduleRepository.POST_CREATE_ONE(requestData.body);

  if(responseData.error){
    return getError(responseData, responseData.status);
  }
  return getSuccess(responseData);
}

export {
  postNew
};