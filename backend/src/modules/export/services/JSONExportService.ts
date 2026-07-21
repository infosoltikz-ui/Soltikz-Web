export class JSONExportService {
  /**
   * Cleans the resume object for JSON backup, stripping internal IDs 
   * or DB-specific metadata if necessary, but returning a complete backup.
   */
  public static generateJSON(resume: any): string {
    // We could strip internal IDs (like userId, workspaceId) 
    // to make the backup clean and importable elsewhere.
    const cleanResume = {
      title: resume.title,
      personal: resume.personal,
      summary: resume.summary,
      experiences: resume.experiences,
      educations: resume.educations,
      skills: resume.skills,
      projects: resume.projects,
      certifications: resume.certifications,
      languages: resume.languages,
      achievements: resume.achievements,
      awards: resume.awards,
      interests: resume.interests,
      references: resume.references,
      settings: {
        selectedTemplate: resume.selectedTemplate,
        defaultTheme: resume.defaultTheme,
        primaryColor: resume.primaryColor,
        fontFamily: resume.fontFamily,
        fontSize: resume.fontSize,
        lineSpacing: resume.lineSpacing,
        sectionSpacing: resume.sectionSpacing,
        pageMargin: resume.pageMargin,
      }
    };

    return JSON.stringify(cleanResume, null, 2);
  }
}
