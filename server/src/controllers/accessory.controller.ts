import { Request, Response } from 'express';
import * as accessoryService from '../services/accessory.service';

// [PUBLIC/ADMIN] Lấy danh sách phụ kiện
export const getAccessories = async (req: Request, res: Response): Promise<void> => {
  try {
    const isAdmin = (req as any).admin ? true : false;
    const accessories = await accessoryService.getAccessories(isAdmin);
    res.status(200).json({ success: true, data: accessories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [PUBLIC] Lấy chi tiết phụ kiện
export const getAccessory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.params;
    let accessory;

    if (!isNaN(Number(identifier))) {
      accessory = await accessoryService.getAccessoryById(Number(identifier));
    } else {
      accessory = await accessoryService.getAccessoryBySlug(identifier as string);
    }

    if (!accessory) {
      res.status(404).json({ success: false, message: 'Không tìm thấy phụ kiện!' });
      return;
    }

    // Nếu không phải admin và phụ kiện đang bị ẩn (isActive = false) thì chặn
    const isAdmin = (req as any).admin ? true : false;
    if (!isAdmin && !accessory.isActive) {
      res.status(403).json({ success: false, message: 'Phụ kiện này hiện không khả dụng!' });
      return;
    }

    res.status(200).json({ success: true, data: accessory });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [ADMIN] Thêm phụ kiện mới
export const createAccessory = async (req: Request, res: Response): Promise<void> => {
  try {
    const accessory = await accessoryService.createAccessory(req.body);
    res.status(201).json({ success: true, message: 'Thêm phụ kiện thành công', data: accessory });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [ADMIN] Cập nhật phụ kiện
export const updateAccessory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const accessory = await accessoryService.updateAccessory(id, req.body);
    res.status(200).json({ success: true, message: 'Cập nhật phụ kiện thành công', data: accessory });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [ADMIN] Xóa phụ kiện
export const deleteAccessory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await accessoryService.deleteAccessory(id);
    res.status(200).json({ success: true, message: 'Xóa phụ kiện thành công' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};