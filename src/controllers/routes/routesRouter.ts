import {Router, Request, Response} from 'express';

import * as routesController from './handlers';
import resolveRequest from "../../utils/requests/resolveRequest";
import {handleRequestWithParameters} from "../../utils/requests/handleRequestWithParameters";

const routesRouter = Router();

routesRouter.get('/transfers', resolveRequest(async (req: Request, res: Response) => {
  const result = await routesController.routesGetTransfers(req);
  res.status(result.status || 200).json(result);
}));
routesRouter.get('/', resolveRequest(handleRequestWithParameters(routesController.routesGetAll)));

routesRouter.post('/new', resolveRequest(handleRequestWithParameters(routesController.postNew)))

export { routesRouter };