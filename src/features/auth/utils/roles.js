/**
 * UI permission helpers — intentionally open.
 * Role-based gating is disabled at the UI layer for now.
 * Keep these exports so existing imports continue to work.
 */

export const APP_ROLES = {
  ADMIN: 'admin',
  PROJECT_MANAGER: 'project_manager',
  USER: 'user'
};

function normalizeRoleName(role) {
  if (!role) return '';
  const raw =
    typeof role === 'string'
      ? role
      : String(role.name ?? role.label ?? role.title ?? role.code ?? '');
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
}

export function getUserRoleNames(user) {
  return (user?.roles ?? []).map(normalizeRoleName).filter(Boolean);
}

export function hasAnyRole() {
  return true;
}

export function isAdmin() {
  return true;
}

export function canAccessProjects() {
  return true;
}

export function canManageProjectTasks() {
  return true;
}

export function canCreateProjectTasks() {
  return true;
}

export function canEditTaskDetails() {
  return true;
}

export function canUpdateTaskStatus() {
  return true;
}

export function canManageProjectSettings() {
  return true;
}

export function canAccessAdministration() {
  return true;
}

export function checkNavAccess() {
  return true;
}
