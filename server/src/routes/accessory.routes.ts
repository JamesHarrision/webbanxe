import { Router } from 'express';
import { getAccessories, getAccessory, createAccessory, updateAccessory, deleteAccessory } from '../controllers/accessory.controller';
import { verifyToken, optionalVerifyToken } from '../middlewares/auth.middleware';

const router = Router();

// =====================================
// PUBLIC ROUTES
// =====================================
router.get('/', optionalVerifyToken, getAccessories);
router.get('/:identifier', getAccessory);

// =====================================
// PROTECTED ROUTES (ADMIN)
// =====================================
router.post('/', verifyToken, createAccessory);
router.put('/:id', verifyToken, updateAccessory);
router.delete('/:id', verifyToken, deleteAccessory);

export default router;