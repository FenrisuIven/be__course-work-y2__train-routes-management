import { Router, Request, Response } from 'express';

import * as trainController from './handlers';
import resolveRequest from "../../utils/requests/resolveRequest";
import {handleRequestWithIncludes} from "../../utils/requests/modelRequestHandlers/handleRequestWithIncludes";
import {handleRequest} from "../../utils/requests/handleRequest";

const trainRouter = Router();

trainRouter.get('/', resolveRequest(handleRequestWithIncludes(trainController.getAll)));

trainRouter.post('/new', resolveRequest((req: Request, res: Response) => handleRequest(req, res, () => trainController.postNew(req.body))))

export { trainRouter };