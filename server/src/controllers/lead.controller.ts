import { Request, Response } from 'express';
import * as leadService from '../services/lead.service';

// [PUBLIC] Khách hàng submit Form
export const submitLead = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate cơ bản bắt buộc phải có Tên, SĐT và Loại dịch vụ
    const { fullName, phone, serviceType } = req.body;
    if (!fullName || !phone || !serviceType) {
      res.status(400).json({ success: false, message: 'Họ tên, Số điện thoại và Nhu cầu là bắt buộc!' });
      return;
    }

    const lead = await leadService.createLead(req.body);
    res.status(201).json({ success: true, message: 'Đăng ký thành công! Chúng tôi sẽ liên hệ sớm nhất.', data: lead });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [ADMIN] Lấy danh sách Leads
export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    // Nhận params query từ URL (VD: ?status=NEW&serviceType=LAI_THU)
    const { status, serviceType } = req.query;
    const leads = await leadService.getLeads({
      status: status as string,
      serviceType: serviceType as string
    });

    res.status(200).json({ success: true, data: leads });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [ADMIN] Lấy chi tiết Lead
export const getLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const lead = await leadService.getLeadById(id);

    if (!lead) {
      res.status(404).json({ success: false, message: 'Không tìm thấy thông tin khách hàng!' });
      return;
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [ADMIN] Cập nhật trạng thái
export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { status, notes } = req.body;

    if (!status) {
      res.status(400).json({ success: false, message: 'Vui lòng cung cấp trạng thái mới!' });
      return;
    }

    const updatedLead = await leadService.updateLeadStatus(id, status, notes);
    res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công', data: updatedLead });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [ADMIN] Xóa Lead
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await leadService.deleteLead(id);
    res.status(200).json({ success: true, message: 'Xóa thông tin khách hàng thành công' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};