import { prisma } from '../config/prisma';

export const getInsurances = async (isAdmin: boolean = false) => {
  return await prisma.insurance.findMany({
    where: isAdmin ? {} : { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getInsuranceById = async (id: number) => {
  return await prisma.insurance.findUnique({ where: { id } });
};

export const createInsurance = async (data: any) => {
  return await prisma.insurance.create({ data });
};

export const updateInsurance = async (id: number, data: any) => {
  return await prisma.insurance.update({ where: { id }, data });
};

export const deleteInsurance = async (id: number) => {
  return await prisma.insurance.delete({ where: { id } });
};