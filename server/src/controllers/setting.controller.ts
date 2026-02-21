import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import * as settingService from '../services/setting.service';

// Keys that are safe to expose to the public (NEVER include SMTP or secret keys)
const PUBLIC_SETTING_KEYS = [
  'HOTLINE', 'CONTACT_EMAIL', 'ADDRESS', 'ZALO_URL', 'FACEBOOK_URL',
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