import { MasterProfileRepository } from '../repositories/MasterProfileRepository';
import { UpdateMasterProfileDTO } from '../dtos/MasterProfileDTO';

export class MasterProfileService {
  /**
   * Calculate profile completion percentage based on filled sections
   */
  private static calculateCompletion(profile: any): number {
    let score = 0;
    const totalWeights = 100;
    
    // Personal Info (20%)
    if (profile.firstName && profile.lastName && profile.email && profile.mobileNumber) score += 20;
    
    // Summary/Objective (10%)
    if (profile.careerObjective) score += 10;
    
    // Educations (10%)
    if (profile.educations && profile.educations.length > 0) score += 10;
    
    // Employments (20%)
    if (profile.employments && profile.employments.length > 0) score += 20;
    
    // Projects (15%)
    if (profile.projects && profile.projects.length > 0) score += 15;
    
    // Skills (15%)
    if (profile.skills && profile.skills.length > 0) score += 15;
    
    // Others (10% total)
    if (profile.certifications && profile.certifications.length > 0) score += 2.5;
    if (profile.languages && profile.languages.length > 0) score += 2.5;
    if (profile.awards && profile.awards.length > 0) score += 2.5;
    if (profile.socialLinks && profile.socialLinks.length > 0) score += 2.5;

    return Math.min(score, totalWeights);
  }

  public static async getProfile(userId: string) {
    let profile = await MasterProfileRepository.findByUserId(userId);
    if (!profile) {
      // Create empty profile if not found
      profile = await MasterProfileRepository.create(userId, {
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: ''
      });
    }
    return profile;
  }

  public static async updateProfile(userId: string, data: UpdateMasterProfileDTO) {
    const existing = await this.getProfile(userId);
    
    // Calculate new completion percentage
    const mergedForCalc = { ...existing, ...data };
    const completionPercentage = this.calculateCompletion(mergedForCalc);

    const updateData = {
      ...data,
      completionPercentage
    };

    return MasterProfileRepository.update(userId, updateData);
  }
}
