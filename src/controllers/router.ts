import { Router } from 'express';

import { trainRouter } from "./train";
import { trainStopRouter } from "./trainStop";
import { stationRouter } from "./station";
import { scheduleRouter } from "./schedule";

const router = Router();

router.use('/train', trainRouter);
router.use('/trainStop', trainStopRouter);
router.use('/station', stationRouter)
router.use('/schedule', scheduleRouter);

export default router;