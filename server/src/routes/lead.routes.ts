import { Router } from 'express';
import { submitLead, getLeads, getLead, updateStatus, deleteLead } from '../controllers/lead.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createLeadSchema } from '../validations/lead.validation';

const router = Router();

// =====================================
// PUBLIC ROUTES (Frontend gọi khi submit form)
// =====================================
router.post('/', validate(createLeadSchema), submitLead);

// =====================================
// PROTECTED ROUTES (Admin quản lý CRM)
// =====================================
router.get('/', verifyToken, getLeads);
router.get('/:id', verifyToken, getLead);
router.patch('/:id/status', verifyToken, updateStatus); // Dùng PATCH vì chỉ update 1 vài field (status, notes)
router.delete('/:id', verifyToken, deleteLead);

export default router;