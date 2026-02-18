import nodemailer from 'nodemailer';
import { prisma } from '../config/prisma';

export const sendEmailNotification = async (subject: string, htmlContent: string) => {
  try {
    // 1. Kéo cấu hình từ Database lên thay vì dùng process.env
    const smtpUser = await prisma.setting.findUnique({ where: { key: 'SMTP_USER' } });
    const smtpPass = await prisma.setting.findUnique({ where: { key: 'SMTP_PASS' } });
    const adminEmail = await prisma.setting.findUnique({ where: { key: 'ADMIN_EMAIL' } });

    // 2. Kiểm tra xem Admin đã cài đặt thông tin chưa
    if (!smtpUser?.value || !smtpPass?.value || !adminEmail?.value) {
      console.log('⚠️ Bỏ qua gửi mail: Quản trị viên chưa cấu hình Email trong Cài đặt hệ thống.');
      return;
    }

    // 3. Khởi tạo transporter động với tài khoản vừa lấy từ DB
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser.value,
        pass: smtpPass.value, // Mật khẩu ứng dụng (App Password)
      },
    });

    // 4. Cấu hình nội dung và gửi
    const mailOptions = {
      from: `"VinFast Tiền Giang" <${smtpUser.value}>`,
      to: adminEmail.value, // Gửi về email nhận thông báo của Admin
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email đã gửi thành công: ' + info.response);
  } catch (error) {
    console.error('❌ Lỗi khi gửi email: ', error);
  }
};