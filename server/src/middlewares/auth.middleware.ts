import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Mở rộng interface Request của Express để nhét thêm thông tin admin vào
export interface AuthRequest extends Request {
  admin?: { id: number; username: string };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Không tìm thấy token xác thực!' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; username: string };
    req.admin = decoded; // Lưu thông tin admin vào request để dùng ở các controller sau
    next(); // Cho phép đi tiếp
  } catch (error) {
    res.status(403).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
};

export const optionalVerifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; username: string };
    req.admin = decoded;
    next();
  } catch (error) {
    next();
  }
};