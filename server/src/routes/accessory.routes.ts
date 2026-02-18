import { Router } from 'express';
import { getAccessories, getAccessory, createAccessory, updateAccessory, deleteAccessory } from '../controllers/accessory.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// =====================================
// PUBLIC ROUTES
// =====================================
router.get('/', getAccessories);
router.get('/:id', getAccessory);

// =====================================
// PROTECTED ROUTES (ADMIN)
// =====================================
router.post('/', verifyToken, createAccessory);
router.put('/:id', verifyToken, updateAccessory);
router.delete('/:id', verifyToken, deleteAccessory);

export default router;