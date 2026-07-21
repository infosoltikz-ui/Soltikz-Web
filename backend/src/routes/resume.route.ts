import { Router } from 'express';
import {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
  archiveResume,
  restoreResume,
  toggleFavorite,
  updateTemplate,
  updateTheme,
  updateTypography,
  updateLayout,
  updatePersonal,
  updateSummary,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperience,
  createEducation,
  updateEducation,
  deleteEducation,
  reorderEducation,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkill,
  createProject,
  updateProject,
  deleteProject,
  reorderProject,
  createCertification,
  updateCertification,
  deleteCertification,
  reorderCertification,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  reorderLanguage,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  reorderAchievement,
  createAward,
  updateAward,
  deleteAward,
  reorderAward,
  createInterest,
  updateInterest,
  deleteInterest,
  reorderInterest,
  createReference,
  updateReference,
  deleteReference,
  reorderReference,
} from '../controllers/resume.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createResumeSchema,
  updateResumeSchema,
  getResumesQuerySchema,
  updateTemplateSchema,
  updateThemeSchema,
  updateTypographySchema,
  updateLayoutSchema,
  updatePersonalSchema,
  updateSummarySchema,
  createExperienceSchema,
  updateExperienceSchema,
  createEducationSchema,
  updateEducationSchema,
  createSkillSchema,
  updateSkillSchema,
  createProjectSchema,
  updateProjectSchema,
  createCertificationSchema,
  updateCertificationSchema,
  createLanguageSchema,
  updateLanguageSchema,
  createAchievementSchema,
  updateAchievementSchema,
  createAwardSchema,
  updateAwardSchema,
  createInterestSchema,
  updateInterestSchema,
  createReferenceSchema,
  updateReferenceSchema,
  reorderSchema,
} from '../validators/resume.validator';

const router = Router();

router.use(protect); // All resume routes require authentication

router
  .route('/')
  .get(validate(getResumesQuerySchema), getResumes)
  .post(validate(createResumeSchema), createResume);

router
  .route('/:id')
  .get(getResumeById)
  .put(validate(updateResumeSchema), updateResume)
  .delete(deleteResume);

router.post('/:id/duplicate', duplicateResume);
router.post('/:id/archive', archiveResume);
router.post('/:id/restore', restoreResume);
router.post('/:id/favorite', toggleFavorite);

// Settings
router.put('/:id/template', validate(updateTemplateSchema), updateTemplate);
router.put('/:id/theme', validate(updateThemeSchema), updateTheme);
router.put('/:id/typography', validate(updateTypographySchema), updateTypography);
router.put('/:id/layout', validate(updateLayoutSchema), updateLayout);

// Core Modules
router.put('/:id/personal', validate(updatePersonalSchema), updatePersonal);
router.put('/:id/summary', validate(updateSummarySchema), updateSummary);

// Experience
router.post('/:id/experience', validate(createExperienceSchema), createExperience);
router.put('/:id/experience/reorder', validate(reorderSchema), reorderExperience);
router.put('/:id/experience/:expId', validate(updateExperienceSchema), updateExperience);
router.delete('/:id/experience/:expId', deleteExperience);

// Education
router.post('/:id/education', validate(createEducationSchema), createEducation);
router.put('/:id/education/reorder', validate(reorderSchema), reorderEducation);
router.put('/:id/education/:eduId', validate(updateEducationSchema), updateEducation);
router.delete('/:id/education/:eduId', deleteEducation);

// Skills
router.post('/:id/skills', validate(createSkillSchema), createSkill);
router.put('/:id/skills/reorder', validate(reorderSchema), reorderSkill);
router.put('/:id/skills/:skillId', validate(updateSkillSchema), updateSkill);
router.delete('/:id/skills/:skillId', deleteSkill);

// Projects
router.post('/:id/projects', validate(createProjectSchema), createProject);
router.put('/:id/projects/reorder', validate(reorderSchema), reorderProject);
router.put('/:id/projects/:projectId', validate(updateProjectSchema), updateProject);
router.delete('/:id/projects/:projectId', deleteProject);

// Certifications
router.post('/:id/certifications', validate(createCertificationSchema), createCertification);
router.put('/:id/certifications/reorder', validate(reorderSchema), reorderCertification);
router.put('/:id/certifications/:certId', validate(updateCertificationSchema), updateCertification);
router.delete('/:id/certifications/:certId', deleteCertification);

// Languages
router.post('/:id/languages', validate(createLanguageSchema), createLanguage);
router.put('/:id/languages/reorder', validate(reorderSchema), reorderLanguage);
router.put('/:id/languages/:langId', validate(updateLanguageSchema), updateLanguage);
router.delete('/:id/languages/:langId', deleteLanguage);

// Achievements
router.post('/:id/achievements', validate(createAchievementSchema), createAchievement);
router.put('/:id/achievements/reorder', validate(reorderSchema), reorderAchievement);
router.put('/:id/achievements/:achievementId', validate(updateAchievementSchema), updateAchievement);
router.delete('/:id/achievements/:achievementId', deleteAchievement);

// Awards
router.post('/:id/awards', validate(createAwardSchema), createAward);
router.put('/:id/awards/reorder', validate(reorderSchema), reorderAward);
router.put('/:id/awards/:awardId', validate(updateAwardSchema), updateAward);
router.delete('/:id/awards/:awardId', deleteAward);

// Interests
router.post('/:id/interests', validate(createInterestSchema), createInterest);
router.put('/:id/interests/reorder', validate(reorderSchema), reorderInterest);
router.put('/:id/interests/:interestId', validate(updateInterestSchema), updateInterest);
router.delete('/:id/interests/:interestId', deleteInterest);

// References
router.post('/:id/references', validate(createReferenceSchema), createReference);
router.put('/:id/references/reorder', validate(reorderSchema), reorderReference);
router.put('/:id/references/:refId', validate(updateReferenceSchema), updateReference);
router.delete('/:id/references/:refId', deleteReference);

export default router;
