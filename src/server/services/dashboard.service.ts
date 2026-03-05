import prisma from '../prisma';

export const getDashboardData = async (userId: string) => {
  const [wallet, usageCount, successfulPayments, lastUsages, lastTransactions] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId } }),
    prisma.usageHistory.count({ where: { userId } }),
    prisma.payment.count({ where: { userId, status: 'COMPLETED' } }),
    prisma.usageHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  return {
    walletBalance: wallet?.balance || 0,
    usageCount,
    successfulPayments,
    lastUsages,
    lastTransactions,
  };
};

export const getUsageHistory = async (userId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [total, records] = await Promise.all([
    prisma.usageHistory.count({ where: { userId } }),
    prisma.usageHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  return {
    total,
    page,
    limit,
    records,
  };
};

export const getPaymentHistory = async (userId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [total, records] = await Promise.all([
    prisma.payment.count({ where: { userId } }),
    prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  return {
    total,
    page,
    limit,
    records,
  };
};
