import { Router } from 'express';

import { trainRouter } from "./train";
import { trainStopRouter } from "./trainStop";
import { stationRouter } from "./station";

const router = Router();

router.use('/train', trainRouter);
router.use('/trainStop', trainStopRouter);
router.use('/station', stationRouter)

export default router;