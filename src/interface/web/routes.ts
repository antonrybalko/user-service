import { Router } from 'express';
import { router as v1Router } from './routesV1';

const router = Router();
router.use('/v1', v1Router);

export { router };
