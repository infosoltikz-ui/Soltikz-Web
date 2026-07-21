import { Request, Response, NextFunction } from 'express';
import { UsageTrackingService, FeatureLimit } from '../services/UsageTrackingService';

export const FeatureGate = (feature: FeatureLimit) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Assuming userId is attached by authentication middleware
      const userId = (req as any).user?.id || (req as any).userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Check limit before proceeding (this throws an error if limit exceeded)
      await UsageTrackingService.checkLimit(userId, feature, 1);
      
      // If it passes, we continue to the actual route handler.
      // The actual route handler is responsible for calling incrementUsage 
      // after the action successfully completes.
      next();
    } catch (error: any) {
      return res.status(403).json({ error: error.message || 'Feature limit exceeded' });
    }
  };
};
