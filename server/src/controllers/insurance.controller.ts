import { Request, Response } from 'express';
import * as insuranceService from '../services/insurance.service';

// [PUBLIC/ADMIN] Lấy danh sách gói bảo hiểm
export const getInsurances = async (req: Request, res: Response): Promise<void> => {
  try {
    const isAdmin = (req as any).admin ? true : false;
    const insurances = await insuranceService.getInsurances(isAdmin);
    res.status(200).json({ success: true, data: insurances });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [PUBLIC] Lấy chi tiết gói bảo hiểm
export const getInsurance = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const insurance = await insuranceService.getInsuranceById(id);

    if (!insurance) {
      res.status(404).json({ success: false, message: 'Không tìm thấy gói bảo hiểm!' });
      return;
    }

    const isAdmin = (req as any).admin ? true : false;
    if (!isAdmin && !insurance.isActive) {
      res.status(403).json({ success: false, message: 'Gói bảo hiểm này hiện không khả dụng!' });
      return;
    }

    res.status(200).json({ success: true, data: insurance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [ADMIN] Thêm gói bảo hiểm mới
export const createInsurance = async (req: Request, res: Response): Promise<void> => {
  try {
    const insurance = await insuranceService.createInsurance(req.body);
    res.status(201).json({ success: true, message: 'Thêm gói bảo hiểm thành công', data: insurance });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [ADMIN] Cập nhật gói bảo hiểm
export const updateInsurance = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const insurance = await insuranceService.updateInsurance(id, req.body);
    res.status(200).json({ success: true, message: 'Cập nhật gói bảo hiểm thành công', data: insurance });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [ADMIN] Xóa gói bảo hiểm
export const deleteInsurance = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await insuranceService.deleteInsurance(id);
    res.status(200).json({ success: true, message: 'Xóa gói bảo hiểm thành công' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};