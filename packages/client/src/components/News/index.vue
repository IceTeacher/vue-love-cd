<script setup lang="ts">
import { NewsList } from '../../api/type';
import EvenNews from './EvenNews.vue';
import OddNews from './OddNews.vue';

// 接受父组件传递的Props
const props = defineProps<{
  newsData: NewsList;
}>();
</script>

<template>
  <div class="section" id="news">
    <div class="animate__animated animate__pulse mb-10 text-[1.8rem] font-bold sm:text-[2.5rem]">新闻动态</div>
    <div v-for="(item, index) in props.newsData" :key="item.id">
      <OddNews v-if="index % 2 === 0" :key="item.id" :item="item"></OddNews>
      <EvenNews v-if="index % 2 !== 0" :key="item.id" :item="item"></EvenNews>
    </div>
  </div>
</template>

<style scoped></style>
