import { prisma } from '../config/prisma';

// Lấy danh sách xe (Public thì chỉ lấy xe đang active, Admin thì lấy tất cả)
export const getCars = async (isAdmin: boolean = false) => {
  return await prisma.car.findMany({
    where: isAdmin ? {} : { isActive: true },
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
  return await prisma.car.delete({
    where: { id },
  });
};
