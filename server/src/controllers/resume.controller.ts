import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';

export const getResumes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 10, search, status, favorite, sort = 'newest' } = req.query as any;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const where: Prisma.ResumeWhereInput = {
      userId,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { template: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status === 'TRASH') {
      where.deletedAt = { not: null };
    } else {
      where.deletedAt = null;
      if (status && status !== 'ALL') {
        where.status = status;
      }
    }

    if (favorite !== undefined) {
      where.isFavorite = favorite;
    }

    let orderBy: Prisma.ResumeOrderByWithRelationInput = { createdAt: 'desc' };
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'updated':
        orderBy = { updatedAt: 'desc' };
        break;
      case 'alphabetical':
        orderBy = { title: 'asc' };
        break;
      case 'completion':
        orderBy = { completionPercentage: 'desc' };
        break;
      case 'favorites':
        orderBy = { isFavorite: 'desc' };
        break;
      case 'created':
        orderBy = { createdAt: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [resumes, total] = await Promise.all([
      prisma.resume.findMany({
        where,
        orderBy,
        skip,
        take: limitNumber,
        include: {
          template: true,
        },
      }),
      prisma.resume.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Resumes fetched successfully',
      data: {
        resumes,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        },
      },
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const getResumeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const resume = await prisma.resume.findFirst({
      where: { id: id as string, userId, deletedAt: null },
      include: {
        template: true,
        personal: true,
        summary: true,
        experiences: { orderBy: { displayOrder: 'asc' } },
        educations: { orderBy: { displayOrder: 'asc' } },
        skills: { orderBy: { displayOrder: 'asc' } },
        projects: { orderBy: { displayOrder: 'asc' } },
        certifications: { orderBy: { displayOrder: 'asc' } },
        languages: { orderBy: { displayOrder: 'asc' } },
        achievements: { orderBy: { displayOrder: 'asc' } },
        awards: { orderBy: { displayOrder: 'asc' } },
        interests: { orderBy: { displayOrder: 'asc' } },
        references: { orderBy: { displayOrder: 'asc' } },
      },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Resume not found',
        data: null,
        errors: null,
        timestamp: new Date().toISOString(),
        requestId: (req as any).id || '',
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Resume fetched successfully',
      data: resume,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const createResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { title, templateId, resumeType } = req.body;

    const randomString = crypto.randomBytes(3).toString('hex');
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${randomString}`;

    const masterProfile = await prisma.masterProfile.findUnique({
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
      }
    });

    const resume = await prisma.resume.create({
      data: {
        userId,
        title,
        slug,
        templateId,
        resumeType: resumeType || 'FULLTIME',
        // Clone Personal Information
        personal: masterProfile ? {
          create: {
            firstName: masterProfile.firstName,
            lastName: masterProfile.lastName,
            email: masterProfile.email,
            phone: masterProfile.mobileNumber,
            location: masterProfile.currentLocation,
            country: masterProfile.country,
            linkedin: masterProfile.linkedin,
            github: masterProfile.github,
            portfolio: masterProfile.portfolio,
            profileImage: masterProfile.profilePhoto,
          }
        } : undefined,
        // Clone Summary
        summary: masterProfile?.careerObjective ? {
          create: {
            content: masterProfile.careerObjective
          }
        } : undefined,
        // Clone Educations
        educations: masterProfile?.educations?.length ? {
          create: masterProfile.educations.map((edu, i) => ({
            institution: edu.university || edu.college || '',
            degree: edu.degree,
            fieldOfStudy: edu.specialization,
            grade: edu.percentageCgpa,
            startDate: edu.startYear,
            endDate: edu.endYear,
            displayOrder: i
          }))
        } : undefined,
        // Clone Employments
        experiences: masterProfile?.employments?.length ? {
          create: masterProfile.employments.map((emp, i) => ({
            companyName: emp.company,
            jobTitle: emp.designation || '',
            employmentType: emp.employmentType,
            startDate: emp.startDate,
            endDate: emp.endDate,
            currentlyWorking: emp.currentCompany,
            city: emp.location,
            environment: emp.environment,
            description: emp.responsibilities,
            displayOrder: i
          }))
        } : undefined,
        // Clone Projects
        projects: masterProfile?.projects?.length ? {
          create: masterProfile.projects.map((proj, i) => ({
            title: proj.projectName,
            description: proj.description,
            technologies: proj.technologyStack ? proj.technologyStack.split(',').map(s => s.trim()) : [],
            startDate: proj.duration?.split('-')[0]?.trim(),
            endDate: proj.duration?.split('-')[1]?.trim(),
            displayOrder: i
          }))
        } : undefined,
        // Clone Certifications
        certifications: masterProfile?.certifications?.length ? {
          create: masterProfile.certifications.map((cert, i) => ({
            certificationName: cert.name,
            issuingOrganization: cert.organization,
            credentialId: cert.credentialId,
            credentialUrl: cert.credentialUrl,
            issueDate: cert.completionDate,
            displayOrder: i
          }))
        } : undefined,
        // Clone Skills
        skills: masterProfile?.skills?.length ? {
          create: masterProfile.skills.flatMap((skillGroup) => 
            skillGroup.tags.map(tag => ({
              name: tag,
              category: skillGroup.category,
              proficiency: 'Intermediate',
            }))
          ).map((s, i) => ({ ...s, displayOrder: i }))
        } : undefined,
        // Clone Languages
        languages: masterProfile?.languages?.length ? {
          create: masterProfile.languages.map((lang, i) => ({
            language: lang.language,
            proficiency: lang.canSpeak ? 'Fluent' : lang.canRead ? 'Intermediate' : 'Beginner',
            displayOrder: i
          }))
        } : undefined,
        // Clone Awards
        awards: masterProfile?.awards?.length ? {
          create: masterProfile.awards.map((award, i) => ({
            awardName: award.name,
            issuer: award.organization,
            awardDate: award.date,
            description: award.description,
            displayOrder: i
          }))
        } : undefined,
        // Clone Achievements
        achievements: masterProfile?.achievements?.length ? {
          create: masterProfile.achievements.map((ach, i) => ({
            title: 'Achievement',
            description: ach.description,
            displayOrder: i
          }))
        } : undefined,
      },
      include: { template: true },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Resume created successfully',
      data: resume,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const updateResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { title, status, visibility } = req.body;

    const existingResume = await prisma.resume.findFirst({
      where: { id: id as string, userId, deletedAt: null },
    });

    if (!existingResume) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Resume not found',
        data: null,
        errors: null,
        timestamp: new Date().toISOString(),
        requestId: (req as any).id || '',
      });
    }

    const dataToUpdate: any = { status, visibility };
    
    if (title && title !== existingResume.title) {
      dataToUpdate.title = title;
      const randomString = crypto.randomBytes(3).toString('hex');
      dataToUpdate.slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${randomString}`;
    }

    const resume = await prisma.resume.update({
      where: { id: id as string },
      data: dataToUpdate,
      include: { template: true },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Resume updated successfully',
      data: resume,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const resume = await prisma.resume.findFirst({
      where: { id: id as string, userId },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Resume not found',
        data: null,
        errors: null,
        timestamp: new Date().toISOString(),
        requestId: (req as any).id || '',
      });
    }

    if (resume.deletedAt) {
      // Hard delete if already in trash
      await prisma.resume.delete({
        where: { id: id as string },
      });
    } else {
      // Soft delete to trash
      await prisma.resume.update({
        where: { id: id as string },
        data: { deletedAt: new Date() },
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: resume.deletedAt ? 'Resume deleted permanently' : 'Resume moved to trash',
      data: null,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const duplicateResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const existingResume = await prisma.resume.findFirst({
      where: { id: id as string, userId, deletedAt: null },
    });

    if (!existingResume) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Resume not found',
        data: null,
        errors: null,
        timestamp: new Date().toISOString(),
        requestId: (req as any).id || '',
      });
    }

    const title = `${existingResume.title} (Copy)`;
    const randomString = crypto.randomBytes(3).toString('hex');
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${randomString}`;

    const newResume = await prisma.resume.create({
      data: {
        userId,
        title,
        slug,
        templateId: existingResume.templateId,
        status: existingResume.status,
        visibility: existingResume.visibility,
        content: existingResume.content || Prisma.JsonNull,
      },
      include: { template: true },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Resume duplicated successfully',
      data: newResume,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const archiveResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const existingResume = await prisma.resume.findFirst({
      where: { id: id as string, userId, deletedAt: null },
    });

    if (!existingResume) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Resume not found',
        data: null,
        errors: null,
        timestamp: new Date().toISOString(),
        requestId: (req as any).id || '',
      });
    }

    const isArchiving = !existingResume.isArchived;

    const resume = await prisma.resume.update({
      where: { id: id as string },
      data: {
        isArchived: isArchiving,
        status: isArchiving ? 'ARCHIVED' : 'DRAFT',
      },
      include: { template: true },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: isArchiving ? 'Resume archived' : 'Resume unarchived',
      data: resume,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const restoreResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const existingResume = await prisma.resume.findFirst({
      where: { id: id as string, userId },
    });

    if (!existingResume) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Resume not found',
        data: null,
        errors: null,
        timestamp: new Date().toISOString(),
        requestId: (req as any).id || '',
      });
    }

    const resume = await prisma.resume.update({
      where: { id: id as string },
      data: { deletedAt: null },
      include: { template: true },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Resume restored from trash',
      data: resume,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const existingResume = await prisma.resume.findFirst({
      where: { id: id as string, userId, deletedAt: null },
    });

    if (!existingResume) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Resume not found',
        data: null,
        errors: null,
        timestamp: new Date().toISOString(),
        requestId: (req as any).id || '',
      });
    }

    const resume = await prisma.resume.update({
      where: { id: id as string },
      data: { isFavorite: !existingResume.isFavorite },
      include: { template: true },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: resume.isFavorite ? 'Resume added to favorites' : 'Resume removed from favorites',
      data: resume,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

// ==================== Sprint 3.5 Settings APIs ====================

export const updateTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { selectedTemplate } = req.body;

    const resume = await prisma.resume.update({
      where: { id: id as string, userId },
      data: { selectedTemplate },
    });

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

export const updateTheme = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { defaultTheme, primaryColor } = req.body;

    const resume = await prisma.resume.update({
      where: { id: id as string, userId },
      data: { defaultTheme, primaryColor },
    });

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

export const updateTypography = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { fontFamily, fontSize, lineSpacing } = req.body;

    const resume = await prisma.resume.update({
      where: { id: id as string, userId },
      data: { fontFamily, fontSize, lineSpacing },
    });

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

export const updateLayout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { sectionSpacing, pageMargin, showProfilePhoto, showIcons, showSectionDividers } = req.body;

    const resume = await prisma.resume.update({
      where: { id: id as string, userId },
      data: { sectionSpacing, pageMargin, showProfilePhoto, showIcons, showSectionDividers },
    });

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

export const updatePersonal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    
    const existingResume = await prisma.resume.findFirst({
      where: { id: id as string, userId, deletedAt: null },
    });

    if (!existingResume) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Resume not found',
        data: null,
        errors: null,
        timestamp: new Date().toISOString(),
        requestId: (req as any).id || '',
      });
    }

    const personal = await prisma.resumePersonal.upsert({
      where: { resumeId: id as string },
      update: req.body,
      create: {
        resumeId: id as string,
        ...req.body,
      },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Personal information updated',
      data: personal,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const updateSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    
    const existingResume = await prisma.resume.findFirst({
      where: { id: id as string, userId, deletedAt: null },
    });

    if (!existingResume) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Resume not found',
        data: null,
        errors: null,
        timestamp: new Date().toISOString(),
        requestId: (req as any).id || '',
      });
    }

    const summary = await prisma.resumeSummary.upsert({
      where: { resumeId: id as string },
      update: req.body,
      create: {
        resumeId: id as string,
        ...req.body,
      },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Summary updated',
      data: summary,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// Experience CRUD
// ---------------------------------------------------------
export const createExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    
    // Verify resume ownership
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    // Get max display order
    const maxOrder = await prisma.resumeExperience.aggregate({
      where: { resumeId: id as string },
      _max: { displayOrder: true }
    });
    const displayOrder = (maxOrder._max.displayOrder ?? -1) + 1;

    const experience = await prisma.resumeExperience.create({
      data: {
        resumeId: id as string,
        ...req.body,
        displayOrder
      },
    });
    res.status(201).json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
};

export const updateExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, expId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const experience = await prisma.resumeExperience.update({
      where: { id: expId as string, resumeId: id as string },
      data: req.body,
    });
    res.status(200).json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
};

export const deleteExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, expId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    await prisma.resumeExperience.delete({
      where: { id: expId as string, resumeId: id as string },
    });
    res.status(200).json({ success: true, message: 'Experience deleted' });
  } catch (error) {
    next(error);
  }
};

export const reorderExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { items } = req.body;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    await prisma.$transaction(
      items.map((item: any) =>
        prisma.resumeExperience.update({
          where: { id: item.id, resumeId: id as string },
          data: { displayOrder: item.displayOrder },
        })
      )
    );
    res.status(200).json({ success: true, message: 'Reordered' });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// Education CRUD
// ---------------------------------------------------------
export const createEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const maxOrder = await prisma.resumeEducation.aggregate({
      where: { resumeId: id as string },
      _max: { displayOrder: true }
    });
    const displayOrder = (maxOrder._max.displayOrder ?? -1) + 1;

    const education = await prisma.resumeEducation.create({
      data: { resumeId: id as string, ...req.body, displayOrder },
    });
    res.status(201).json({ success: true, data: education });
  } catch (error) {
    next(error);
  }
};

export const updateEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, eduId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const education = await prisma.resumeEducation.update({
      where: { id: eduId as string, resumeId: id as string },
      data: req.body,
    });
    res.status(200).json({ success: true, data: education });
  } catch (error) {
    next(error);
  }
};

export const deleteEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, eduId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    await prisma.resumeEducation.delete({
      where: { id: eduId as string, resumeId: id as string },
    });
    res.status(200).json({ success: true, message: 'Education deleted' });
  } catch (error) {
    next(error);
  }
};

export const reorderEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { items } = req.body;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    await prisma.$transaction(
      items.map((item: any) =>
        prisma.resumeEducation.update({
          where: { id: item.id, resumeId: id as string },
          data: { displayOrder: item.displayOrder },
        })
      )
    );
    res.status(200).json({ success: true, message: 'Reordered' });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// Skills CRUD
// ---------------------------------------------------------
export const createSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const maxOrder = await prisma.resumeSkill.aggregate({
      where: { resumeId: id as string },
      _max: { displayOrder: true }
    });
    const displayOrder = (maxOrder._max.displayOrder ?? -1) + 1;

    const skill = await prisma.resumeSkill.create({
      data: { resumeId: id as string, ...req.body, displayOrder },
    });
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, skillId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const skill = await prisma.resumeSkill.update({
      where: { id: skillId as string, resumeId: id as string },
      data: req.body,
    });
    res.status(200).json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, skillId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    await prisma.resumeSkill.delete({
      where: { id: skillId as string, resumeId: id as string },
    });
    res.status(200).json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    next(error);
  }
};

export const reorderSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { items } = req.body;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    await prisma.$transaction(
      items.map((item: any) =>
        prisma.resumeSkill.update({
          where: { id: item.id, resumeId: id as string },
          data: { displayOrder: item.displayOrder },
        })
      )
    );
    res.status(200).json({ success: true, message: 'Reordered' });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// Projects CRUD
// ---------------------------------------------------------
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const maxOrder = await prisma.resumeProject.aggregate({
      where: { resumeId: id as string },
      _max: { displayOrder: true }
    });
    const displayOrder = (maxOrder._max.displayOrder ?? -1) + 1;

    const project = await prisma.resumeProject.create({
      data: { resumeId: id as string, ...req.body, displayOrder },
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, projectId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const project = await prisma.resumeProject.update({
      where: { id: projectId as string, resumeId: id as string },
      data: req.body,
    });
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, projectId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    await prisma.resumeProject.delete({
      where: { id: projectId as string, resumeId: id as string },
    });
    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};

export const reorderProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { items } = req.body;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    await prisma.$transaction(
      items.map((item: any) =>
        prisma.resumeProject.update({
          where: { id: item.id, resumeId: id as string },
          data: { displayOrder: item.displayOrder },
        })
      )
    );
    res.status(200).json({ success: true, message: 'Reordered' });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// Certifications CRUD
// ---------------------------------------------------------
export const createCertification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    const maxOrder = await prisma.resumeCertification.aggregate({ where: { resumeId: id as string }, _max: { displayOrder: true } });
    const displayOrder = (maxOrder._max.displayOrder ?? -1) + 1;
    const certification = await prisma.resumeCertification.create({ data: { resumeId: id as string, ...req.body, displayOrder } });
    res.status(201).json({ success: true, data: certification });
  } catch (error) { next(error); }
};

export const updateCertification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, certId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    const certification = await prisma.resumeCertification.update({ where: { id: certId as string, resumeId: id as string }, data: req.body });
    res.status(200).json({ success: true, data: certification });
  } catch (error) { next(error); }
};

export const deleteCertification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, certId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    await prisma.resumeCertification.delete({ where: { id: certId as string, resumeId: id as string } });
    res.status(200).json({ success: true, message: 'Certification deleted' });
  } catch (error) { next(error); }
};

export const reorderCertification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { items } = req.body;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    await prisma.$transaction(items.map((item: any) => prisma.resumeCertification.update({ where: { id: item.id, resumeId: id as string }, data: { displayOrder: item.displayOrder } })));
    res.status(200).json({ success: true, message: 'Reordered' });
  } catch (error) { next(error); }
};

// ---------------------------------------------------------
// Languages CRUD
// ---------------------------------------------------------
export const createLanguage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    const maxOrder = await prisma.resumeLanguage.aggregate({ where: { resumeId: id as string }, _max: { displayOrder: true } });
    const displayOrder = (maxOrder._max.displayOrder ?? -1) + 1;
    const language = await prisma.resumeLanguage.create({ data: { resumeId: id as string, ...req.body, displayOrder } });
    res.status(201).json({ success: true, data: language });
  } catch (error) { next(error); }
};

export const updateLanguage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, langId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    const language = await prisma.resumeLanguage.update({ where: { id: langId as string, resumeId: id as string }, data: req.body });
    res.status(200).json({ success: true, data: language });
  } catch (error) { next(error); }
};

export const deleteLanguage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, langId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    await prisma.resumeLanguage.delete({ where: { id: langId as string, resumeId: id as string } });
    res.status(200).json({ success: true, message: 'Language deleted' });
  } catch (error) { next(error); }
};

export const reorderLanguage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { items } = req.body;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    await prisma.$transaction(items.map((item: any) => prisma.resumeLanguage.update({ where: { id: item.id, resumeId: id as string }, data: { displayOrder: item.displayOrder } })));
    res.status(200).json({ success: true, message: 'Reordered' });
  } catch (error) { next(error); }
};

// ---------------------------------------------------------
// Achievements CRUD
// ---------------------------------------------------------
export const createAchievement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    const maxOrder = await prisma.resumeAchievement.aggregate({ where: { resumeId: id as string }, _max: { displayOrder: true } });
    const displayOrder = (maxOrder._max.displayOrder ?? -1) + 1;
    const achievement = await prisma.resumeAchievement.create({ data: { resumeId: id as string, ...req.body, displayOrder } });
    res.status(201).json({ success: true, data: achievement });
  } catch (error) { next(error); }
};

export const updateAchievement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, achievementId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    const achievement = await prisma.resumeAchievement.update({ where: { id: achievementId as string, resumeId: id as string }, data: req.body });
    res.status(200).json({ success: true, data: achievement });
  } catch (error) { next(error); }
};

export const deleteAchievement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, achievementId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    await prisma.resumeAchievement.delete({ where: { id: achievementId as string, resumeId: id as string } });
    res.status(200).json({ success: true, message: 'Achievement deleted' });
  } catch (error) { next(error); }
};

export const reorderAchievement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { items } = req.body;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    await prisma.$transaction(items.map((item: any) => prisma.resumeAchievement.update({ where: { id: item.id, resumeId: id as string }, data: { displayOrder: item.displayOrder } })));
    res.status(200).json({ success: true, message: 'Reordered' });
  } catch (error) { next(error); }
};

// ---------------------------------------------------------
// Awards CRUD
// ---------------------------------------------------------
export const createAward = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    const maxOrder = await prisma.resumeAward.aggregate({ where: { resumeId: id as string }, _max: { displayOrder: true } });
    const displayOrder = (maxOrder._max.displayOrder ?? -1) + 1;
    const award = await prisma.resumeAward.create({ data: { resumeId: id as string, ...req.body, displayOrder } });
    res.status(201).json({ success: true, data: award });
  } catch (error) { next(error); }
};

export const updateAward = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, awardId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    const award = await prisma.resumeAward.update({ where: { id: awardId as string, resumeId: id as string }, data: req.body });
    res.status(200).json({ success: true, data: award });
  } catch (error) { next(error); }
};

export const deleteAward = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, awardId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    await prisma.resumeAward.delete({ where: { id: awardId as string, resumeId: id as string } });
    res.status(200).json({ success: true, message: 'Award deleted' });
  } catch (error) { next(error); }
};

export const reorderAward = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { items } = req.body;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    await prisma.$transaction(items.map((item: any) => prisma.resumeAward.update({ where: { id: item.id, resumeId: id as string }, data: { displayOrder: item.displayOrder } })));
    res.status(200).json({ success: true, message: 'Reordered' });
  } catch (error) { next(error); }
};

// ---------------------------------------------------------
// Interests CRUD
// ---------------------------------------------------------
export const createInterest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    const maxOrder = await prisma.resumeInterest.aggregate({ where: { resumeId: id as string }, _max: { displayOrder: true } });
    const displayOrder = (maxOrder._max.displayOrder ?? -1) + 1;
    const interest = await prisma.resumeInterest.create({ data: { resumeId: id as string, ...req.body, displayOrder } });
    res.status(201).json({ success: true, data: interest });
  } catch (error) { next(error); }
};

export const updateInterest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, interestId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    const interest = await prisma.resumeInterest.update({ where: { id: interestId as string, resumeId: id as string }, data: req.body });
    res.status(200).json({ success: true, data: interest });
  } catch (error) { next(error); }
};

export const deleteInterest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, interestId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    await prisma.resumeInterest.delete({ where: { id: interestId as string, resumeId: id as string } });
    res.status(200).json({ success: true, message: 'Interest deleted' });
  } catch (error) { next(error); }
};

export const reorderInterest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { items } = req.body;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    await prisma.$transaction(items.map((item: any) => prisma.resumeInterest.update({ where: { id: item.id, resumeId: id as string }, data: { displayOrder: item.displayOrder } })));
    res.status(200).json({ success: true, message: 'Reordered' });
  } catch (error) { next(error); }
};

// ---------------------------------------------------------
// References CRUD
// ---------------------------------------------------------
export const createReference = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    const maxOrder = await prisma.resumeReference.aggregate({ where: { resumeId: id as string }, _max: { displayOrder: true } });
    const displayOrder = (maxOrder._max.displayOrder ?? -1) + 1;
    const reference = await prisma.resumeReference.create({ data: { resumeId: id as string, ...req.body, displayOrder } });
    res.status(201).json({ success: true, data: reference });
  } catch (error) { next(error); }
};

export const updateReference = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, refId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    const reference = await prisma.resumeReference.update({ where: { id: refId as string, resumeId: id as string }, data: req.body });
    res.status(200).json({ success: true, data: reference });
  } catch (error) { next(error); }
};

export const deleteReference = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, refId } = req.params;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    await prisma.resumeReference.delete({ where: { id: refId as string, resumeId: id as string } });
    res.status(200).json({ success: true, message: 'Reference deleted' });
  } catch (error) { next(error); }
};

export const reorderReference = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { items } = req.body;
    const resume = await prisma.resume.findFirst({ where: { id: id as string, userId, deletedAt: null } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    await prisma.$transaction(items.map((item: any) => prisma.resumeReference.update({ where: { id: item.id, resumeId: id as string }, data: { displayOrder: item.displayOrder } })));
    res.status(200).json({ success: true, message: 'Reordered' });
  } catch (error) { next(error); }
};

