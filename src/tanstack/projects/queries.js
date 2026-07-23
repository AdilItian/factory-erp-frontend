import { queryOptions } from '@tanstack/react-query';
import boilerplateClient from '@/lib/axios/boilerplate-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { projectKeys } from '@/lib/query-keys';

async function fetchProjects(params, filterBody = []) {
  const res = await boilerplateClient.post(API_ENDPOINTS.PROJECTS.ALL, filterBody, {
    params,
    headers: { locale: 'EN' }
  });
  return res.data;
}

export const projectsQueryOptions = (params, filterBody = []) =>
  queryOptions({
    queryKey: projectKeys.list({ ...params, filterBody }),
    queryFn: () => fetchProjects(params, filterBody)
  });
