import nodemailer from 'nodemailer';
import { prisma } from '../config/prisma';

export const sendEmailNotification = async (subject: string, htmlContent: string) => {
  try {
    // 1. Kéo toàn bộ cấu hình SMTP từ Database
    const settings = await prisma.setting.findMany({
      where: { key: { in: ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'ADMIN_EMAIL'] } },
    });

    // Chuyển array thành object cho dễ dùng
    const config: Record<string, string> = {};
    settings.forEach(s => { config[s.key] = s.value; });

    console.log('📧 [Mailer] Settings loaded from DB:', {
      SMTP_HOST: config.SMTP_HOST || '(chưa có)',
      SMTP_PORT: config.SMTP_PORT || '(chưa có)',
      SMTP_USER: config.SMTP_USER ? config.SMTP_USER.substring(0, 5) + '***' : '(chưa có)',
      SMTP_PASS: config.SMTP_PASS ? '***' : '(chưa có)',
      ADMIN_EMAIL: config.ADMIN_EMAIL || '(chưa có)',
    });

    // 2. Kiểm tra các trường bắt buộc
    if (!config.SMTP_USER || !config.SMTP_PASS || !config.ADMIN_EMAIL) {
      console.log('⚠️ [Mailer] Bỏ qua: Thiếu SMTP_USER, SMTP_PASS hoặc ADMIN_EMAIL trong Settings.');
      return;
    }

    const smtpHost = config.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(config.SMTP_PORT) || 587;
    const isSecure = smtpPort === 465;

    console.log(`📧 [Mailer] Connecting to ${smtpHost}:${smtpPort} (secure=${isSecure})...`);

    // 3. Khởi tạo transporter động
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: isSecure,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
      tls: {
        // Cho phép self-signed cert (tránh lỗi kết nối nội bộ)
        rejectUnauthorized: false,
      },
    });

    // Verify kết nối trước khi gửi
    await transporter.verify();
    console.log('✅ [Mailer] Kết nối SMTP thành công!');

    // 4. Gửi email
    const mailOptions = {
      from: `"VinFast Tiền Giang" <${config.SMTP_USER}>`,
      to: config.ADMIN_EMAIL,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ [Mailer] Email đã gửi thành công tới ' + config.ADMIN_EMAIL + ' — ' + info.response);
  } catch (error: any) {
    console.error('❌ [Mailer] Lỗi khi gửi email:', error?.message || error);
  }
};