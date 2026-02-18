import { prisma } from '../config/prisma';

// Lấy tất cả cài đặt và format thành dạng Object cho Frontend dễ xài
export const getAllSettings = async () => {
  const settings = await prisma.setting.findMany();

  // Chuyển array thành object dạng { SMTP_USER: '...', SMTP_PASS: '...' }
  const configObject: Record<string, string> = {};
  settings.forEach(s => {
    configObject[s.key] = s.value;
  });

  return configObject;
};

// Cập nhật nhiều cài đặt cùng lúc
export const updateSettings = async (settingsPayload: { key: string; value: string }[]) => {
  // Dùng $transaction để đảm bảo update tất cả cùng lúc (thành công cả hoặc thất bại cả)
  return await prisma.$transaction(
    settingsPayload.map((setting) =>
      prisma.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value },
      })
    )
  );
};