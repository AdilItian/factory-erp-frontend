import { useMutation } from '@tanstack/react-query';
import boilerplateClient from '@/lib/axios/boilerplate-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export function useLoginMutation(options) {
  return useMutation({
    mutationFn: async (credentials) => {
      const res = await boilerplateClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return res.data;
    },
    ...options
  });
}

export function useRegisterMutation(options) {
  return useMutation({
    mutationFn: async (payload) => {
      const res = await boilerplateClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
      return res.data;
    },
    ...options
  });
}
