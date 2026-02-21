import { prisma } from '../config/prisma';
import { deleteCloudinaryImages, extractPublicIdFromUrl } from '../utils/cloudinary.util';

// Lấy danh sách slide (Public: chỉ active, Admin: tất cả)
export const getHeroSlides = async (isAdmin: boolean = false) => {
  const whereClause = isAdmin ? {} : { isActive: true };

  return await prisma.heroSlide.findMany({
    where: whereClause,
    orderBy: { order: 'asc' },
  });
};

// Lấy chi tiết 1 slide
export const getHeroSlideById = async (id: number) => {
  return await prisma.heroSlide.findUnique({ where: { id } });
};

// Thêm mới slide
export const createHeroSlide = async (data: any) => {
  return await prisma.heroSlide.create({ data });
};

// Cập nhật slide (Nếu đổi ảnh, xóa ảnh cũ trên Cloudinary)
export const updateHeroSlide = async (id: number, data: any) => {
  // 1. Lấy thông tin slide hiện tại
  const existingSlide = await prisma.heroSlide.findUnique({ where: { id } });
  if (!existingSlide) throw new Error('Không tìm thấy slide!');

  // 2. Cập nhật DB trước
  const updatedSlide = await prisma.heroSlide.update({ where: { id }, data });

  // 3. Nếu ảnh đã thay đổi -> xóa ảnh cũ khỏi Cloudinary
  if (data.imageUrl && data.imageUrl !== existingSlide.imageUrl) {
    const oldPublicId = extractPublicIdFromUrl(existingSlide.imageUrl);
    if (oldPublicId) {
      deleteCloudinaryImages([oldPublicId]);
    }
  }

  return updatedSlide;
};

// Xóa slide (Xóa cả ảnh trên Cloudinary)
export const deleteHeroSlide = async (id: number) => {
  // 1. Lấy thông tin slide để biết URL ảnh cần xóa
  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  if (!slide) throw new Error('Không tìm thấy slide!');

  // 2. Xóa bản ghi trong DB
  const result = await prisma.heroSlide.delete({ where: { id } });

  // 3. Xóa ảnh trên Cloudinary
  const publicId = extractPublicIdFromUrl(slide.imageUrl);
  if (publicId) {
    deleteCloudinaryImages([publicId]);
  }

  return result;
};
