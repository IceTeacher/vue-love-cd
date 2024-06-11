<script setup lang="ts">
import { inject } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { AppRouter } from '../../../server/src/router';
import { createTRPCProxyClient } from '@trpc/client';
import { News } from '../api/type';
import Loading from '../components/Loading.vue';

// 引入trpc
const trpcClient = inject('trpcClient') as ReturnType<typeof createTRPCProxyClient<AppRouter>>;
if (!trpcClient) {
  throw new Error('trpcClient not provided');
}

const props = defineProps<{
  id: string;
}>();

// 根据id查找新闻动态
const {
  data: newsData,
  isLoading,
  isSuccess,
  isError,
} = useQuery<News>({
  queryKey: ['getNewsById'],
  queryFn: () => trpcClient.getNewsById.query({ id: Number(props.id) }),
});
</script>

<template>
  <div class="section">
    <Loading v-if="isLoading" />
    <div v-else-if="isSuccess && newsData" class="animate__animated animate__fadeInLeft flex flex-col">
      <div class="text-[28px] font-bold lg:text-[36px]">{{ newsData.title }}</div>
      <div class="my-5 max-w-[550px]">
        <img :src="newsData.imgUrl" />
      </div>
      <div>{{ newsData.desc }}</div>
    </div>
    <div
      v-else-if="isError"
      class="animate__animated animate__zoomIn my-5 flex justify-center text-[28px] font-bold lg:text-[36px]"
    >
      未找到该新闻动态，或该新闻动态已被删除
    </div>
  </div>
</template>

<style scoped></style>
