import { Router } from 'express';
import { getCars, getCar, createCar, updateCar, deleteCar } from '../controllers/car.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// =====================================
// PUBLIC ROUTES (Dùng cho Frontend hiển thị)
// =====================================
router.get('/', getCars); // Lấy danh sách (chỉ lấy xe active)
router.get('/:idOrSlug', getCar); // Lấy chi tiết 1 xe theo ID hoặc Slug

// =====================================
// PROTECTED ROUTES (Admin quản trị)
// =====================================
router.post('/', verifyToken, createCar); // Thêm xe (Cần gửi kèm mảng màu sắc nếu có)
router.put('/:id', verifyToken, updateCar); // Sửa xe
router.delete('/:id', verifyToken, deleteCar); // Xóa xe (Sẽ cascade xóa luôn CarColor)

export default router;