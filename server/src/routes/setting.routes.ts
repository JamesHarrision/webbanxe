import { Router } from 'express';
import { getSettings, updateSettings, getPublicSettings } from '../controllers/setting.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// PUBLIC route - no auth required, only returns safe fields (no SMTP)
router.get('/public', getPublicSettings);

// Admin-only routes
router.get('/', verifyToken, getSettings);
router.put('/', verifyToken, updateSettings);

export default router;