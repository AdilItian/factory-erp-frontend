import { NavGroup } from '@/types';

export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard/overview',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'Projects',
        url: '/dashboard/projects',
        icon: 'workspace',
        isActive: false,
        shortcut: ['p', 'p'],
        items: []
      }
    ]
  }
];
