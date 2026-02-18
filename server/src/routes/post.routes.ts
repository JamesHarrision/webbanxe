import { Router } from 'express';
import { getPosts, getPost, createPost, updatePost, deletePost } from '../controllers/post.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// =====================================
// PUBLIC ROUTES (Frontend đọc bài viết)
// =====================================
router.get('/', getPosts);
router.get('/:idOrSlug', getPost);

// =====================================
// PROTECTED ROUTES (Admin quản trị)
// =====================================
router.post('/', verifyToken, createPost);
router.put('/:id', verifyToken, updatePost);
router.delete('/:id', verifyToken, deletePost);

export default router;