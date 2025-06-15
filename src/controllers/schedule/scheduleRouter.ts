import { Router } from 'express';

import * as scheduleController from './handlers';
import resolveRequest from "../../utils/requests/resolveRequest";
import {handleRequestWithParameters} from "../../utils/requests/handleRequestWithParameters";
import handleSearchInTable from "../../utils/requests/handleSearchInTable";

const scheduleRouter = Router();

scheduleRouter.get('/find', resolveRequest(handleRequestWithParameters(handleSearchInTable('Schedule'))));
scheduleRouter.get('/', resolveRequest(handleRequestWithParameters(scheduleController.scheduleGetAll)));

scheduleRouter.post('/new', resolveRequest(handleRequestWithParameters(scheduleController.postNew)))

export { scheduleRouter };