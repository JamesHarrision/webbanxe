import { prisma } from '../config/prisma';
import { deleteCloudinaryImages, extractCloudinaryIdsFromHtml, extractPublicIdFromUrl } from '../utils/cloudinary.util';

export const getAccessories = async (isAdmin: boolean = false) => {
  return await prisma.accessory.findMany({
    where: isAdmin ? {} : { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getAccessoryById = async (id: number) => {
  return await prisma.accessory.findUnique({ where: { id } });
};

export const getAccessoryBySlug = async (slug: string) => {
  return await prisma.accessory.findUnique({ where: { slug } });
};

export const createAccessory = async (data: any) => {
  return await prisma.accessory.create({ data });
};

export const updateAccessory = async (id: number, data: any) => {
  // Lấy dữ liệu cũ để so sánh ảnh
  const oldAccessory = await prisma.accessory.findUnique({ where: { id } });
  if (!oldAccessory) throw new Error('Không tìm thấy phụ kiện');

  const result = await prisma.accessory.update({ where: { id }, data });

  // Dọn rác ảnh mồ côi
  const publicIdsToDelete: string[] = [];

  // 1. So sánh thumbnail
  if (data.thumbnail && data.thumbnail !== oldAccessory.thumbnail) {
    const oldThumbId = extractPublicIdFromUrl(oldAccessory.thumbnail);
    if (oldThumbId) publicIdsToDelete.push(oldThumbId);
  }

  // 2. So sánh description (Rich Text images)
  if (data.description && data.description !== oldAccessory.description) {
    const oldHtmlIds = extractCloudinaryIdsFromHtml(oldAccessory.description || '');
    const newHtmlIds = extractCloudinaryIdsFromHtml(data.description);

    // Tìm những ID có trong nội dung cũ nhưng không có trong nội dung mới
    const orphanedIds = oldHtmlIds.filter(id => !newHtmlIds.includes(id));
    publicIdsToDelete.push(...orphanedIds);
  }

  if (publicIdsToDelete.length > 0) {
    deleteCloudinaryImages(publicIdsToDelete);
  }

  return result;
};

export const deleteAccessory = async (id: number) => {
  const accessory = await prisma.accessory.findUnique({ where: { id } });
  if (!accessory) throw new Error('Không tìm thấy phụ kiện');

  const publicIdsToDelete: string[] = [];

  // 1. Thumbnail
  const thumbId = extractPublicIdFromUrl(accessory.thumbnail);
  if (thumbId) publicIdsToDelete.push(thumbId);

  // 2. Description images
  if (accessory.description) {
    const htmlImgIds = extractCloudinaryIdsFromHtml(accessory.description);
    publicIdsToDelete.push(...htmlImgIds);
  }

  const result = await prisma.accessory.delete({ where: { id } });

  if (publicIdsToDelete.length > 0) {
    deleteCloudinaryImages(publicIdsToDelete);
  }

  return result;
};