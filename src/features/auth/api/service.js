import apiClient from '@/lib/axios/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

class AuthService {
  async register({ email, password }) {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
      email,
      password
    });
    return res.data;
  }

  async loginWithEmailAndPassword({ email, password }) {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password
    });
    return res.data;
  }

  async refreshToken(payload) {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, payload);
    return res.data;
  }

  async logout({ refreshToken }) {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {
      refreshToken
    });
    return res.data;
  }

  async forgotPassword({ email }) {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email
    });
    return res.data;
  }

  async resetPassword({ token, newPassword }) {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      newPassword
    });
    return res.data;
  }

  async changePassword({ currentPassword, newPassword }) {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword
    });
    return res.data;
  }
}

export { AuthService };
export default new AuthService();
