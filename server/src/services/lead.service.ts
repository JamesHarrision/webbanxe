import { prisma } from '../config/prisma';

// [PUBLIC] Tạo Lead mới từ Form của khách hàng
export const createLead = async (data: any) => {
  // Nếu client gửi lên ngày tháng dạng string, Prisma cần ép kiểu về DateTime
  if (data.preferredDate) {
    data.preferredDate = new Date(data.preferredDate);
  }

  return await prisma.lead.create({
    data,
  });
};

// [ADMIN] Lấy danh sách Leads (Có hỗ trợ lọc theo trạng thái hoặc loại dịch vụ)
export const getLeads = async (filters: { status?: string; serviceType?: string }) => {
  return await prisma.lead.findMany({
    where: {
      ...(filters.status && { status: filters.status }),
      ...(filters.serviceType && { serviceType: filters.serviceType }),
    },
    orderBy: { createdAt: 'desc' }, // Mới nhất lên đầu
  });
};

// [ADMIN] Lấy chi tiết 1 Lead
export const getLeadById = async (id: number) => {
  return await prisma.lead.findUnique({
    where: { id },
  });
};

// [ADMIN] Cập nhật trạng thái Lead (Sale dùng để note lại tiến độ chăm sóc)
export const updateLeadStatus = async (id: number, status: string, notes?: string) => {
  return await prisma.lead.update({
    where: { id },
    data: {
      status,
      // Nếu sale có note thêm thông tin gì thì cập nhật luôn
      ...(notes && { notes })
    },
  });
};

// [ADMIN] Xóa Lead (dùng khi có spam rác)
export const deleteLead = async (id: number) => {
  return await prisma.lead.delete({
    where: { id },
  });
};