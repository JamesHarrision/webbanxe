import { Router } from 'express';
import { uploadImage, uploadTinymceImage } from '../controllers/upload.controller';
import { uploadFile } from '../middlewares/upload.middleware';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Phải có Token mới được upload, tên field file gửi lên là 'image'
router.post('/image', verifyToken, uploadFile.single('image'), uploadImage);

// Upload ảnh từ TinyMCE editor, field gửi lên là 'file'
router.post('/tinymce', verifyToken, uploadFile.single('file'), uploadTinymceImage);

export default router;