import { Router } from 'express';

import * as stationController from './handlers';
import resolveRequest from "../../utils/requests/resolveRequest";
import {handleRequestWithParameters} from "../../utils/requests/handleRequestWithParameters";

const stationRouter = Router();

stationRouter.get('/', resolveRequest(handleRequestWithParameters(stationController.stationGetAll)));

stationRouter.post('/new', resolveRequest(handleRequestWithParameters(stationController.postNew)));

export { stationRouter };