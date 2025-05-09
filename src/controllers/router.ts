import { Router } from 'express';

import { trainRouter } from "./train";

const router = Router();

router.use('/train', trainRouter);

export default router;