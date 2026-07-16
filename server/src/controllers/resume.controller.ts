import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
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
      include: { template: true },
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
    const { title, templateId } = req.body;

    const randomString = crypto.randomBytes(3).toString('hex');
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${randomString}`;

    const resume = await prisma.resume.create({
      data: {
        userId,
        title,
        slug,
        templateId,
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
