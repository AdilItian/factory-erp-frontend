export const projectKeys = {
  all: ['projects'],
  lists: () => [...projectKeys.all, 'list'],
  list: (filters) => [...projectKeys.lists(), filters],
  detail: (id) => [...projectKeys.all, 'detail', id]
};

export const taskKeys = {
  all: ['tasks'],
  lists: () => [...taskKeys.all, 'list'],
  list: (filters) => [...taskKeys.lists(), filters],
  project: (projectId, filters) => [
    ...taskKeys.all,
    'project',
    projectId,
    filters
  ],
  mine: (filters) => [...taskKeys.all, 'me', filters],
  detail: (id) => [...taskKeys.all, 'detail', id]
};

export const authKeys = {
  all: ['auth']
};

export const roleKeys = {
  all: ['roles'],
  lists: () => [...roleKeys.all, 'list'],
  list: () => [...roleKeys.lists()]
};

export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), filters],
  options: () => [...userKeys.all, 'options']
};
