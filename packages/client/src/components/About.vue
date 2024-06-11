<script setup lang="ts">
import { inject, ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { AppRouter } from '../../../server/src/router';
import { createTRPCProxyClient } from '@trpc/client';
import { NewsList } from '../api/type';
import Loading from './Loading.vue';
import { FaArrowRight } from 'vue3-icons/fa';

// 引入trpc
const trpcClient = inject('trpcClient') as ReturnType<typeof createTRPCProxyClient<AppRouter>>;
if (!trpcClient) {
  throw new Error('trpcClient not provided');
}

// 根据数量查找新闻动态
const {
  data: newsData,
  isLoading,
  isSuccess,
} = useQuery<NewsList>({
  queryKey: ['getNewsByNum'],
  queryFn: () => trpcClient.getNewsByNum.query({ num: 2 }),
});
</script>

<template>
  <div v-if="isLoading">
    <Loading></Loading>
  </div>
  <div v-if="isSuccess && newsData && newsData.length > 0" class="section" id="about">
    <div class="wow animate__fadeInLeft mb-10 grid items-center gap-10 md:grid-cols-2">
      <div class="mb-6 flex flex-col items-start justify-center gap-6">
        <div class="btn_pin_fast text-xl font-bold sm:text-3xl">
          {{ newsData[0].title }}
        </div>
        <p class="btn_pin_fast optional-70 text-sm">{{ newsData[0].desc }}</p>
        <a to="/news">
          <RouterLink :to="`/news/${newsData[0].id}`" class="btn">
            <div class="text-[0.85rem] text-white">了解更多</div>
            <FaArrowRight class="text-white" />
          </RouterLink>
        </a>
      </div>
      <div class="wow animate__zoomIn max-w-[550px] md:row-start-1">
        <img class="btn_pin_fast" :src="newsData[0].imgUrl" :alt="newsData[0].title" />
      </div>
    </div>

    <div class="wow animate__fadeInRight mb-10 grid items-center gap-10 md:grid-cols-2">
      <div>
        <div class="btn_pin_fast mb-6 text-xl font-bold sm:text-3xl" ref="{ref}">
          {{ newsData[1].title }}
        </div>
        <p class="btn_pin_fast optional-70 text-sm">{{ newsData[1].desc }}</p>
      </div>
      <div class="wow animate__zoomIn max-w-[550px]">
        <img class="btn_pin_fast" :src="newsData[1].imgUrl" :alt="newsData[1].title" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
