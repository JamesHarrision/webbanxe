import multer from 'multer';

// Lưu file tạm vào bộ nhớ RAM
const storage = multer.memoryStorage();

export const uploadFile = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB/ảnh
});