import { z } from 'zod';

export const createLeadSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),
    serviceType: z.enum(['LAI_THU', 'BAO_GIA', 'MUA_BAO_HIEM', 'THUE_XE', 'TRA_GOP', 'THUE_PIN'], {
      error: () => ({ message: 'Loại dịch vụ không hợp lệ' }),
    }),
    email: z.string().email('Email không đúng định dạng').optional().or(z.literal('')),
    carInterest: z.string().optional(),
    preferredDate: z.string().datetime({ message: 'Ngày tháng phải chuẩn ISO 8601' }).optional(),
  }),
});