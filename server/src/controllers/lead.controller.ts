import { Request, Response } from 'express';
import * as leadService from '../services/lead.service';
import { sendEmailNotification } from '../utils/mailer.util';

// [PUBLIC] Khách hàng submit Form
export const submitLead = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Lấy data từ request
    const { fullName, phone, serviceType, email, carInterest, preferredDate, location, notes } = req.body;

    // (Giả sử bạn đã có middleware Zod validate ở Route, nên vào tới đây data đã sạch)

    // 2. Lưu vào Database
    const lead = await leadService.createLead(req.body);

    // 3. Chuẩn bị nội dung Email thông báo
    const subject = `🔥 Có Khách Hàng Mới Đăng Ký: ${serviceType}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: #1a73e8; text-align: center;">Thông báo Khách hàng mới</h2>
        <p>Hệ thống vừa ghi nhận một khách hàng mới đăng ký qua Website:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Họ tên:</td><td style="padding: 8px; border: 1px solid #ddd;">${fullName}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Số điện thoại:</td><td style="padding: 8px; border: 1px solid #ddd;">${phone}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Nhu cầu:</td><td style="padding: 8px; border: 1px solid #ddd; color: red;">${serviceType}</td></tr>
          ${notes ? `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Ghi chú:</td><td style="padding: 8px; border: 1px solid #ddd;">${notes}</td></tr>` : ''}
        </table>
      </div>
    `;

    // 4. Bắn Email ngầm (Nó sẽ tự check DB xem có tài khoản không rồi mới gửi)
    sendEmailNotification(subject, htmlContent).catch(err => {
      console.error("Mail worker failed:", err);
    });

    // 5. Phản hồi cho Frontend ngay lập tức
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