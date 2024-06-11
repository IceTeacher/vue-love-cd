import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../../../server/src/router';

type RouterOutputs = inferRouterOutputs<AppRouter>;
export type User = RouterOutputs['getUserById'];
export type UserList = RouterOutputs['getUserAll'];
export type NewsList = RouterOutputs['getNewsByNum'];
export type News = RouterOutputs['getNewsById'];
export type List = RouterOutputs['getListByNum'];
