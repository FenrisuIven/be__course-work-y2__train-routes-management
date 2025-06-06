import { Router } from 'express';

import * as trainStopController from './handlers';
import resolveRequest from "../../utils/requests/resolveRequest";
import {handleRequestWithParameters} from "../../utils/requests/handleRequestWithParameters";
import {getResponseMessage} from "../../utils/responses/getResponseMessage";

const trainStopRouter = Router();

trainStopRouter.get('/', resolveRequest(handleRequestWithParameters(trainStopController.trainStopGetAll)));

trainStopRouter.post('/new', resolveRequest((req,res) => {
  const responseData = getResponseMessage({message: "TrainStop cannot be created independently, follow to '/station/new' for new Station creation"}, 405)
  res.status(405).json(responseData)
}))

export { trainStopRouter };