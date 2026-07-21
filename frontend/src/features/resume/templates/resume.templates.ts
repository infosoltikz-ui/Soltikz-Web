export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  previewImage: string;
  primaryColor: string;
  secondaryColor: string;
  columns: 1 | 2;
  isAtsFriendly: boolean;
  atsScore: number;
  isPremium: boolean;
  recommendedFor: string[];
  defaultFontFamily: string;
  version: string;
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'A clean, single-column design with a large header and subtle accent colors. Perfect for contemporary professionals.',
    category: 'Professional',
    previewImage: '/templates/modern.png',
    primaryColor: '#2563eb', // blue-600
    secondaryColor: '#f1f5f9', // slate-100
    columns: 1,
    isAtsFriendly: true,
    atsScore: 98,
    isPremium: false,
    recommendedFor: ['Tech', 'Marketing', 'Design', 'Software Engineer', 'Developer'],
    defaultFontFamily: 'inter',
    version: '1.0.0',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'A classic, corporate-style single-column layout with minimal icons and structured spacing.',
    category: 'Corporate',
    previewImage: '/templates/professional.png',
    primaryColor: '#475569', // slate-600
    secondaryColor: '#f8fafc', // slate-50
    columns: 1,
    isAtsFriendly: true,
    atsScore: 95,
    isPremium: false,
    recommendedFor: ['Finance', 'Law', 'Management', 'Consulting'],
    defaultFontFamily: 'roboto',
    version: '1.0.0',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'A premium, highly structured format with bold serif headings, designed for experienced leaders.',
    category: 'Executive',
    previewImage: '/templates/executive.png',
    primaryColor: '#0f172a', // slate-900
    secondaryColor: '#e2e8f0', // slate-200
    columns: 1,
    isAtsFriendly: true,
    atsScore: 92,
    isPremium: true,
    recommendedFor: ['Executives', 'Directors', 'Senior Managers'],
    defaultFontFamily: 'merriweather',
    version: '1.0.0',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'An ultra-clean, spacious layout focusing purely on content without distractions.',
    category: 'Minimal',
    previewImage: '/templates/minimal.png',
    primaryColor: '#171717', // neutral-900
    secondaryColor: '#ffffff',
    columns: 1,
    isAtsFriendly: true,
    atsScore: 99,
    isPremium: false,
    recommendedFor: ['Academia', 'Research', 'Writers'],
    defaultFontFamily: 'lato',
    version: '1.0.0',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'A modern two-column layout featuring a distinct sidebar for skills and contact info.',
    category: 'Creative',
    previewImage: '/templates/creative.png',
    primaryColor: '#0ea5e9', // sky-500
    secondaryColor: '#f0f9ff', // sky-50
    columns: 2,
    isAtsFriendly: false,
    atsScore: 75,
    isPremium: true,
    recommendedFor: ['Designers', 'Creatives', 'Freelancers'],
    defaultFontFamily: 'poppins',
    version: '1.0.0',
  },
];

export const getTemplateById = (id: string): ResumeTemplate => {
  return RESUME_TEMPLATES.find(t => t.id === id) || RESUME_TEMPLATES[0];
};
