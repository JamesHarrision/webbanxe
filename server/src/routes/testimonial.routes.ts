import { Router } from 'express';
import {
  getPublicTestimonials,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonial.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// =====================================
// PUBLIC ROUTES (Frontend đọc đánh giá)
// =====================================
router.get('/public', getPublicTestimonials);

// =====================================
// PROTECTED ROUTES (Admin quản trị)
// =====================================
router.get('/', verifyToken, getTestimonials);
router.post('/', verifyToken, createTestimonial);
router.put('/:id', verifyToken, updateTestimonial);
router.delete('/:id', verifyToken, deleteTestimonial);

export default router;
