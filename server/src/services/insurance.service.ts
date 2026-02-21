import { prisma } from '../config/prisma';
import { deleteCloudinaryImages, extractCloudinaryIdsFromHtml, extractPublicIdFromUrl } from '../utils/cloudinary.util';

export const getInsurances = async (isAdmin: boolean = false) => {
  return await prisma.insurance.findMany({
    where: isAdmin ? {} : { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getInsuranceById = async (id: number) => {
  return await prisma.insurance.findUnique({ where: { id } });
};

export const getInsuranceBySlug = async (slug: string) => {
  return await prisma.insurance.findUnique({ where: { slug } });
};

export const createInsurance = async (data: any) => {
  return await prisma.insurance.create({ data });
};

export const updateInsurance = async (id: number, data: any) => {
  const oldInsurance = await prisma.insurance.findUnique({ where: { id } });
  if (!oldInsurance) throw new Error('Không tìm thấy bảo hiểm');

  const result = await prisma.insurance.update({ where: { id }, data });

  const publicIdsToDelete: string[] = [];

  // 1. Thumbnail
  if (data.thumbnail && data.thumbnail !== oldInsurance.thumbnail) {
    const oldThumbId = extractPublicIdFromUrl(oldInsurance.thumbnail);
    if (oldThumbId) publicIdsToDelete.push(oldThumbId);
  }

  // 2. Description images
  if (data.description && data.description !== oldInsurance.description) {
    const oldHtmlIds = extractCloudinaryIdsFromHtml(oldInsurance.description || '');
    const newHtmlIds = extractCloudinaryIdsFromHtml(data.description);

    const orphanedIds = oldHtmlIds.filter(id => !newHtmlIds.includes(id));
    publicIdsToDelete.push(...orphanedIds);
  }

  if (publicIdsToDelete.length > 0) {
    deleteCloudinaryImages(publicIdsToDelete);
  }

  return result;
};

export const deleteInsurance = async (id: number) => {
  const insurance = await prisma.insurance.findUnique({ where: { id } });
  if (!insurance) throw new Error('Không tìm thấy bảo hiểm');

  const publicIdsToDelete: string[] = [];

  const thumbId = extractPublicIdFromUrl(insurance.thumbnail);
  if (thumbId) publicIdsToDelete.push(thumbId);

  if (insurance.description) {
    const htmlImgIds = extractCloudinaryIdsFromHtml(insurance.description);
    publicIdsToDelete.push(...htmlImgIds);
  }

  const result = await prisma.insurance.delete({ where: { id } });

  if (publicIdsToDelete.length > 0) {
    deleteCloudinaryImages(publicIdsToDelete);
  }

  return result;
};