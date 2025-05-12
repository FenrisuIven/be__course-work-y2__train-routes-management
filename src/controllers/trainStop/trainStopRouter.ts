import { Router, Request, Response } from 'express';

import * as trainStopController from './handlers';
import resolveRequest from "../../utils/requests/resolveRequest";
import {handleRequestWithIncludes} from "../../utils/requests/modelRequestHandlers/handleRequestWithIncludes";
import {handleRequest} from "../../utils/requests/handleRequest";
import {resolveError} from "../../utils/requests/resolveError";

const trainStopRouter = Router();

trainStopRouter.get('/', resolveRequest(handleRequestWithIncludes(trainStopController.getAll)));

trainStopRouter.post('/', resolveRequest(handleRequest(
  () => resolveError(405, {
    message: "TrainStop cannot be created independently, follow to '/station/new' for new Station creation"
  })
)))

export { trainStopRouter };