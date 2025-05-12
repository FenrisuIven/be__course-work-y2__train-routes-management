import { Router } from 'express';

import * as stationController from './handlers';
import resolveRequest from "../../utils/requests/resolveRequest";
import { handleRequestWithIncludes } from "../../utils/requests/modelRequestHandlers/handleRequestWithIncludes";

const stationRouter = Router();

stationRouter.get('/', resolveRequest(handleRequestWithIncludes(stationController.getAll)));

export { stationRouter };