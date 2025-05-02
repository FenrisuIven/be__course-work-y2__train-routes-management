import { Router } from 'express';

import trainRoutes from '../routes/train/trainRoutes';
import asyncHandler from "../utils/asyncHandler";

const router = Router();

router.get('/train', asyncHandler(trainRoutes.getAll))

export default router;