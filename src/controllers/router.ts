import { Router } from 'express';

import { trainRouter } from "./train";
import { trainStopRouter } from "./trainStop";
import { stationRouter } from "./station";
import { scheduleRouter } from "./schedule";
import { voyageRouter } from "./voyage/voyageRouter";

const router = Router();

router.use('/train', trainRouter);
router.use('/trainStop', trainStopRouter);
router.use('/station', stationRouter)
router.use('/schedule', scheduleRouter);
router.use('/voyage', voyageRouter);

export default router;