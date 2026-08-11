export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  USERS: {
    ALL: '/users',
    BY_ID: (userId) => `/users/${userId}`,
    ME: '/users/me',
    INVITE: '/users/invite'
  },
  PROJECTS: {
    ALL: '/projects',
    BY_ID: (projectId) => `/projects/${projectId}`,
    MANAGERS: (projectId) => `/projects/${projectId}/managers`,
    REMOVE_MANAGER: (projectId, userId) =>
      `/projects/${projectId}/managers/${userId}`,
    TASKS: (projectId) => `/projects/${projectId}/tasks`,
    /** Legacy boilerplate list endpoint */
    BOILERPLATE_LIST: '/projects/list'
  },
  TASKS: {
    ALL: '/tasks',
    ME: '/tasks/me',
    BY_ID: (taskId) => `/tasks/${taskId}`
  },
  ROLES: {
    ALL: '/roles',
    BY_ID: (roleId) => `/roles/${roleId}`,
    ASSIGN: '/roles/assign',
    REVOKE: '/roles/revoke'
  }
};
