import type { CardListResult, ListResult } from '@/api/model/listModel';
import { request } from '@/utils/request';

const Api = {
  BaseList: '/get-news',
  CardList: '/get-card-news',
};

export function getList() {
  return request.get<ListResult>({
    url: Api.BaseList,
  });
}

export function getCardList() {
  return request.get<CardListResult>({
    url: Api.CardList,
  });
}
