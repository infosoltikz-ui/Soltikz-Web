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
  content: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  template?: {
    id: string;
    name: string;
    thumbnail: string | null;
  };
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

export const createResume = async (data: { title: string; templateId?: string }): Promise<Resume> => {
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
