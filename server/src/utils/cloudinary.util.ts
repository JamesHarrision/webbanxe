import cloudinary from '../config/cloudinary';

// Hàm bóc tách public_id từ 1 URL cụ thể
export const extractPublicIdFromUrl = (url: string): string | null => {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  const parts = url.split('/upload/');
  if (parts.length !== 2) return null;

  let path = parts[1];
  path = path.replace(/^v\d+\//, ''); // Xóa version (VD: v1681234/)
  return path.split('.').slice(0, -1).join('.'); // Cắt bỏ đuôi file (.png, .jpg)
};

// Hàm quét toàn bộ bài viết HTML (TinyMCE) để tìm các link Cloudinary
export const extractCloudinaryIdsFromHtml = (htmlContent: string): string[] => {
  if (!htmlContent) return [];
  const publicIds: string[] = [];

  // Regex tìm tất cả các chuỗi bắt đầu bằng src=" và kết thúc bằng "
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let match;

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    const url = match[1];
    const publicId = extractPublicIdFromUrl(url);
    if (publicId) publicIds.push(publicId);
  }

  return publicIds;
};

// Hàm xóa hàng loạt ảnh
export const deleteCloudinaryImages = async (publicIds: string[]) => {
  if (!publicIds || publicIds.length === 0) return;
  try {
    // Gọi API cloudinary xóa tất cả ID cùng lúc
    await Promise.all(publicIds.map(id => cloudinary.uploader.destroy(id)));
    console.log(`Đã dọn dẹp ${publicIds.length} ảnh trên Cloudinary`);
  } catch (error) {
    console.error("Lỗi dọn rác Cloudinary: ", error);
  }
};