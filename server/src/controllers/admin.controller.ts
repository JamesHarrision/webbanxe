import { Request, Response, RequestHandler } from 'express';
import * as adminService from '../services/admin.service';

export const getStats: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ success: false, message: 'Vui lòng nhập tài khoản và mật khẩu' });
      return;
    }

    const result = await adminService.loginAdmin(username, password);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: result
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};