import { Request, Response } from 'express';
import { ResumeOptimizationService } from './services/ResumeOptimizationService';

export class ResumeOptimizationController {
  
  public static async generateOptimization(req: Request, res: Response) {
    try {
      const { resumeId, targetSection, conversationId } = req.body;
      const userId = req.user?.id; // Assuming auth middleware sets req.user

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      if (!resumeId) {
        return res.status(400).json({ success: false, message: 'Resume ID is required' });
      }

      const result = await ResumeOptimizationService.generateOptimization(
        userId,
        resumeId,
        targetSection || 'All',
        conversationId
      );

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in ResumeOptimizationController.generateOptimization:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const { resumeId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      if (!resumeId) {
        res.status(400).json({ success: false, message: 'Resume ID is required' });
        return;
      }

      const history = await ResumeOptimizationService.getOptimizationHistory(resumeId as string);

      res.status(200).json({ success: true, history });
    } catch (error: any) {
      console.error('Error in ResumeOptimizationController.getHistory:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }
}
