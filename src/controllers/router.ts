import { Router } from 'express';

import { trainRouter } from "./train";
import { trainStopRouter } from "./trainStop";
import { stationRouter } from "./station";
import { scheduleRouter } from "./schedule";
import { voyageRouter } from "./voyage/voyageRouter";
import { routesRouter } from "./routes";

const router = Router();

router.use('/train', trainRouter);
router.use('/trainStop', trainStopRouter);
router.use('/station', stationRouter)
router.use('/schedule', scheduleRouter);
router.use('/voyage', voyageRouter);
router.use('/routes', routesRouter);

export default router;