import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './router';
import { createContext } from './trpc/context';
import path from 'path';
import logger from 'morgan';
import { indexRouter } from './router';

const app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);
app.use('/', indexRouter);

app.listen(3000, () => {
  console.log('Trpc Server is running on http://localhost:3000');
});
