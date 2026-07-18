export class CoverLetterTemplateService {
  /**
   * Retrieves available cover letter templates.
   */
  public static getTemplates() {
    return [
      {
        id: 'professional',
        name: 'Professional',
        description: 'A clean, traditional layout suitable for most corporate roles.',
      },
      {
        id: 'modern',
        name: 'Modern',
        description: 'A contemporary design with clear typography and spacing.',
      },
      {
        id: 'executive',
        name: 'Executive',
        description: 'An elegant, sophisticated layout for senior leadership positions.',
      },
      {
        id: 'startup',
        name: 'Startup',
        description: 'A relaxed but structured format ideal for tech startups.',
      },
      {
        id: 'creative',
        name: 'Creative',
        description: 'A visually engaging format to stand out in creative industries.',
      }
    ];
  }

  /**
   * Retrieves styling configuration for a specific template.
   */
  public static getTemplateConfig(templateId: string) {
    const configs: Record<string, any> = {
      professional: { fontFamily: 'Times New Roman, serif', fontSize: '11pt', margin: '1in' },
      modern: { fontFamily: 'Arial, sans-serif', fontSize: '10.5pt', margin: '0.8in' },
      executive: { fontFamily: 'Garamond, serif', fontSize: '12pt', margin: '1in' },
      startup: { fontFamily: 'Inter, sans-serif', fontSize: '10pt', margin: '0.75in' },
      creative: { fontFamily: 'Outfit, sans-serif', fontSize: '11pt', margin: '0.8in' }
    };
    
    return configs[templateId] || configs['professional'];
  }
}
