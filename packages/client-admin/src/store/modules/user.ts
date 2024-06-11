import { defineStore } from 'pinia';

import { usePermissionStore } from '@/store';
import { trpcClient } from '../../api/trpc';

const InitUserInfo = {
  name: '', // 用户名，用于展示在页面右上角头像处
};

export const useUserStore = defineStore('user', {
  state: () => ({
    token: -1, // 默认token不走权限
    userInfo: { ...InitUserInfo },
  }),
  getters: {},
  actions: {
    async login(userInfo: Record<string, unknown>) {
      const mockLogin = async (userInfo: Record<string, unknown>) => {
        const { account, password } = userInfo;
        const result = await trpcClient.getUserByName.query({ name: account as string });
        if (result?.id && password == result?.password) {
          this.token = result.id;
          return {
            code: 200,
            message: '登录成功',
            data: result.id,
          };
        } else if (result?.id && password != result?.password) {
          return {
            code: 401,
            message: '密码错误',
          };
        } else {
          return {
            code: 401,
            message: '账号不存在',
          };
        }
      };
      const res = await mockLogin(userInfo);
      if (res.code === 200) {
        this.token = res.data!;
      } else {
        throw res;
      }
    },
    async getUserInfo() {
      /* const mockRemoteUserInfo = async (token: string) => {
        if (token === 'main_token') {
          return {
            name: 'Tencent',
            roles: ['all'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
          };
        }
        return {
          name: 'td_dev',
          roles: ['UserIndex', 'DashboardBase', 'login'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
        };
      };
      const res = await mockRemoteUserInfo(this.token); */

      const result = await trpcClient.getUserById.query({ id: this.token });
      this.userInfo = {
        name: result?.name!,
      };
    },
    async logout() {
      this.token = -1;
      this.userInfo = { ...InitUserInfo };
    },
  },
  persist: {
    afterRestore: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
    key: 'user',
    paths: ['token'],
  },
});
