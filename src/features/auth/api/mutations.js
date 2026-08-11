import { useMutation } from '@tanstack/react-query';
import authService from './service';

export function useRegisterMutation(options) {
  return useMutation({
    mutationFn: (payload) => authService.register(payload),
    ...options
  });
}

export function useLoginMutation(options) {
  return useMutation({
    mutationFn: (credentials) =>
      authService.loginWithEmailAndPassword(credentials),
    ...options
  });
}

export function useRefreshTokenMutation(options) {
  return useMutation({
    mutationFn: (payload) => authService.refreshToken(payload),
    ...options
  });
}

export function useLogoutMutation(options) {
  return useMutation({
    mutationFn: (payload) => authService.logout(payload),
    ...options
  });
}

export function useForgotPasswordMutation(options) {
  return useMutation({
    mutationFn: (payload) => authService.forgotPassword(payload),
    ...options
  });
}

export function useResetPasswordMutation(options) {
  return useMutation({
    mutationFn: (payload) => authService.resetPassword(payload),
    ...options
  });
}

export function useChangePasswordMutation(options) {
  return useMutation({
    mutationFn: (payload) => authService.changePassword(payload),
    ...options
  });
}
