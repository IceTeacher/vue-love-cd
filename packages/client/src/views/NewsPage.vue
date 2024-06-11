<script setup lang="ts">
import { inject } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { AppRouter } from '../../../server/src/router';
import { createTRPCProxyClient } from '@trpc/client';
import { NewsList } from '../api/type';
import Loading from '../components/Loading.vue';
import News from '../components/News/index.vue';

// 引入trpc
const trpcClient = inject('trpcClient') as ReturnType<typeof createTRPCProxyClient<AppRouter>>;
if (!trpcClient) {
  throw new Error('trpcClient not provided');
}

// 根据需要数目查询新闻动态
const {
  data: newsData,
  isLoading,
  isSuccess,
} = useQuery<NewsList>({
  queryKey: ['getNewsByNum'],
  queryFn: () => trpcClient.getNewsByNum.query({ num: 10 }),
});
</script>

<template>
  <div v-if="isLoading">
    <Loading></Loading>
  </div>
  <div v-if="isSuccess && newsData && newsData.length > 0">
    <News :newsData="newsData"></News>
  </div>
</template>

<style scoped></style>
