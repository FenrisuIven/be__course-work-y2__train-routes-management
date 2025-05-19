import { Router } from 'express';

import * as trainStopController from './handlers';
import resolveRequest from "../../utils/requests/resolveRequest";
import {getError} from "../../utils/responses/getError";
import {handleRequestWithParameters} from "../../utils/requests/handleRequestWithParameters";

const trainStopRouter = Router();

trainStopRouter.get('/', resolveRequest(handleRequestWithParameters(trainStopController.trainStopGetAll)));

trainStopRouter.post('/', resolveRequest((req,res) => {
  const responseData = getError({message: "TrainStop cannot be created independently, follow to '/station/new' for new Station creation"}, 405)
  res.status(405).json(responseData)
}))

export { trainStopRouter };