import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import * as settingService from '../services/setting.service';

// Keys that are safe to expose to the public (NEVER include SMTP or secret keys)
const PUBLIC_SETTING_KEYS = [
  'HOTLINE', 'CONTACT_EMAIL', 'ADDRESS', 'ZALO_URL', 'FACEBOOK_URL',
  'TIKTOK_URL', 'YOUTUBE_URL',
  'WEBSITE_NAME', 'FOUNDER_NAME', 'ROLE', 'ABOUT_TEXT', 'DISCLAIMER', 'BRANCHES',
];

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

export const getPublicSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: PUBLIC_SETTING_KEYS } },
    });

    // Convert to object
    const configObject: Record<string, string> = {};
    settings.forEach(s => {
      configObject[s.key] = s.value;
    });

    res.status(200).json({ success: true, data: configObject });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const testSMTPConnection = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'ADMIN_EMAIL'] } },
    });
    const config: Record<string, string> = {};
    settings.forEach(s => { config[s.key] = s.value; });

    const requiredKeys = ['SMTP_USER', 'SMTP_PASS', 'ADMIN_EMAIL'];
    const missingKeys = requiredKeys.filter(k => !config[k]);

    if (missingKeys.length > 0) {
      res.status(400).json({
        success: false,
        message: `Thiếu cấu hình SMTP trong database: ${missingKeys.join(', ')}`,
        missingKeys
      });
      return;
    }

    // Dynamic import
    const { sendEmailNotification } = require('../utils/mailer.util');

    const result = await sendEmailNotification(
      '🔍 [TEST] Kiểm tra cấu hình SMTP',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
          <h2 style="color: #1a73e8; text-align: center;">Hệ Thống Gửi Mail Hoạt Động!</h2>
          <p>Chúc mừng! Nếu bạn nhận được email này, nghĩa là cấu hình SMTP của bạn đã chính xác.</p>
          <hr/>
          <p style="font-size: 12px; color: #777;">
            Thời gian kiểm tra: ${new Date().toLocaleString('vi-VN')}
          </p>
        </div>
      `
    );

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Kết nối SMTP thành công! Email kiểm tra đã được gửi.',
        data: result
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Kết nối SMTP thất bại: ' + result.message,
        error: result
      });
    }
  } catch (error: any) {
    console.error("Test SMTP error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
