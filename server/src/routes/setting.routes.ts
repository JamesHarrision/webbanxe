import { Router } from 'express';
import { getSettings, updateSettings, getPublicSettings, testSMTPConnection } from '../controllers/setting.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Safe fields for public (no SMTP)
router.get('/public', getPublicSettings);

// Admin-only routes
router.get('/test-email', verifyToken, testSMTPConnection);
router.get('/', verifyToken, getSettings);
router.put('/', verifyToken, updateSettings);

export default router;