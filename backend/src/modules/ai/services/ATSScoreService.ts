export class ATSScoreService {
  /**
   * Utility service to parse and normalize the ATS Score output from the LLM.
   * Can be expanded in the future for deterministic scoring rules.
   */
  public static normalizeScore(scanResult: any) {
    if (!scanResult) return null;

    // Ensure overall score is within 0-100
    const overallScore = Math.max(0, Math.min(100, scanResult.overallScore || 0));

    // Ensure section scores exist
    const sectionScores = {
      contact: Math.max(0, Math.min(100, scanResult.sectionScores?.contact || 0)),
      summary: Math.max(0, Math.min(100, scanResult.sectionScores?.summary || 0)),
      experience: Math.max(0, Math.min(100, scanResult.sectionScores?.experience || 0)),
      skills: Math.max(0, Math.min(100, scanResult.sectionScores?.skills || 0)),
      education: Math.max(0, Math.min(100, scanResult.sectionScores?.education || 0)),
      projects: Math.max(0, Math.min(100, scanResult.sectionScores?.projects || 0))
    };

    return {
      ...scanResult,
      overallScore,
      sectionScores
    };
  }
}
