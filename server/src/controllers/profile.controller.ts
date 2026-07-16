import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import bcrypt from 'bcrypt';
import { cloudinary } from '../lib/cloudinary';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        settings: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'User not found', data: null, errors: null, timestamp: new Date().toISOString(), requestId: (req as any).id || '' });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Profile retrieved successfully',
      data: user,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { name, phone, country, timezone, bio, headline, website, github, linkedin } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        country,
        timezone,
        profile: {
          upsert: {
            create: { bio, headline, website, github, linkedin },
            update: { bio, headline, website, github, linkedin },
          }
        }
      },
      include: { profile: true },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Profile updated successfully',
      data: updatedUser,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'No file uploaded', data: null, errors: null, timestamp: new Date().toISOString(), requestId: (req as any).id || '' });
    }

    // Convert buffer to base64 for Cloudinary
    const b64 = Buffer.from(file.buffer).toString('base64');
    let dataURI = 'data:' + file.mimetype + ';base64,' + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'ai_resume_builder/avatars',
    });

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar: result.secure_url },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Avatar uploaded successfully',
      data: { avatar: user.avatar },
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    
    // In a real app we would also delete the asset from Cloudinary using public_id

    await prisma.user.update({
      where: { id: userId },
      data: { avatar: null },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Avatar deleted successfully',
      data: null,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'User not found', data: null, errors: null, timestamp: new Date().toISOString(), requestId: (req as any).id || '' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Incorrect current password', data: null, errors: null, timestamp: new Date().toISOString(), requestId: (req as any).id || '' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Password updated successfully',
      data: null,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};
