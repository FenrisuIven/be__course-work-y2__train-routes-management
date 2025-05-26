import { Router } from 'express';

import * as voyageController from './handlers';
import resolveRequest from "../../utils/requests/resolveRequest";
import {handleRequestWithParameters} from "../../utils/requests/handleRequestWithParameters";

const voyageRouter = Router();

voyageRouter.get('/', resolveRequest(handleRequestWithParameters(voyageController.voyageGetAll)));

voyageRouter.post('/new', resolveRequest(handleRequestWithParameters(voyageController.postNew)))

export { voyageRouter };