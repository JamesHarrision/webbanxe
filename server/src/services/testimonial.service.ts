import { prisma } from '../config/prisma';
import { deleteCloudinaryImages, extractPublicIdFromUrl } from '../utils/cloudinary.util';

// Lấy danh sách đánh giá (Public: chỉ active, Admin: tất cả)
export const getTestimonials = async (isAdmin: boolean = false) => {
  const whereClause = isAdmin ? {} : { isActive: true };

  return await prisma.testimonial.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
};

// Lấy chi tiết 1 đánh giá
export const getTestimonialById = async (id: number) => {
  return await prisma.testimonial.findUnique({ where: { id } });
};

// Thêm mới đánh giá
export const createTestimonial = async (data: any) => {
  return await prisma.testimonial.create({ data });
};

// Cập nhật đánh giá (Nếu đổi avatar/deliveryImage, xóa ảnh cũ trên Cloudinary)
export const updateTestimonial = async (id: number, data: any) => {
  // 1. Lấy thông tin hiện tại
  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) throw new Error('Không tìm thấy đánh giá!');

  // 2. Cập nhật DB trước
  const updated = await prisma.testimonial.update({ where: { id }, data });

  // 3. Thu thập các ảnh cũ cần xóa (chỉ khi bị thay thế)
  const toDelete: string[] = [];

  if (data.avatar !== undefined && data.avatar !== existing.avatar) {
    const oldId = extractPublicIdFromUrl(existing.avatar ?? '');
    if (oldId) toDelete.push(oldId);
  }

  if (data.deliveryImage !== undefined && data.deliveryImage !== existing.deliveryImage) {
    const oldId = extractPublicIdFromUrl(existing.deliveryImage ?? '');
    if (oldId) toDelete.push(oldId);
  }

  if (toDelete.length > 0) {
    deleteCloudinaryImages(toDelete);
  }

  return updated;
};

// Xóa đánh giá (Xóa cả avatar và deliveryImage trên Cloudinary)
export const deleteTestimonial = async (id: number) => {
  // 1. Lấy thông tin để xóa ảnh
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) throw new Error('Không tìm thấy đánh giá!');

  // 2. Xóa bản ghi trong DB
  const result = await prisma.testimonial.delete({ where: { id } });

  // 3. Xóa cả avatar và deliveryImage khỏi Cloudinary (Promise.all)
  const toDelete: string[] = [];
  const avatarId = extractPublicIdFromUrl(testimonial.avatar ?? '');
  const deliveryId = extractPublicIdFromUrl(testimonial.deliveryImage ?? '');
  if (avatarId) toDelete.push(avatarId);
  if (deliveryId) toDelete.push(deliveryId);

  if (toDelete.length > 0) {
    await Promise.all(toDelete.map(pid => require('../config/cloudinary').default.uploader.destroy(pid)));
    console.log(`Đã dọn dẹp ${toDelete.length} ảnh testimonial trên Cloudinary`);
  }

  return result;
};
