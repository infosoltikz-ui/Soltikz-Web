import api from '@/utils/axios';

export interface Resume {
  id: string;
  userId: string;
  title: string;
  slug: string;
  templateId: string | null;
  status: 'DRAFT' | 'IN_PROGRESS' | 'READY' | 'ARCHIVED';
  visibility: 'PRIVATE' | 'PUBLIC';
  completionPercentage: number;
  isFavorite: boolean;
  isArchived: boolean;
  resumeType: 'C2C' | 'FULLTIME';
  content: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  
  // Settings
  selectedTemplate?: string | null;
  defaultTheme?: string | null;
  primaryColor?: string | null;
  fontFamily?: string | null;
  fontSize?: string | null;
  lineSpacing?: string | null;
  sectionSpacing?: string | null;
  pageMargin?: string | null;
  showProfilePhoto?: boolean;
  showIcons?: boolean;
  showSectionDividers?: boolean;
  template?: {
    id: string;
    name: string;
    thumbnail: string | null;
  };
  personal?: ResumePersonal | null;
  summary?: ResumeSummary | null;
  experiences?: ResumeExperience[];
  educations?: ResumeEducation[];
  skills?: ResumeSkill[];
  projects?: ResumeProject[];
  certifications?: ResumeCertification[];
  languages?: ResumeLanguage[];
  achievements?: ResumeAchievement[];
  awards?: ResumeAward[];
  interests?: ResumeInterest[];
  references?: ResumeReference[];
}

export interface ResumePersonal {
  firstName?: string;
  lastName?: string;
  title?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
  profileImage?: string;
  about?: string;
}

export interface ResumeSummary {
  content?: string;
}

export interface GetResumesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  favorite?: boolean;
  sort?: string;
}

export interface GetResumesResponse {
  resumes: Resume[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getResumes = async (params?: GetResumesParams): Promise<GetResumesResponse> => {
  const response = await api.get('/resumes', { params });
  return response.data.data;
};

export const getResumeById = async (id: string): Promise<Resume> => {
  const response = await api.get(`/resumes/${id}`);
  return response.data.data;
};

export const createResume = async (data: { title: string; templateId?: string; resumeType?: 'C2C' | 'FULLTIME' }): Promise<Resume> => {
  const response = await api.post('/resumes', data);
  return response.data.data;
};

export const updateResume = async (id: string, data: { title?: string; status?: string; visibility?: string }): Promise<Resume> => {
  const response = await api.put(`/resumes/${id}`, data);
  return response.data.data;
};

export const deleteResume = async (id: string): Promise<void> => {
  await api.delete(`/resumes/${id}`);
};

export const duplicateResume = async (id: string): Promise<Resume> => {
  const response = await api.post(`/resumes/${id}/duplicate`);
  return response.data.data;
};

export const archiveResume = async (id: string): Promise<Resume> => {
  const response = await api.post(`/resumes/${id}/archive`);
  return response.data.data;
};

export const restoreResume = async (id: string): Promise<Resume> => {
  const response = await api.post(`/resumes/${id}/restore`);
  return response.data.data;
};

export const toggleFavoriteResume = async (id: string): Promise<Resume> => {
  const response = await api.post(`/resumes/${id}/favorite`);
  return response.data.data;
};

// ==================== Sprint 3.5 Settings APIs ====================
export const updateTemplate = async (id: string, data: { selectedTemplate: string }): Promise<Resume> => {
  const response = await api.put(`/resumes/${id}/template`, data);
  return response.data.data;
};

export const updateTheme = async (id: string, data: { defaultTheme?: string; primaryColor?: string }): Promise<Resume> => {
  const response = await api.put(`/resumes/${id}/theme`, data);
  return response.data.data;
};

export const updateTypography = async (id: string, data: { fontFamily?: string; fontSize?: string; lineSpacing?: string }): Promise<Resume> => {
  const response = await api.put(`/resumes/${id}/typography`, data);
  return response.data.data;
};

export const updateLayout = async (id: string, data: { sectionSpacing?: string; pageMargin?: string; showProfilePhoto?: boolean; showIcons?: boolean; showSectionDividers?: boolean }): Promise<Resume> => {
  const response = await api.put(`/resumes/${id}/layout`, data);
  return response.data.data;
};


export const updatePersonalInfo = async (id: string, data: ResumePersonal): Promise<ResumePersonal> => {
  const response = await api.put(`/resumes/${id}/personal`, data);
  return response.data.data;
};

export const updateSummary = async (id: string, data: ResumeSummary): Promise<ResumeSummary> => {
  const response = await api.put(`/resumes/${id}/summary`, data);
  return response.data.data;
};

export interface ResumeExperience {
  id: string;
  resumeId: string;
  companyName: string;
  jobTitle: string;
  employmentType?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  startDate?: string | null;
  endDate?: string;
  currentlyWorking: boolean;
  environment?: string;
  description?: string;
  displayOrder: number;
}

export interface ResumeEducation {
  id: string;
  resumeId: string;
  institution: string;
  degree?: string | null;
  fieldOfStudy?: string | null;
  grade?: string | null;
  city?: string | null;
  country?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  currentlyStudying: boolean;
  description?: string | null;
  displayOrder: number;
}

export interface ResumeSkill {
  id: string;
  resumeId: string;
  name: string;
  category?: string | null;
  proficiency?: string | null;
  displayOrder: number;
}

export interface ResumeProject {
  id: string;
  resumeId: string;
  title: string;
  description?: string | null;
  technologies: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  featured: boolean;
  displayOrder: number;
}

export interface ReorderPayload {
  items: { id: string; displayOrder: number }[];
}

// Experience API
export const createExperience = async (id: string, data: Partial<ResumeExperience>): Promise<ResumeExperience> => {
  const response = await api.post(`/resumes/${id}/experience`, data);
  return response.data.data;
};
export const updateExperience = async (id: string, expId: string, data: Partial<ResumeExperience>): Promise<ResumeExperience> => {
  const response = await api.put(`/resumes/${id}/experience/${expId}`, data);
  return response.data.data;
};
export const deleteExperience = async (id: string, expId: string): Promise<void> => {
  await api.delete(`/resumes/${id}/experience/${expId}`);
};
export const reorderExperience = async (id: string, data: ReorderPayload): Promise<void> => {
  await api.put(`/resumes/${id}/experience/reorder`, data);
};

// Education API
export const createEducation = async (id: string, data: Partial<ResumeEducation>): Promise<ResumeEducation> => {
  const response = await api.post(`/resumes/${id}/education`, data);
  return response.data.data;
};
export const updateEducation = async (id: string, eduId: string, data: Partial<ResumeEducation>): Promise<ResumeEducation> => {
  const response = await api.put(`/resumes/${id}/education/${eduId}`, data);
  return response.data.data;
};
export const deleteEducation = async (id: string, eduId: string): Promise<void> => {
  await api.delete(`/resumes/${id}/education/${eduId}`);
};
export const reorderEducation = async (id: string, data: ReorderPayload): Promise<void> => {
  await api.put(`/resumes/${id}/education/reorder`, data);
};

// Skills API
export const createSkill = async (id: string, data: Partial<ResumeSkill>): Promise<ResumeSkill> => {
  const response = await api.post(`/resumes/${id}/skills`, data);
  return response.data.data;
};
export const updateSkill = async (id: string, skillId: string, data: Partial<ResumeSkill>): Promise<ResumeSkill> => {
  const response = await api.put(`/resumes/${id}/skills/${skillId}`, data);
  return response.data.data;
};
export const deleteSkill = async (id: string, skillId: string): Promise<void> => {
  await api.delete(`/resumes/${id}/skills/${skillId}`);
};
export const reorderSkill = async (id: string, data: ReorderPayload): Promise<void> => {
  await api.put(`/resumes/${id}/skills/reorder`, data);
};

// Projects API
export const createProject = async (id: string, data: Partial<ResumeProject>): Promise<ResumeProject> => {
  const response = await api.post(`/resumes/${id}/projects`, data);
  return response.data.data;
};
export const updateProject = async (id: string, projectId: string, data: Partial<ResumeProject>): Promise<ResumeProject> => {
  const response = await api.put(`/resumes/${id}/projects/${projectId}`, data);
  return response.data.data;
};
export const deleteProject = async (id: string, projectId: string): Promise<void> => {
  await api.delete(`/resumes/${id}/projects/${projectId}`);
};
export const reorderProject = async (id: string, data: ReorderPayload): Promise<void> => {
  await api.put(`/resumes/${id}/projects/reorder`, data);
};

// ==================== Sprint 3.4 Types & APIs ====================

export interface ResumeCertification {
  id: string;
  resumeId: string;
  certificationName: string;
  issuingOrganization?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  issueDate?: string | null;
  expirationDate?: string | null;
  neverExpires: boolean;
  displayOrder: number;
}

export interface ResumeLanguage {
  id: string;
  resumeId: string;
  language: string;
  proficiency: string;
  displayOrder: number;
}

export interface ResumeAchievement {
  id: string;
  resumeId: string;
  title: string;
  description?: string | null;
  achievementDate?: string | null;
  displayOrder: number;
}

export interface ResumeAward {
  id: string;
  resumeId: string;
  awardName: string;
  issuer?: string | null;
  awardDate?: string | null;
  description?: string | null;
  displayOrder: number;
}

export interface ResumeInterest {
  id: string;
  resumeId: string;
  interest: string;
  category?: string | null;
  displayOrder: number;
}

export interface ResumeReference {
  id: string;
  resumeId: string;
  name: string;
  designation?: string | null;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  relationship?: string | null;
  availableUponRequest: boolean;
  displayOrder: number;
}

// Certifications API
export const createCertification = async (id: string, data: Partial<ResumeCertification>): Promise<ResumeCertification> => {
  const response = await api.post(`/resumes/${id}/certifications`, data);
  return response.data.data;
};
export const updateCertification = async (id: string, certId: string, data: Partial<ResumeCertification>): Promise<ResumeCertification> => {
  const response = await api.put(`/resumes/${id}/certifications/${certId}`, data);
  return response.data.data;
};
export const deleteCertification = async (id: string, certId: string): Promise<void> => {
  await api.delete(`/resumes/${id}/certifications/${certId}`);
};
export const reorderCertification = async (id: string, data: ReorderPayload): Promise<void> => {
  await api.put(`/resumes/${id}/certifications/reorder`, data);
};

// Languages API
export const createLanguage = async (id: string, data: Partial<ResumeLanguage>): Promise<ResumeLanguage> => {
  const response = await api.post(`/resumes/${id}/languages`, data);
  return response.data.data;
};
export const updateLanguage = async (id: string, langId: string, data: Partial<ResumeLanguage>): Promise<ResumeLanguage> => {
  const response = await api.put(`/resumes/${id}/languages/${langId}`, data);
  return response.data.data;
};
export const deleteLanguage = async (id: string, langId: string): Promise<void> => {
  await api.delete(`/resumes/${id}/languages/${langId}`);
};
export const reorderLanguage = async (id: string, data: ReorderPayload): Promise<void> => {
  await api.put(`/resumes/${id}/languages/reorder`, data);
};

// Achievements API
export const createAchievement = async (id: string, data: Partial<ResumeAchievement>): Promise<ResumeAchievement> => {
  const response = await api.post(`/resumes/${id}/achievements`, data);
  return response.data.data;
};
export const updateAchievement = async (id: string, achievementId: string, data: Partial<ResumeAchievement>): Promise<ResumeAchievement> => {
  const response = await api.put(`/resumes/${id}/achievements/${achievementId}`, data);
  return response.data.data;
};
export const deleteAchievement = async (id: string, achievementId: string): Promise<void> => {
  await api.delete(`/resumes/${id}/achievements/${achievementId}`);
};
export const reorderAchievement = async (id: string, data: ReorderPayload): Promise<void> => {
  await api.put(`/resumes/${id}/achievements/reorder`, data);
};

// Awards API
export const createAward = async (id: string, data: Partial<ResumeAward>): Promise<ResumeAward> => {
  const response = await api.post(`/resumes/${id}/awards`, data);
  return response.data.data;
};
export const updateAward = async (id: string, awardId: string, data: Partial<ResumeAward>): Promise<ResumeAward> => {
  const response = await api.put(`/resumes/${id}/awards/${awardId}`, data);
  return response.data.data;
};
export const deleteAward = async (id: string, awardId: string): Promise<void> => {
  await api.delete(`/resumes/${id}/awards/${awardId}`);
};
export const reorderAward = async (id: string, data: ReorderPayload): Promise<void> => {
  await api.put(`/resumes/${id}/awards/reorder`, data);
};

// Interests API
export const createInterest = async (id: string, data: Partial<ResumeInterest>): Promise<ResumeInterest> => {
  const response = await api.post(`/resumes/${id}/interests`, data);
  return response.data.data;
};
export const updateInterest = async (id: string, interestId: string, data: Partial<ResumeInterest>): Promise<ResumeInterest> => {
  const response = await api.put(`/resumes/${id}/interests/${interestId}`, data);
  return response.data.data;
};
export const deleteInterest = async (id: string, interestId: string): Promise<void> => {
  await api.delete(`/resumes/${id}/interests/${interestId}`);
};
export const reorderInterest = async (id: string, data: ReorderPayload): Promise<void> => {
  await api.put(`/resumes/${id}/interests/reorder`, data);
};

// References API
export const createReference = async (id: string, data: Partial<ResumeReference>): Promise<ResumeReference> => {
  const response = await api.post(`/resumes/${id}/references`, data);
  return response.data.data;
};
export const updateReference = async (id: string, refId: string, data: Partial<ResumeReference>): Promise<ResumeReference> => {
  const response = await api.put(`/resumes/${id}/references/${refId}`, data);
  return response.data.data;
};
export const deleteReference = async (id: string, refId: string): Promise<void> => {
  await api.delete(`/resumes/${id}/references/${refId}`);
};
export const reorderReference = async (id: string, data: ReorderPayload): Promise<void> => {
  await api.put(`/resumes/${id}/references/reorder`, data);
};

