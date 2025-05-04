import { Router } from 'express';

import * as trainController from './handlers';
import handleRequest from "../../utils/handleRequest";

const trainRouter = Router();

trainRouter.get('/', handleRequest(trainController.getAll));

export default trainRouter;