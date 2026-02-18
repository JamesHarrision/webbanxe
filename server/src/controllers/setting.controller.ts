import { Request, Response } from 'express';
import * as settingService from '../services/setting.service';

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await settingService.getAllSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    // Frontend sẽ gửi lên body dạng: { settings: [{ key: 'SMTP_USER', value: 'admin@gmail.com' }, ...] }
    const { settings } = req.body;

    if (!settings || !Array.isArray(settings)) {
      res.status(400).json({ success: false, message: 'Dữ liệu cài đặt không hợp lệ!' });
      return;
    }

    await settingService.updateSettings(settings);
    res.status(200).json({ success: true, message: 'Lưu cài đặt hệ thống thành công!' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};