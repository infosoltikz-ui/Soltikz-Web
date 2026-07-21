export class ResumeScoreService {
  /**
   * Helper function to convert a 0-100 score into a Letter Grade
   */
  public static getLetterGrade(score: number): string {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 67) return 'D+';
    if (score >= 65) return 'D';
    return 'F';
  }

  /**
   * Normalizes the raw JSON from the AI to ensure all required fields are present and safe.
   */
  public static normalizeScore(raw: any) {
    const overallScore = typeof raw.overallScore === 'number' ? raw.overallScore : 0;
    
    return {
      overallScore,
      letterGrade: this.getLetterGrade(overallScore),
      contentQuality: {
        summary: raw.contentQuality?.summary || 0,
        experience: raw.contentQuality?.experience || 0,
        skills: raw.contentQuality?.skills || 0,
        projects: raw.contentQuality?.projects || 0,
        achievements: raw.contentQuality?.achievements || 0,
        education: raw.contentQuality?.education || 0,
      },
      recruiterPerspective: {
        firstImpression: raw.recruiterPerspective?.firstImpression || 0,
        readability: raw.recruiterPerspective?.readability || 0,
        clarity: raw.recruiterPerspective?.clarity || 0,
        professionalism: raw.recruiterPerspective?.professionalism || 0,
        careerProgression: raw.recruiterPerspective?.careerProgression || 0,
        technicalDepth: raw.recruiterPerspective?.technicalDepth || 0,
      },
      atsCompatibility: {
        atsScore: raw.atsCompatibility?.atsScore || 0,
        keywordOptimization: raw.atsCompatibility?.keywordOptimization || 0,
        parseSuccess: !!raw.atsCompatibility?.parseSuccess,
      },
      benchmarking: {
        percentile: raw.benchmarking?.percentile || 0,
        strengths: Array.isArray(raw.benchmarking?.strengths) ? raw.benchmarking.strengths : [],
        weaknesses: Array.isArray(raw.benchmarking?.weaknesses) ? raw.benchmarking.weaknesses : [],
      },
      insights: {
        topStrengths: Array.isArray(raw.insights?.topStrengths) ? raw.insights.topStrengths : [],
        criticalWeaknesses: Array.isArray(raw.insights?.criticalWeaknesses) ? raw.insights.criticalWeaknesses : [],
        missingSections: Array.isArray(raw.insights?.missingSections) ? raw.insights.missingSections : [],
        missingSkills: Array.isArray(raw.insights?.missingSkills) ? raw.insights.missingSkills : [],
        careerGrowthSuggestions: Array.isArray(raw.insights?.careerGrowthSuggestions) ? raw.insights.careerGrowthSuggestions : [],
      },
      roadmap: {
        quickWins: Array.isArray(raw.roadmap?.quickWins) ? raw.roadmap.quickWins : [],
        mediumImprovements: Array.isArray(raw.roadmap?.mediumImprovements) ? raw.roadmap.mediumImprovements : [],
        majorImprovements: Array.isArray(raw.roadmap?.majorImprovements) ? raw.roadmap.majorImprovements : [],
      }
    };
  }
}
