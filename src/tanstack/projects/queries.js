import { queryOptions } from '@tanstack/react-query';
import coreServiceClient from '@/lib/axios/core-service-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { projectKeys } from '@/lib/query-keys';

async function fetchProjects(params, filterBody = []) {
  const res = await coreServiceClient.post(API_ENDPOINTS.PROJECTS.ALL, filterBody, {
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
