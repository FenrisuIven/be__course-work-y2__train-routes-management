import {Request} from 'express';

import {resolveError} from "../../../utils/requests/resolveError";
import {checkRequiredFieldsPresent} from "../../../utils/validation/isRequiredFieldsPresent";
import {repositories} from '../../../repositories';
import {NewScheduleRequiredFields} from "../../../repositories/schedule/types";

const postNew = (req: Request) => {
  const missingFields = checkRequiredFieldsPresent(NewScheduleRequiredFields, req.body)
  if (missingFields.length > 0) {
    return resolveError(400, { msg: `Missing required fields: ${missingFields}` });
  }
  return repositories.ScheduleRepository.POST_CREATE_ONE(req.body);
}

export {
  postNew
};