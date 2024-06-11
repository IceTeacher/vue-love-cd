import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../../../server/src/router/index.ts';

type RouterOutputs = inferRouterOutputs<AppRouter>;
export type User = RouterOutputs['getUserById'];
export type UserList = RouterOutputs['getUserAll'];
export type NewsList = RouterOutputs['getNewsByNum'];
export type News = RouterOutputs['getNewsById'];
export type List = RouterOutputs['getListByNum'];
export type OrderFormData = RouterOutputs['addOrder'];
