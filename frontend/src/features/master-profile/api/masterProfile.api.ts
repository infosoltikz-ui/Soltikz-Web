import api from '@/utils/axios';
import { MasterProfile } from '../types/masterProfile';

export const masterProfileApi = {
  getProfile: async (): Promise<MasterProfile> => {
    const response = await api.get('/master-profile');
    return response.data;
  },

  updateProfile: async (data: Partial<MasterProfile>): Promise<MasterProfile> => {
    const response = await api.put('/master-profile/auto-save', data);
    return response.data;
  }
};
