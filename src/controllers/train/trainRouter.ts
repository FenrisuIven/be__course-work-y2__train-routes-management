import { Router, Request, Response } from 'express';

import * as trainController from './handlers';
import resolveRequest from "../../utils/requests/resolveRequest";
import {handleRequestWithParameters} from "../../utils/requests/handleRequestWithParameters";

const trainRouter = Router();

trainRouter.get('/', resolveRequest(handleRequestWithParameters(trainController.trainGetAll)));

trainRouter.post('/new', resolveRequest(handleRequestWithParameters(trainController.postNew)))

export { trainRouter };