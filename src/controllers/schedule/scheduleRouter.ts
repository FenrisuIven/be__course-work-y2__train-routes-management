import { Router } from 'express';

import * as scheduleController from './handlers';
import resolveRequest from "../../utils/requests/resolveRequest";
import {handleRequestWithParameters} from "../../utils/requests/handleRequestWithParameters";

const scheduleRouter = Router();

scheduleRouter.get('/', resolveRequest(handleRequestWithParameters(scheduleController.scheduleGetAll)));
scheduleRouter.get('/find', resolveRequest(handleRequestWithParameters(scheduleController.scheduleFind)));

scheduleRouter.post('/new', resolveRequest(handleRequestWithParameters(scheduleController.postNew)))

export { scheduleRouter };