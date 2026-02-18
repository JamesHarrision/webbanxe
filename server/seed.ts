import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('68686868', 10);

  await prisma.admin.upsert({
    where: { username: 'a3thanhphuong' },
    update: {},
    create: {
      username: 'a3thanhphuong',
      password: hashedPassword,
      name: 'Super Admin',
    },
  });
  console.log('✅ Đã tạo tài khoản admin thành công');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());