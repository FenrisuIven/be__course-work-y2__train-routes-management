import { Router, Request, Response } from 'express';

import * as trainStopController from './handlers';
import resolveRequest from "../../utils/resolveRequest";
import {handleRequestWithIncludes} from "../../utils/modelRequestHandlers/handleRequestWithIncludes";

const trainStopRouter = Router();

trainStopRouter.get('/', resolveRequest((req: Request, res: Response) => handleRequestWithIncludes(req, res, trainStopController.getAll)));

export { trainStopRouter };