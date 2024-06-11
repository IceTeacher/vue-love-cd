// src/client.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/src/router'; // 替换为实际路径

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc', // 替换为你的 tRPC 服务器 URL
    }),
  ],
});

async function fetchMenuList() {
  try {
    const menuList = await trpc.getMenuList.query();
    console.log('Menu List:', menuList);
  } catch (error) {
    console.error('Error fetching menu news:', error);
  }
}

fetchMenuList();
