<script setup lang="ts">
import { inject, ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { AppRouter } from '../../../server/src/router';
import { createTRPCProxyClient } from '@trpc/client';
import { List } from '../api/type';
import Loading from './Loading.vue';
// 引入trpc
const trpcClient = inject('trpcClient') as ReturnType<typeof createTRPCProxyClient<AppRouter>>;
if (!trpcClient) {
  throw new Error('trpcClient not provided');
}

// 根据数量查找列表详情
const {
  data: listData,
  isLoading,
  isSuccess,
} = useQuery<List>({
  queryKey: ['getListByNum'],
  queryFn: () => trpcClient.getListByNum.query({ num: 6 }),
});
</script>

<template>
  <div v-if="isLoading">
    <Loading></Loading>
  </div>
  <div v-if="isSuccess && listData && listData.length > 0" class="section" id="list">
    <div class="wow animate__fadeInLeft flex flex-col items-center">
      <div class="mb-16 text-center text-3xl font-bold" ref="{ref}">我们的优势</div>
      <div class="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="item in listData" :key="item.id" class="btn_pin">
          <div class="wow animate__zoomIn cursor-pointer p-4 shadow-lg transition-all duration-300 hover:shadow">
            <img :src="item.imgUrl" alt="" class="mb-4 rounded-lg" />
            <div class="mb-4 text-[1rem] font-semibold md:text-xl">{{ item.title }}</div>
            <p class="optional-70 mb-4 text-[0.85rem]">{{ item.desc }}</p>
          </div>
        </div>
      </div>
      <RouterLink to="/news">
        <div class="btn cursor-pointer">查看更多</div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped></style>
