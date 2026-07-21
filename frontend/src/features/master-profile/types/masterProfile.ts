export interface MasterEducation {
  id?: string;
  degree: string;
  specialization?: string | null;
  university?: string | null;
  college?: string | null;
  percentageCgpa?: string | null;
  startYear?: string | null;
  endYear?: string | null;
  educationType?: string | null;
}

export interface MasterCertification {
  id?: string;
  name: string;
  organization?: string | null;
  completionDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  skillsCovered?: string | null;
}

export interface MasterTechnicalSkill {
  id?: string;
  category: string;
  tags: string[];
}

export interface MasterEmployment {
  id?: string;
  company: string;
  client?: string | null;
  designation?: string | null;
  employmentType?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  currentCompany: boolean;
  location?: string | null;
  responsibilities?: string | null;
  environment?: string | null;
  technologyStack?: string | null;
  achievements?: string | null;
}

export interface MasterProject {
  id?: string;
  projectName: string;
  client?: string | null;
  role?: string | null;
  businessDomain?: string | null;
  description?: string | null;
  responsibilities?: string | null;
  technologyStack?: string | null;
  environment?: string | null;
  duration?: string | null;
  teamSize?: string | null;
  methodology?: string | null;
  achievements?: string | null;
}

export interface MasterLanguage {
  id?: string;
  language: string;
  canRead: boolean;
  canWrite: boolean;
  canSpeak: boolean;
}

export interface MasterAward {
  id?: string;
  name: string;
  organization?: string | null;
  date?: string | null;
  description?: string | null;
}

export interface MasterAchievement {
  id?: string;
  description: string;
}

export interface MasterSocialLink {
  id?: string;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  stackOverflow?: string | null;
  leetCode?: string | null;
  hackerRank?: string | null;
}

export interface MasterProfile {
  id?: string;
  userId?: string;
  profilePhoto?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  currentLocation?: string | null;
  country?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  currentDesignation?: string | null;
  totalExperience?: string | null;
  noticePeriod?: string | null;
  currentCtc?: string | null;
  expectedCtc?: string | null;
  preferredLocation?: string | null;
  workAuthorization?: string | null;
  visaStatus?: string | null;
  careerObjective?: string | null;

  completionPercentage: number;
  
  educations: MasterEducation[];
  certifications: MasterCertification[];
  skills: MasterTechnicalSkill[];
  employments: MasterEmployment[];
  projects: MasterProject[];
  languages: MasterLanguage[];
  awards: MasterAward[];
  achievements: MasterAchievement[];
  socialLinks: MasterSocialLink[];
}
