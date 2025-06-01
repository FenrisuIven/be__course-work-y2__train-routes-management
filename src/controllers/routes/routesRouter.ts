import { Router } from 'express';

import * as routesController from './handlers';
import resolveRequest from "../../utils/requests/resolveRequest";
import {handleRequestWithParameters} from "../../utils/requests/handleRequestWithParameters";

const routesRouter = Router();

routesRouter.get('/', resolveRequest(handleRequestWithParameters(routesController.routesGetAll)));

routesRouter.post('/new', resolveRequest(handleRequestWithParameters(routesController.postNew)))

export { routesRouter };