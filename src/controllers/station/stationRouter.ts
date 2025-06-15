import { Router } from 'express';

import * as stationController from './handlers';
import resolveRequest from "../../utils/requests/resolveRequest";
import {handleRequestWithParameters} from "../../utils/requests/handleRequestWithParameters";
import handleSearchInTable from "../../utils/requests/handleSearchInTable";

const stationRouter = Router();

stationRouter.get('/find', resolveRequest(handleRequestWithParameters(handleSearchInTable('Station'))));
stationRouter.get('/', resolveRequest(handleRequestWithParameters(stationController.stationGetAll)));

stationRouter.post('/new', resolveRequest(handleRequestWithParameters(stationController.postNew)));

export { stationRouter };