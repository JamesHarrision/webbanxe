import { Router } from 'express';
import { getInsurances, getInsurance, createInsurance, updateInsurance, deleteInsurance } from '../controllers/insurance.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// =====================================
// PUBLIC ROUTES
// =====================================
router.get('/', getInsurances);
router.get('/:id', getInsurance);

// =====================================
// PROTECTED ROUTES (ADMIN)
// =====================================
router.post('/', verifyToken, createInsurance);
router.put('/:id', verifyToken, updateInsurance);
router.delete('/:id', verifyToken, deleteInsurance);

export default router;