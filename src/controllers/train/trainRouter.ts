import { Router, Request, Response } from 'express';

import * as trainController from './handlers';
import resolveRequest from "../../utils/resolveRequest";
import {handleRequestWithIncludes} from "../../utils/modelRequestHandlers/handleRequestWithIncludes";

const trainRouter = Router();

trainRouter.get('/', resolveRequest((req: Request, res: Response) => handleRequestWithIncludes(req, res, trainController.getAll)));

export { trainRouter };