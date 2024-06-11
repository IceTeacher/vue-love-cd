<script setup lang="ts">
import { reactive, inject } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import type { AppRouter } from '../../../server/src/router';
import { createTRPCProxyClient } from '@trpc/client';

// 引入trpc客户端
const trpcClient = inject('trpcClient') as ReturnType<typeof createTRPCProxyClient<AppRouter>>;
if (!trpcClient) {
  throw new Error('trpcClient not provided');
}

// 表单数据
const formData = reactive({
  name: '',
  gender: '0',
  email: '',
  tel: '',
  serviceType: '0',
  specifications: '0',
  date: '',
});

// 重置表单
const resetForm = () => {
  formData.name = '';
  formData.gender = '0';
  formData.email = '';
  formData.tel = '';
  formData.serviceType = '0';
  formData.specifications = '0';
  formData.date = '';
};

// 打开模态框
const openModal = (title: string, context: string) => {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 flex items-center justify-center z-50';
  modal.innerHTML = `
  <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

  <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">${title}</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">${context}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
    `;
  document.body.appendChild(modal);
  setTimeout(() => {
    modal.remove();
  }, 1000);
};

// 提交formData
const addOrderMutation = useMutation({
  mutationKey: ['addOrder'],
  mutationFn: async (formData: any) => await trpcClient.addOrder.mutate(formData!),
  retry: false,
  onSuccess: () => {
    resetForm();
    openModal('提交成功', '预约成功！');
  },
  onError: () => {
    openModal('提交失败', '预约失败，请检查表单内容');
  },
});

// 提交表单监听事件
const submitForm = async () => {
  // formData表单验证
  if (
    formData.name &&
    formData.gender &&
    formData.email &&
    formData.tel &&
    formData.serviceType &&
    formData.specifications &&
    formData.date
  ) {
    await addOrderMutation.mutateAsync(formData);
  } else {
    openModal('提交失败', '请填写完整表单！');
  }
};
</script>

<template>
  <div class="section animate__animated animate__fadeInLeft">
    <div class="w-full max-w-lg">
      <h1 class="text-[40px] font-bold">预约表单</h1>
      <div class="my-12">
        <div class="-mx-3 mb-6 flex flex-wrap">
          <div class="mb-6 w-full px-3 md:mb-0 md:w-1/2">
            <label class="text-ml mb-2 block font-bold uppercase tracking-wide text-gray-700" for="grid-first-name">
              姓名
            </label>
            <input
              class="mb-3 block w-full appearance-none rounded border border-transparent bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
              id="grid-first-name"
              type="text"
              placeholder="请输入您的姓名"
              v-model="formData.name"
            />
          </div>
          <div class="w-full px-3 md:w-1/2">
            <label class="text-ml mb-2 block font-bold uppercase tracking-wide text-gray-700" for="grid-last-name">
              称呼
            </label>
            <select
              class="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              id="grid-state"
              v-model="formData.gender"
            >
              <option value="0">先生</option>
              <option value="1">女士</option>
            </select>
          </div>
        </div>

        <div class="-mx-3 mb-6 flex flex-wrap">
          <div class="w-full px-3">
            <label class="text-ml mb-2 block font-bold uppercase tracking-wide text-gray-700" for="grid-email">
              电子邮件
            </label>
            <input
              class="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              id="grid-email"
              type="email"
              placeholder="请输入您的电子邮箱地址"
              v-model="formData.email"
            />
          </div>
        </div>

        <div class="-mx-3 mb-6 flex flex-wrap">
          <div class="w-full px-3">
            <label class="text-ml mb-2 block font-bold uppercase tracking-wide text-gray-700" for="grid-tel">
              电话号码
            </label>
            <input
              class="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              id="grid-tel"
              type="tel"
              placeholder="请输入您的电话号码"
              v-model="formData.tel"
            />
          </div>
        </div>

        <div class="-mx-3 mb-2 flex flex-wrap">
          <div class="mb-6 w-full px-3 md:mb-0 md:w-1/3">
            <label class="text-ml mb-2 block font-bold uppercase tracking-wide text-gray-700" for="grid-serviceType">
              预约服务类型
            </label>
            <div class="relative">
              <select
                class="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                id="grid-serviceType"
                v-model="formData.serviceType"
              >
                <option value="0">摄影预约</option>
                <option value="1">摄像预约</option>
                <option value="2">写真预约</option>
              </select>
            </div>
          </div>
          <div class="mb-6 w-full px-3 md:mb-0 md:w-1/3">
            <label class="text-ml mb-2 block font-bold uppercase tracking-wide text-gray-700" for="grid-specifications">
              规格选取
            </label>
            <div class="relative">
              <select
                class="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                id="grid-specifications"
                v-model="formData.specifications"
              >
                <option value="0">尊享</option>
                <option value="1">高端</option>
                <option value="2">大众</option>
              </select>
            </div>
          </div>
          <div class="mb-6 w-full px-3 md:mb-0 md:w-1/3">
            <label class="text-ml mb-2 block font-bold uppercase tracking-wide text-gray-700" for="grid-date">
              预约日期和时间
            </label>
            <input
              class="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              id="grid-date"
              type="datetime-local"
              v-model="formData.date"
            />
          </div>
        </div>
      </div>
      <button class="btn mt-5" @click="submitForm">提交表单</button>
    </div>
  </div>
</template>

<style scoped></style>
