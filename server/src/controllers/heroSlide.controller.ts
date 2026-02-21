import { Request, Response } from 'express';
import * as heroSlideService from '../services/heroSlide.service';

// [PUBLIC] Lấy các slide đang active (cho trang chủ)
export const getPublicHeroSlides = async (req: Request, res: Response): Promise<void> => {
  try {
    const slides = await heroSlideService.getHeroSlides(false);
    res.status(200).json({ success: true, data: slides });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [ADMIN] Lấy tất cả slides
export const getHeroSlides = async (req: Request, res: Response): Promise<void> => {
  try {
    const slides = await heroSlideService.getHeroSlides(true);
    res.status(200).json({ success: true, data: slides });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [ADMIN] Thêm slide mới
export const createHeroSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const slide = await heroSlideService.createHeroSlide(req.body);
    res.status(201).json({ success: true, message: 'Thêm slide thành công', data: slide });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [ADMIN] Cập nhật slide
export const updateHeroSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const slide = await heroSlideService.updateHeroSlide(id, req.body);
    res.status(200).json({ success: true, message: 'Cập nhật slide thành công', data: slide });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [ADMIN] Xóa slide
export const deleteHeroSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await heroSlideService.deleteHeroSlide(id);
    res.status(200).json({ success: true, message: 'Xóa slide thành công' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
