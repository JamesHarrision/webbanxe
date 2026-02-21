import { prisma } from '../config/prisma';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

// [ADMIN] Dashboard thống kê
export const getDashboardStats = async () => {
  const [totalCars, totalPosts, totalLeads, newLeads] = await Promise.all([
    prisma.car.count(),
    prisma.post.count(),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'NEW' } }),
  ]);

  return { totalCars, totalPosts, totalLeads, newLeads };
};

export const loginAdmin = async (username: string, password: string) => {
  // 1. Tìm admin trong DB
  const admin = await prisma.admin.findUnique({
    where: {
      username,
    },
  });

  if (!admin) {
    throw new Error('Sai tài khoản hoặc mật khẩu!');
  }

  // 2. So sánh mật khẩu
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error('Sai tài khoản hoặc mật khẩu!');
  }

  // 3. Tạo JWT Token
  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' } as jwt.SignOptions
  );

  return {
    admin: { id: admin.id, username: admin.username, name: admin.name },
    token
  };
} 