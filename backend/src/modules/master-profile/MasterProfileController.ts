import { Request, Response } from 'express';
import { MasterProfileService } from './services/MasterProfileService';
import { MasterProfileSchema } from './dtos/MasterProfileDTO';

export class MasterProfileController {
  public static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const profile = await MasterProfileService.getProfile(userId);
      res.json(profile);
    } catch (error: any) {
      console.error('Error fetching master profile:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch master profile' });
    }
  }

  public static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Validate incoming data
      const parsedData = MasterProfileSchema.parse(req.body);

      const profile = await MasterProfileService.updateProfile(userId, parsedData);
      res.json(profile);
    } catch (error: any) {
      console.error('Error updating master profile:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation Error', details: error.errors });
      }
      res.status(500).json({ error: error.message || 'Failed to update master profile' });
    }
  }
}
