import prisma from '../prisma';

export const getMetrics = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. MRR (Monthly Recurring Revenue)
  const activeSubscriptions = await prisma.subscription.findMany({
    where: { status: 'ACTIVE' },
  });

  let mrr = 0;
  for (const sub of activeSubscriptions) {
    // Basic calculation: PRO=$10, ENTERPRISE=$50
    if (sub.plan === 'PRO') mrr += 10;
    if (sub.plan === 'ENTERPRISE') mrr += 50;
  }

  // 2. Conversion Rate (Users with active sub / Total Users)
  const totalUsers = await prisma.user.count();
  const payingUsers = await prisma.subscription.count({ where: { status: 'ACTIVE' } });
  const conversionRate = totalUsers > 0 ? (payingUsers / totalUsers) * 100 : 0;

  // 3. CAC (Customer Acquisition Cost) - Mocked for now, usually requires marketing spend data
  const marketingSpend = 1000; // Example: $1000 spent this month
  const newUsersThisMonth = await prisma.user.count({
    where: { createdAt: { gte: startOfMonth } },
  });
  const cac = newUsersThisMonth > 0 ? marketingSpend / newUsersThisMonth : 0;

  // 4. LTV (Life Time Value) - Average Revenue Per User * Average Customer Lifespan
  const totalRevenue = await prisma.payment.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { amount: true },
  });
  const arpu = payingUsers > 0 ? (totalRevenue._sum.amount || 0) / payingUsers : 0;
  // Assume average lifespan is 12 months for this example
  const ltv = arpu * 12;

  // 5. Retention Rate
  const usersStartOfMonth = await prisma.user.count({
    where: { createdAt: { lt: startOfMonth } },
  });
  const usersEndOfMonth = await prisma.user.count({
    where: { createdAt: { lte: now } },
  });
  const newUsers = newUsersThisMonth;

  const retentionRate = usersStartOfMonth > 0
    ? ((usersEndOfMonth - newUsers) / usersStartOfMonth) * 100
    : 100;

  return {
    mrr,
    conversionRate: conversionRate.toFixed(2) + '%',
    cac: cac.toFixed(2),
    ltv: ltv.toFixed(2),
    retentionRate: retentionRate.toFixed(2) + '%',
    totalUsers,
    payingUsers,
  };
};
