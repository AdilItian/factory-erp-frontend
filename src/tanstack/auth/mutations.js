import { useMutation } from '@tanstack/react-query';
import userServiceClient from '@/lib/axios/user-service-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export function useLoginMutation(options) {
  return useMutation({
    mutationFn: async (credentials) => {
      try {
        const res = await userServiceClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
    ...options
  });
}
