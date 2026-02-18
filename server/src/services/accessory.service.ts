import { prisma } from '../config/prisma';
import { deleteCloudinaryImages, extractPublicIdFromUrl } from '../utils/cloudinary.util';

export const getAccessories = async (isAdmin: boolean = false) => {
  return await prisma.accessory.findMany({
    where: isAdmin ? {} : { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getAccessoryById = async (id: number) => {
  return await prisma.accessory.findUnique({ where: { id } });
};

export const createAccessory = async (data: any) => {
  return await prisma.accessory.create({ data });
};

export const updateAccessory = async (id: number, data: any) => {
  return await prisma.accessory.update({ where: { id }, data });
};

export const deleteAccessory = async (id: number) => {
  const accessory = await prisma.accessory.findUnique({ where: { id } });
  if (!accessory) throw new Error('Không tìm thấy phụ kiện');

  // Dọn rác ảnh thumbnail trên Cloudinary
  const thumbId = extractPublicIdFromUrl(accessory.thumbnail);

  const result = await prisma.accessory.delete({ where: { id } });

  if (thumbId) deleteCloudinaryImages([thumbId]);

  return result;
};