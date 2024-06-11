<script setup lang="ts">
import { useRouter } from 'vue-router';
import { News } from '../../api/type';
import Loading from '../Loading.vue';

// 接受父组件传递的Props
const props = defineProps<{
  item: News;
}>();

const router = useRouter(); // 获取路由实例
const goNewsDetail = (id: number) => {
  router.push(`/news/${id}`);
};
</script>

<template>
  <div v-if="props.item === null">
    <Loading />
  </div>
  <div v-else>
    <div
      @click="goNewsDetail(props.item.id)"
      class="wow animate__fadeInLeft mb-10 grid items-center gap-10 md:grid-cols-2"
    >
      <div class="mb-6 flex flex-col items-start justify-center gap-6">
        <div class="text-xl font-bold sm:text-3xl" ref="{ref}">{{ props.item.title }}</div>
        <p class="optional-70 text-sm">{{ props.item.desc }}</p>
      </div>
      <div class="btn_pin_fast max-w-[550px] md:row-start-1">
        <img :src="props.item.imgUrl" :alt="props.item.title" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
