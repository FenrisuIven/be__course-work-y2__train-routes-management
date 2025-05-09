import { Router } from 'express';

import { trainRouter } from "./train";
import { trainStopRouter } from "./trainStop";

const router = Router();

router.use('/train', trainRouter);
router.use('/trainStop', trainStopRouter);

export default router;