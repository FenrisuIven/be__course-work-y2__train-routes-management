import { Router } from 'express';

import * as scheduleController from './handlers';
import resolveRequest from "../../utils/requests/resolveRequest";
import { handleRequestWithIncludes } from "../../utils/requests/modelRequestHandlers/handleRequestWithIncludes";
import {handleRequest} from "../../utils/requests/handleRequest";

const scheduleRouter = Router();

scheduleRouter.get('/', resolveRequest(handleRequestWithIncludes(scheduleController.getAll)));

scheduleRouter.post('/new', resolveRequest(handleRequest(scheduleController.postNew)))

export { scheduleRouter };