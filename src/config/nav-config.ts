import { NavGroup } from '@/types';

export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard/overview',
        icon: 'dashboard',
        description: 'Overview metrics and activity',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'Projects Management',
        url: '/dashboard/projects',
        icon: 'workspace',
        description: 'Create and manage projects',
        isActive: false,
        shortcut: ['p', 'p'],
        items: []
      },
      {
        title: 'My Tasks',
        url: '/dashboard/tasks',
        icon: 'kanban',
        description: 'Your assigned task board',
        isActive: false,
        shortcut: ['t', 't'],
        items: []
      },
      {
        title: 'Form Builder',
        url: '/dashboard/forms/json-form-builder',
        icon: 'forms',
        description: 'Build and preview JSON forms',
        isActive: false,
        shortcut: ['f', 'b'],
        items: []
      }
    ]
  },
  {
    label: 'Administration',
    items: [
      {
        title: 'Users Management',
        url: '/dashboard/users',
        icon: 'teams',
        description: 'Invite and manage users',
        isActive: false,
        shortcut: ['u', 'u'],
        items: []
      },
      {
        title: 'Roles Management',
        url: '/dashboard/roles',
        icon: 'shield',
        description: 'Roles and access assignments',
        isActive: false,
        shortcut: ['r', 'r'],
        items: []
      }
    ]
  }
];
