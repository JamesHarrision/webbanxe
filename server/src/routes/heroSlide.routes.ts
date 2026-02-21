import { Router } from 'express';
import {
  getPublicHeroSlides,
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} from '../controllers/heroSlide.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// =====================================
// PUBLIC ROUTES (Frontend đọc slide)
// =====================================
router.get('/public', getPublicHeroSlides);

// =====================================
// PROTECTED ROUTES (Admin quản trị)
// =====================================
router.get('/', verifyToken, getHeroSlides);
router.post('/', verifyToken, createHeroSlide);
router.put('/:id', verifyToken, updateHeroSlide);
router.delete('/:id', verifyToken, deleteHeroSlide);

export default router;
