import {Request} from 'express';

import {NewTrainRequiredFields} from "../../../repositories/train/types";
import {resolveError} from "../../../utils/requests/resolveError";
import {checkRequiredFieldsPresent} from "../../../utils/validation/isRequiredFieldsPresent";
import { repositories } from '../../../repositories';

const postNew = (req: Request) => {
  const missingFields = checkRequiredFieldsPresent(NewTrainRequiredFields, req.body)
  if (missingFields.length > 0) {
    return resolveError(400, { msg: `Missing required fields: ${missingFields}` });
  }
  return repositories.TrainRepository.POST_CREATE_ONE(req.body);
}

export {
  postNew
};