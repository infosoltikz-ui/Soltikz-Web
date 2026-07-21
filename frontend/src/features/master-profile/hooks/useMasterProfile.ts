import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { masterProfileApi } from '../api/masterProfile.api';
import { MasterProfile } from '../types/masterProfile';
import { useUIStore } from '@store/useUIStore';

export const useMasterProfile = () => {
  return useQuery({
    queryKey: ['master-profile'],
    queryFn: () => masterProfileApi.getProfile(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateMasterProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<MasterProfile>) => masterProfileApi.updateProfile(data),
    onMutate: async (newData) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['master-profile'] });
      const previousProfile = queryClient.getQueryData(['master-profile']);
      
      queryClient.setQueryData(['master-profile'], (old: any) => ({
        ...old,
        ...newData,
      }));

      return { previousProfile };
    },
    onError: (err, newData, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['master-profile'], context.previousProfile);
      }
      useUIStore.getState().toast.error('Failed to save Master Profile');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['master-profile'] });
    },
  });
};
