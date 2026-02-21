import { Router } from 'express';
import { login, getStats } from '../controllers/admin.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
router.get('/stats', verifyToken, getStats);

export default router;