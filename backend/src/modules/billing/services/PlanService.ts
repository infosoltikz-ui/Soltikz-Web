import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PlanService {
  /**
   * Fetch all active subscription plans.
   */
  public static async getAllPlans() {
    return prisma.plan.findMany({ 
      where: { isActive: true },
      orderBy: { monthlyPrice: 'asc' } 
    });
  }

  /**
   * Fetch a specific plan by its name (e.g. 'Free', 'Starter').
   */
  public static async getPlanByName(name: string) {
    return prisma.plan.findUnique({ where: { name } });
  }
}
