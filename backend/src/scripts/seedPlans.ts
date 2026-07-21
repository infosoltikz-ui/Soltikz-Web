import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const plans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Basic Templates',
      'Community Support'
    ],
    limits: {
      resumes: 1,
      coverLetters: 2,
      aiGenerations: 5,
      atsScans: 3
    }
  },
  {
    name: 'Starter',
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    features: [
      'Premium Templates',
      'Email Support'
    ],
    limits: {
      resumes: 10,
      coverLetters: 30,
      aiGenerations: 100,
      atsScans: 50
    }
  },
  {
    name: 'Pro',
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    features: [
      'Resume Analytics',
      'Priority Processing'
    ],
    limits: {
      resumes: -1,
      coverLetters: -1,
      aiGenerations: -1,
      atsScans: -1
    }
  },
  {
    name: 'Enterprise',
    monthlyPrice: 49.99,
    yearlyPrice: 499.99,
    features: [
      'Team Access',
      'Admin Controls',
      'API Access',
      'Dedicated Support'
    ],
    limits: {
      resumes: -1,
      coverLetters: -1,
      aiGenerations: -1,
      atsScans: -1
    }
  }
];

async function seedPlans() {
  console.log('Seeding plans...');
  
  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice,
        features: plan.features,
        limits: plan.limits
      },
      create: {
        name: plan.name,
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice,
        features: plan.features,
        limits: plan.limits
      }
    });
    console.log(`Upserted plan: ${plan.name}`);
  }
  
  console.log('Finished seeding plans.');
}

seedPlans()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
