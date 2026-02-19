import { prisma } from '../config/prisma';
import { deleteCloudinaryImages, extractCloudinaryIdsFromHtml, extractPublicIdFromUrl } from '../utils/cloudinary.util';

// Lấy danh sách xe (Public thì chỉ lấy xe đang active, Admin thì lấy tất cả)
export const getCars = async (isAdmin: boolean = false) => {
  // If isAdmin is true, we pass an empty object to where, effectively selecting all.
  // If isAdmin is false, we filter by isActive: true.
  const whereClause = isAdmin ? {} : { isActive: true };

  return await prisma.car.findMany({
    where: whereClause,
    include: { colors: true },
    orderBy: { createdAt: 'desc' },
  });
};

// Lấy chi tiết 1 xe (theo ID hoặc Slug)
export const getCarByIdOrSlug = async (identifier: string | number) => {
  if (typeof identifier === 'number') {
    return await prisma.car.findUnique({ where: { id: identifier }, include: { colors: true } });
  }
  return await prisma.car.findUnique({ where: { slug: identifier }, include: { colors: true } });
};

// Thêm mới xe kèm màu sắc
export const createCar = async (data: any) => {
  const { colors, ...carData } = data;
  return await prisma.car.create({
    data: {
      ...carData,
      // Nếu có mảng colors thì tạo luôn các bản ghi CarColor (Nested Create)
      colors: colors && colors.length > 0 ? { create: colors } : undefined,
    },
    include: { colors: true },
  });
};

// Cập nhật xe (Sử dụng Transaction để xóa màu cũ, thêm màu mới cho an toàn)
export const updateCar = async (id: number, data: any) => {
  const { colors, ...carData } = data;

  return await prisma.$transaction(async (tx) => {
    // Nếu có truyền mảng colors mới, ta xóa hết màu cũ của xe này đi
    if (colors) {
      await tx.carColor.deleteMany({ where: { carId: id } });
    }

    // Cập nhật thông tin xe và tạo lại màu mới
    return await tx.car.update({
      where: { id },
      data: {
        ...carData,
        ...(colors ? { colors: { create: colors } } : {}),
      },
      include: { colors: true },
    });
  });
};

// Xóa xe (Prisma sẽ tự động xóa các CarColor liên quan do ta đã set onDelete: Cascade trong schema)
export const deleteCar = async (id: number) => {
  // 1. Lấy thông tin xe (bao gồm mô tả HTML và các ảnh con) để chuẩn bị xóa ảnh
  const car = await prisma.car.findUnique({
    where: { id },
    include: { colors: true }
  });

  if (!car) throw new Error('Không tìm thấy xe');

  // 2. Thu thập ID ảnh cần xóa
  const publicIdsToDelete: string[] = [];

  // Thumbnail của xe
  const thumbId = extractPublicIdFromUrl(car.thumbnail);
  if (thumbId) publicIdsToDelete.push(thumbId);

  // Ảnh biến thể màu sắc
  car.colors.forEach(color => {
    const colorImgId = extractPublicIdFromUrl(color.imageUrl);
    if (colorImgId) publicIdsToDelete.push(colorImgId);
  });

  // Ảnh nhúng trong nội dung TinyMCE (Bài toán quét Regex)
  if (car.description) {
    const htmlImgIds = extractCloudinaryIdsFromHtml(car.description);
    publicIdsToDelete.push(...htmlImgIds);
  }

  // 3. Xóa dữ liệu xe trong MySQL trước
  const result = await prisma.car.delete({
    where: { id }
  });

  // 4. Xóa ảnh trên Cloudinary (Chạy bất đồng bộ, không dùng await để ko làm nghẽn API Response của Admin)
  deleteCloudinaryImages(publicIdsToDelete);

  return result;
};
