import { Request, Response } from 'express';
import * as carService from '../services/car.service';

// [PUBLIC/ADMIN] Lấy danh sách xe
export const getCars = async (req: Request, res: Response): Promise<void> => {
  try {
    // Kiểm tra xem request này có đi qua middleware verifyToken không (có req.admin)
    const isAdmin = (req as any).admin ? true : false;
    const cars = await carService.getCars(isAdmin);

    res.status(200).json({ success: true, data: cars });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [PUBLIC] Lấy chi tiết xe
export const getCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idOrSlug } = req.params;
    // Kiểm tra xem param là số (id) hay chuỗi (slug)
    const identifier = isNaN(Number(idOrSlug)) ? idOrSlug : Number(idOrSlug);

    const car = await carService.getCarByIdOrSlug(identifier as string | number);
    if (!car) {
      res.status(404).json({ success: false, message: 'Không tìm thấy xe!' });
      return;
    }

    res.status(200).json({ success: true, data: car });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [ADMIN] Thêm xe mới
export const createCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const car = await carService.createCar(req.body);
    res.status(201).json({ success: true, message: 'Thêm xe thành công', data: car });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [ADMIN] Cập nhật xe
export const updateCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const car = await carService.updateCar(id, req.body);
    res.status(200).json({ success: true, message: 'Cập nhật xe thành công', data: car });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [ADMIN] Xóa xe
export const deleteCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await carService.deleteCar(id);
    res.status(200).json({ success: true, message: 'Xóa xe thành công' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};