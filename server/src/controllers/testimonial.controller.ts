import { Request, Response } from 'express';
import * as testimonialService from '../services/testimonial.service';

// [PUBLIC] Lấy các đánh giá đang active
export const getPublicTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await testimonialService.getTestimonials(false);
    res.status(200).json({ success: true, data: testimonials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [ADMIN] Lấy tất cả đánh giá
export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await testimonialService.getTestimonials(true);
    res.status(200).json({ success: true, data: testimonials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [ADMIN] Thêm đánh giá mới
export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonial = await testimonialService.createTestimonial(req.body);
    res.status(201).json({ success: true, message: 'Thêm đánh giá thành công', data: testimonial });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [ADMIN] Cập nhật đánh giá
export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const testimonial = await testimonialService.updateTestimonial(id, req.body);
    res.status(200).json({ success: true, message: 'Cập nhật đánh giá thành công', data: testimonial });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [ADMIN] Xóa đánh giá
export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await testimonialService.deleteTestimonial(id);
    res.status(200).json({ success: true, message: 'Xóa đánh giá thành công' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
