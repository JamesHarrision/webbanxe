import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Vui lòng chọn ảnh' });
      return;
    }

    const file = req.file;

    // Đẩy buffer từ RAM thẳng lên Cloudinary
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'vinfast_tiengiang' }, // Tất cả ảnh lưu vào folder này
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      // Đọc file và pipe lên stream
      Readable.from(file.buffer).pipe(uploadStream);
    });

    res.status(200).json({
      success: true,
      message: 'Upload thành công',
      url: result.secure_url, // URL này sẽ được nhúng vào TinyMCE
      public_id: result.public_id // Trả về thêm ID để phục vụ việc xóa sau này
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload ảnh từ TinyMCE editor — trả về { location: url } theo đúng format TinyMCE yêu cầu
export const uploadTinymceImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Vui lòng chọn ảnh' });
      return;
    }

    const file = req.file;

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'vinfast_tiengiang' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });

    // TinyMCE expects exactly { location: 'url' }
    res.status(200).json({ location: result.secure_url });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};