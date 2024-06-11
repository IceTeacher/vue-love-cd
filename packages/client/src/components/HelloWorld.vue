<script setup lang="ts">
import { inject, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { AppRouter } from "../../../server/src/router";
import { createTRPCProxyClient } from "@trpc/client";
import { User, UserList } from "../api/type";

const trpcClient = inject("trpcClient") as ReturnType<
  typeof createTRPCProxyClient<AppRouter>
>;
if (!trpcClient) {
  throw new Error("trpcClient not provided");
}

// 根据id查询用户
const userId = ref<number | null>(null);
const isGetUser = ref(false);
const { data: users, refetch } = useQuery<User>({
  queryKey: ["getUser", { id: userId.value }],
  queryFn: () => trpcClient.getUserById.query({ id: userId.value! }),
  enabled: userId.value !== null && isGetUser.value,
  retry: false,
});
const fetchUser = () => {
  isGetUser.value = true;
  refetch();
  isGetUser.value = false;
};

// 查询所有用户
const { data: userList } = useQuery<UserList>({
  queryKey: ["getUserAll"],
  queryFn: () => trpcClient.getUserAll.query(),
});
</script>

<template>
  <div class="mb-4">
    <div class="flex flex-col items-start">
      <div class="mb-2 text-2xl font-bold">User List</div>
      <div v-for="item in userList">
        <div>{{ item }}</div>
      </div>
    </div>
  </div>

  <div class="flex flex-col items-start">
    <div class="mb-2 text-2xl font-bold">User</div>
    <div>{{ users }}</div>
    <input type="number" v-model="userId" placeholder="请输入id" />
    <button @click="fetchUser">请求数据</button>
  </div>
</template>
