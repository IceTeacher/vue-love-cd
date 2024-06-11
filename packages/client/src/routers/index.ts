import { createRouter, createWebHistory } from 'vue-router';
import { constantRoute } from './router';

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoute,
  scrollBehavior(_to, _from, savedPosition) {
    // 如果 savedPosition 存在，表示是通过浏览器前进/后退按钮触发的导航，返回 savedPosition
    if (savedPosition) {
      return savedPosition;
    } else {
      // 否则，滚动到页面顶部
      return { left: 0, top: 0 };
    }
  },
});

export default router;
