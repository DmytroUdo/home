import prisma from '../prisma';
import bcrypt from 'bcryptjs';

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallet: true,
      _count: {
        select: { usageHistory: true },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const totalPayments = await prisma.payment.aggregate({
    where: { userId, status: 'COMPLETED' },
    _sum: { amount: true },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    walletBalance: user.wallet?.balance || 0,
    totalUsageCount: user._count.usageHistory,
    totalPaymentsAmount: totalPayments._sum.amount || 0,
  };
};

export const updateProfile = async (userId: string, name?: string, oldPassword?: string, newPassword?: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  const updateData: any = {};

  if (name) {
    updateData.name = name;
  }

  if (oldPassword && newPassword) {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error('Invalid old password');
    }
    updateData.password = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return updatedUser;
};
