import { Router } from 'express';
import { AIController } from './ai.controller';
import { SummaryGenerationController } from './SummaryGenerationController';
import { ExperienceRewriteController } from './ExperienceRewriteController';
import { SkillsGenerationController } from './SkillsGenerationController';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.post('/generate', AIController.generate);
router.post('/stream', AIController.stream);
router.get('/settings', AIController.getSettings);
router.put('/settings', AIController.updateSettings);
router.get('/history', AIController.getHistory);
router.get('/history/:id', AIController.getConversation);

// Platform Endpoints
router.get('/health', AIController.getHealth);
router.get('/analytics', AIController.getAnalytics);
router.get('/prompts', AIController.getPrompts);
router.post('/cache/clear', AIController.clearCache);

// Summary Generator Endpoints
router.post('/summary/generate', SummaryGenerationController.generate);
router.post('/summary/stream', SummaryGenerationController.stream);
router.get('/summary/history', SummaryGenerationController.getHistory);

// Experience Rewriter Endpoints
router.post('/experience/rewrite', ExperienceRewriteController.rewrite);
router.post('/experience/stream', ExperienceRewriteController.stream);
router.get('/experience/history', ExperienceRewriteController.getHistory);

// Skills Generator Endpoints
router.post('/skills/generate', SkillsGenerationController.generate);
router.post('/skills/stream', SkillsGenerationController.stream);
router.get('/skills/history', SkillsGenerationController.getHistory);

export default router;
