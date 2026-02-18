import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/setting.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Toàn bộ Route Settings đều được bảo vệ
router.get('/', verifyToken, getSettings);
router.put('/', verifyToken, updateSettings);

export default router;