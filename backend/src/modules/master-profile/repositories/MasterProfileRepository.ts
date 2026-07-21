import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MasterProfileRepository {
  public static async findByUserId(userId: string) {
    return prisma.masterProfile.findUnique({
      where: { userId },
      include: {
        educations: true,
        certifications: true,
        skills: true,
        employments: true,
        projects: true,
        languages: true,
        awards: true,
        achievements: true,
        socialLinks: true,
      },
    });
  }

  public static async create(userId: string, data: any) {
    return prisma.masterProfile.create({
      data: {
        ...data,
        userId,
      },
      include: {
        educations: true,
        certifications: true,
        skills: true,
        employments: true,
        projects: true,
        languages: true,
        awards: true,
        achievements: true,
        socialLinks: true,
      },
    });
  }

  public static async update(userId: string, data: any) {
    // Separate primitive fields from relations
    const {
      educations,
      certifications,
      skills,
      employments,
      projects,
      languages,
      awards,
      achievements,
      socialLinks,
      ...primitives
    } = data;

    return prisma.masterProfile.update({
      where: { userId },
      data: {
        ...primitives,
        // For related data, we completely replace them on full update to simulate a document sync
        ...(educations && {
          educations: {
            deleteMany: {},
            create: educations.map((e: any) => {
              const { id, ...rest } = e;
              return rest;
            }),
          },
        }),
        ...(certifications && {
          certifications: {
            deleteMany: {},
            create: certifications.map((e: any) => {
              const { id, ...rest } = e;
              return rest;
            }),
          },
        }),
        ...(skills && {
          skills: {
            deleteMany: {},
            create: skills.map((e: any) => {
              const { id, ...rest } = e;
              return rest;
            }),
          },
        }),
        ...(employments && {
          employments: {
            deleteMany: {},
            create: employments.map((e: any) => {
              const { id, ...rest } = e;
              return rest;
            }),
          },
        }),
        ...(projects && {
          projects: {
            deleteMany: {},
            create: projects.map((e: any) => {
              const { id, ...rest } = e;
              return rest;
            }),
          },
        }),
        ...(languages && {
          languages: {
            deleteMany: {},
            create: languages.map((e: any) => {
              const { id, ...rest } = e;
              return rest;
            }),
          },
        }),
        ...(awards && {
          awards: {
            deleteMany: {},
            create: awards.map((e: any) => {
              const { id, ...rest } = e;
              return rest;
            }),
          },
        }),
        ...(achievements && {
          achievements: {
            deleteMany: {},
            create: achievements.map((e: any) => {
              const { id, ...rest } = e;
              return rest;
            }),
          },
        }),
        ...(socialLinks && {
          socialLinks: {
            deleteMany: {},
            create: socialLinks.map((e: any) => {
              const { id, ...rest } = e;
              return rest;
            }),
          },
        }),
      },
      include: {
        educations: true,
        certifications: true,
        skills: true,
        employments: true,
        projects: true,
        languages: true,
        awards: true,
        achievements: true,
        socialLinks: true,
      },
    });
  }
}
