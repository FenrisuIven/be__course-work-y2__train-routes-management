import { TrainModel } from "../../../models/train";
import {NewTrainRequiredFields} from "../../../models/train/types";
import {resolveError} from "../../../utils/requests/resolveError";
import {checkRequiredFieldsPresent} from "../../../utils/validation/isRequiredFieldsPresent";

const postNew = (reqBody: Record<string, any>) => {
  const trainModel = new TrainModel();
  const missingFields = checkRequiredFieldsPresent(NewTrainRequiredFields, reqBody)
  if (missingFields.length > 0) {
    return resolveError(400, { msg: `Missing required fields: ${missingFields}` });
  }
  return trainModel.POST_CREATE_ONE(reqBody)
}

export {
  postNew
};