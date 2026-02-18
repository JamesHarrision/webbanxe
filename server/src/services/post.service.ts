import { prisma } from '../config/prisma';
import { deleteCloudinaryImages, extractCloudinaryIdsFromHtml, extractPublicIdFromUrl } from '../utils/cloudinary.util';

// [PUBLIC/ADMIN] Lấy danh sách bài viết
export const getPosts = async (isAdmin: boolean = false) => {
  return await prisma.post.findMany({
    where: isAdmin ? {} : { isPublished: true },
    orderBy: { createdAt: 'desc' },
  });
};

// [PUBLIC] Lấy chi tiết bài viết theo ID hoặc Slug
export const getPostByIdOrSlug = async (identifier: string | number) => {
  if (typeof identifier === 'number') {
    return await prisma.post.findUnique({ where: { id: identifier } });
  }
  return await prisma.post.findUnique({ where: { slug: identifier } });
};

// [ADMIN] Tạo bài viết mới
export const createPost = async (data: any) => {
  return await prisma.post.create({
    data,
  });
};

// [ADMIN] Cập nhật bài viết
export const updatePost = async (id: number, data: any) => {
  return await prisma.post.update({
    where: { id },
    data,
  });
};

// [ADMIN] Xóa bài viết và dọn rác ảnh trên Cloudinary
export const deletePost = async (id: number) => {
  // 1. Lấy thông tin bài viết để lấy link ảnh
  const post = await prisma.post.findUnique({
    where: { id }
  });

  if (!post) throw new Error('Không tìm thấy bài viết');

  const publicIdsToDelete: string[] = [];

  // 2. Lấy ID ảnh Thumbnail
  const thumbId = extractPublicIdFromUrl(post.thumbnail);
  if (thumbId) publicIdsToDelete.push(thumbId);

  // 3. Quét ID ảnh nhúng trong nội dung (TinyMCE)
  if (post.content) {
    const htmlImgIds = extractCloudinaryIdsFromHtml(post.content);
    publicIdsToDelete.push(...htmlImgIds);
  }

  // 4. Xóa bài viết trong DB
  const result = await prisma.post.delete({
    where: { id }
  });

  // 5. Xóa ảnh mồ côi trên Cloudinary (Bất đồng bộ)
  deleteCloudinaryImages(publicIdsToDelete);

  return result;
};