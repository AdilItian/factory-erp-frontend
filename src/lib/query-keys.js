export const projectKeys = {
  all: ['projects'],
  lists: () => [...projectKeys.all, 'list'],
  list: (filters) => [...projectKeys.lists(), filters],
  detail: (id) => [...projectKeys.all, 'detail', id]
};

export const authKeys = {
  all: ['auth']
};
