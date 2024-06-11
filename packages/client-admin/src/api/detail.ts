import type { ProjectListResult, PurchaseListResult } from '@/api/model/detailModel';
import { request } from '@/utils/request';

const Api = {
  PurchaseList: '/get-purchase-news',
  ProjectList: '/get-project-news',
};

export function getPurchaseList() {
  return request.get<PurchaseListResult>({
    url: Api.PurchaseList,
  });
}

export function getProjectList() {
  return request.get<ProjectListResult>({
    url: Api.ProjectList,
  });
}
