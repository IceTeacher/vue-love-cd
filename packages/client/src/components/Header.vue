<script setup lang="ts">
import { ref } from 'vue';
import { AiOutlineMenu } from 'vue3-icons/ai';
import { useRoute } from 'vue-router';

// 判断当前路由并匹配高亮
const route = useRoute();
const isActive = (path: string) => {
  return route.path === path;
};

const isClick = ref(true);
const menuClass = ref('opacity-100');
const hiddenMenu = () => {
  if (!isClick.value) {
    // 如果当前是显示状态，先开始淡出动画
    setTimeout(() => {
      // 动画完成后，更新isClick状态并隐藏菜单
      isClick.value = true;
    }, 300);
    menuClass.value = 'opacity-0';
    setTimeout(() => {
      menuClass.value = 'opacity-100';
    }, 300);
  } else {
    // 如果当前是隐藏状态，先显示菜单
    menuClass.value = 'opacity-0';
    isClick.value = false;
    setTimeout(() => {
      // 显示菜单后，再播放动画
      menuClass.value = 'opacity-100';
    }, 100);
  }
};
</script>

<template>
  <header class="fixed left-0 top-0 z-20 w-full bg-white">
    <nav class="container relative mx-auto flex flex-wrap items-center justify-between px-2 py-4">
      <a href="/" class="animate__animated animate__pulse btn_pin_fast">
        <h4 class="text-xl font-semibold">RainAfter</h4>
        <span class="text-sm font-bold opacity-70">雨后晓晴婚纱摄影工作室</span>
      </a>

      <div
        @click="hiddenMenu"
        class="relative flex h-12 w-10 cursor-pointer items-center justify-center rounded-t-xl rounded-br-3xl bg-black md:hidden"
      >
        <AiOutlineMenu class="text-2xl text-white" />
      </div>

      <div :class="isClick ? 'hidden' : menuClass" class="w-full md:flex md:w-auto md:items-center" id="menu">
        <ul class="pt-4 text-base text-gray-700 md:flex md:items-start md:justify-between md:pt-0">
          <li>
            <RouterLink to="/" class="block py-2 md:p-4" :class="{ 'font-semibold': isActive('/') }"> 首页 </RouterLink>
          </li>
          <li>
            <RouterLink to="/news" class="block py-2 md:p-4" :class="{ 'font-semibold': isActive('/news') }">
              动态
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/order" class="block py-2 md:p-4" :class="{ 'font-semibold': isActive('/order') }">
              决定选单
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/contact" class="block py-2 md:p-4" :class="{ 'font-semibold': isActive('/contact') }">
              联系我们
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style scoped></style>
