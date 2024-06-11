<script lang="ts">
export default {
  name: 'ListBase',
};
</script>

<script setup lang="ts">
import { SearchIcon, BrowseIcon, EditIcon, DeleteIcon } from 'tdesign-icons-vue-next';
import {
  ButtonProps,
  FormInstanceFunctions,
  FormProps,
  MessagePlugin,
  PrimaryTableCol,
  TableRowData,
  UploadInstanceFunctions,
  UploadProps,
} from 'tdesign-vue-next';
import { computed, ref, inject, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { prefix } from '@/config/global';
import { useSettingStore } from '@/store';
import { useQuery } from '@tanstack/vue-query';
import type { AppRouter } from '../../../../server/src/router';
import { createTRPCProxyClient } from '@trpc/client';

// 引入trpc
const trpcClient = inject('trpcClient') as ReturnType<typeof createTRPCProxyClient<AppRouter>>;
if (!trpcClient) {
  throw new Error('trpcClient not provided');
}

// 使用设置存储
const store = useSettingStore();

// 表格列定义
const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 30, fixed: 'left' },
  {
    title: '姓名',
    align: 'left',
    width: 50,
    colKey: 'name',
  },
  {
    title: '性别',
    align: 'left',
    width: 50,
    colKey: 'gender',
  },
  {
    title: '电子邮件',
    align: 'left',
    width: 100,
    colKey: 'email',
  },
  {
    title: '电话',
    align: 'left',
    width: 80,
    colKey: 'tel',
  },
  {
    title: '服务类型',
    align: 'left',
    width: 50,
    colKey: 'serviceType',
  },
  {
    title: '规格',
    align: 'left',
    width: 50,
    colKey: 'specifications',
  },
  {
    title: '日期',
    align: 'left',
    width: 80,
    colKey: 'date',
  },
  {
    title: '操作',
    align: 'left',
    width: 120,
    colKey: 'op',
  },
];

// 数据和分页状态
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 5,
});

// 搜索值
const searchValue = ref('');

// 数据加载状态
const {
  data,
  isLoading: dataLoading,
  isSuccess,
  refetch,
} = useQuery({
  queryKey: ['', { page: pagination.value.current, pageSize: pagination.value.pageSize }],
  queryFn: () =>
    trpcClient.getOrderByPage.query({
      page: pagination.value.current,
      size: pagination.value.pageSize,
    }),
});

// 监听data总数
watch(data, (newValue, _oldValue) => {
  if (newValue && newValue.list.length !== 0) {
    pagination.value.total = data.value?.total!;
  }
});

// 删除索引
const deleteIdx = ref(-1);
const confirmBody = computed(() => {
  if (deleteIdx.value > -1 && isSuccess && data.value) {
    const { name } = data.value.list[deleteIdx.value];
    return `删除后，名称为 “${name}” 的用户将被删除，且无法恢复`;
  }
  return '';
});

// 确认对话框可见性
const confirmVisible = ref(false);
const detailFormVisible = ref(false);
const dialogTitle = ref('新增用户');
const dialogFormState = ref('addNews');

// 选中的行键值
const selectedRowKeys = ref<number[]>([]);

// 处理点击删除
const handleClickDelete = (row: { rowIndex: any }) => {
  deleteIdx.value = row.rowIndex;
  confirmVisible.value = true;
};
// 重置删除索引
const resetIdx = () => {
  deleteIdx.value = -1;
};
// 确认删除
const onConfirmDelete = async () => {
  if (isSuccess && data.value) {
    const deleteId = data.value.list[deleteIdx.value].id;
    await trpcClient.deleteOrderById.mutate({ id: deleteId });
    // 判断删除的数据是否是当前页的第一个数据
    const isDeletingFirstItemOnPage = deleteIdx.value === 0 && pagination.value.current > 1;
    // 重新获取数据前调整分页
    if (isDeletingFirstItemOnPage) {
      pagination.value.current -= 1;
    }
    refetch();
    const selectedIdx = selectedRowKeys.value.indexOf(deleteIdx.value);
    if (selectedIdx > -1) {
      selectedRowKeys.value.splice(selectedIdx, 1);
    }
    confirmVisible.value = false;
    MessagePlugin.success('删除成功');
    resetIdx();
  }
};

// 取消删除
const onCancel = () => {
  resetIdx();
};

// 行键
const rowKey = 'id';
// 处理选择变化
const rehandleSelectChange = (val: number[]) => {
  selectedRowKeys.value = val;
};

// 处理分页变化
const rehandlePageChange = (curr: { current: number; previous: number; pageSize: number }) => {
  console.log('分页变化', curr);
  pagination.value.current = curr.current;
  pagination.value.pageSize = curr.pageSize;
  refetch();
};

// 表单详情框取消钩子
const onDetailFormCancel = () => {
  detailFormVisible.value = false;
  form.value?.reset();
  console.log('DetailForm取消');
};

// 表单详情框确认钩子
const onDetailFormConfirm = () => {
  form.value?.submit();
  detailFormVisible.value = false;
  console.log('DetailForm确认');
};

// 打开表单详情框
const openDetailForm = async (item?: any) => {
  if (item) {
    dialogTitle.value = '修改用户';
    dialogFormState.value = 'updateNews';
    const id = item.row.id;
    const result = await trpcClient.getOrderById.query({ id });
    if (result && formData) {
      form.value?.reset();
      // 为formData赋值
      Object.assign(formData, result);
      detailFormVisible.value = true;
    }
  } else {
    dialogTitle.value = '新增用户';
    dialogFormState.value = 'addNews';
    form.value?.reset();
    detailFormVisible.value = true;
  }
};

// 表头固定配置
const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    }) as any,
);
const form = ref<FormInstanceFunctions>();
const formData: FormProps['data'] = reactive({
  name: '',
  gender: '0',
  email: '',
  tel: '',
  serviceType: '0',
  specifications: '0',
  date: '',
});
const rules: FormProps['rules'] = {
  name: [
    {
      required: true,
      message: '用户名必填',
      type: 'error',
      trigger: 'blur',
    },
    {
      required: true,
      message: '用户名必填',
      type: 'error',
      trigger: 'change',
    },
    {
      whitespace: true,
      message: '用户名不能为空',
    },
    {
      min: 3,
      message: '用户名字数应在3到12之间',
      type: 'error',
      trigger: 'blur',
    },
    {
      max: 12,
      message: '用户名字数应在3到12之间',
      type: 'error',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '密码必填',
      type: 'error',
      trigger: 'blur',
    },
    {
      required: true,
      message: '密码必填',
      type: 'error',
      trigger: 'change',
    },
    {
      whitespace: true,
      message: '密码不能为空',
    },
    {
      min: 3,
      message: '密码字数应在3到20之间',
      type: 'error',
      trigger: 'blur',
    },
    {
      max: 20,
      message: '密码应在3到20之间',
      type: 'error',
      trigger: 'blur',
    },
  ],
  roleId: [
    {
      required: true,
      message: '角色必填',
      type: 'warning',
      trigger: 'change',
    },
  ],
};
// 表单提交的监听事件
const onSubmit: FormProps['onSubmit'] = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    if (dialogFormState.value === 'addNews') {
      await trpcClient.addOrder.mutate({
        name: formData.name,
        gender: formData.gender,
        email: formData.email,
        tel: formData.tel,
        serviceType: formData.serviceType,
        specifications: formData.specifications,
        date: formData.date,
      });
    } else {
      await trpcClient.updateOrderById.mutate({
        id: formData.id,
        name: formData.name,
        gender: formData.gender,
        email: formData.email,
        tel: formData.tel,
        serviceType: formData.serviceType,
        specifications: formData.specifications,
        date: formData.date,
      });
    }
    await refetch();
    detailFormVisible.value = false;
    console.log('DetailForm确认');
    MessagePlugin.success('提交成功');
  } else {
    console.log('Errors: ', validateResult);
    MessagePlugin.warning(firstError!);
  }
};
</script>

<template>
  <div>
    <!-- 卡片容器 -->
    <t-card class="list-card-container" :bordered="false">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-button @click="() => openDetailForm()">新增用户</t-button>
          <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length">删除选中项</t-button>
          <!-- 已选择项目数量 -->
          <p v-if="!!selectedRowKeys.length" class="selected-count">
            {{ $t('pages.listBase.select') }} {{ selectedRowKeys.length }} {{ $t('pages.listBase.items') }}
          </p>
        </div>
        <div class="search-input">
          <!-- 搜索输入框 -->
          <t-input v-model="searchValue" :placeholder="$t('pages.listBase.placeholder')" clearable>
            <template #suffix-icon>
              <search-icon size="16px" />
            </template>
          </t-input>
        </div>
      </t-row>
      <!-- 表格组件 -->
      <t-table
        :data="data?.list"
        :columns="COLUMNS"
        :row-key="rowKey"
        vertical-align="top"
        :hover="true"
        :pagination="pagination"
        :selected-row-keys="selectedRowKeys"
        :loading="dataLoading"
        :header-affixed-top="headerAffixedTop"
        @page-change="rehandlePageChange"
        @select-change="(value: number[]) => rehandleSelectChange(value)"
      >
        <template #name="{ row }">{{ row.name }}</template>
        <template #gender="{ row }">{{ row.gender == 0 ? '男' : '女' }}</template>
        <template #email="{ row }">{{ row.email }}</template>
        <template #tel="{ row }">{{ row.tel }}</template>
        <template #serviceType="{ row }">
          <t-tag v-if="row.serviceType == 0" shape="round" theme="primary">摄影</t-tag>
          <t-tag v-else-if="row.serviceType == 1" shape="round" theme="primary">摄像</t-tag>
          <t-tag v-else shape="round" theme="primary">写真</t-tag>
        </template>
        <template #specifications="{ row }">
          <t-tag v-if="row.specifications == 0" shape="round" theme="success">尊享</t-tag>
          <t-tag v-else-if="row.specifications == 1" shape="round" theme="success">高端</t-tag>
          <t-tag v-else shape="round" theme="success">大众</t-tag>
        </template>
        <template #date="{ row }">{{ row.date }}</template>
        <template #op="slotProps">
          <t-space>
            <t-button size="small" theme="primary" @click="() => openDetailForm(slotProps)">
              <template #icon><EditIcon /></template>
              修改
            </t-button>
            <t-button size="small" theme="danger" @click="handleClickDelete(slotProps)">
              <template #icon><DeleteIcon /></template>
              删除
            </t-button>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <!-- 删除确认对话框 -->
    <t-dialog
      :body="confirmBody"
      :on-cancel="onCancel"
      @confirm="onConfirmDelete"
      v-model:visible="confirmVisible"
      header="确认删除当前所选用户？"
    />

    <!-- 信息详情表单 -->
    <t-dialog
      v-model:visible="detailFormVisible"
      :header="dialogTitle"
      :confirm-on-enter="true"
      :footer="false"
      :on-close="onDetailFormCancel"
    >
      <t-space direction="vertical" style="width: 100%">
        <t-form labelAlign="left" ref="form" :data="formData" :rules="rules" @submit="onSubmit" preventSubmitDefault>
          <t-form-item label="姓名" name="name" initial-data="">
            <t-input v-model="formData!.name" placeholder="请输入姓名" />
          </t-form-item>
          <t-form-item label="性别" name="gender" initial-data="">
            <t-radio-group v-model="formData!.gender">
              <t-radio value="0">男</t-radio>
              <t-radio value="1">女</t-radio>
            </t-radio-group>
          </t-form-item>
          <t-form-item label="电子邮件" name="email" initial-data="">
            <t-input v-model="formData!.email" placeholder="请输入电子邮件" />
          </t-form-item>
          <t-form-item label="电话" name="tel" initial-data="">
            <t-input v-model="formData!.tel" placeholder="请输入电话号码" />
          </t-form-item>
          <t-form-item label="服务类型" name="serviceType" initial-data="">
            <t-radio-group v-model="formData!.serviceType">
              <t-radio value="0">摄影</t-radio>
              <t-radio value="1">摄像</t-radio>
              <t-radio value="2">写真</t-radio>
            </t-radio-group>
          </t-form-item>
          <t-form-item label="规格" name="specifications" initial-data="">
            <t-radio-group v-model="formData!.specifications">
              <t-radio value="0">尊享</t-radio>
              <t-radio value="1">高端</t-radio>
              <t-radio value="2">大众</t-radio>
            </t-radio-group>
          </t-form-item>
          <t-form-item label="日期" name="date" initial-data="">
            <input
              class="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              id="grid-date"
              type="datetime-local"
              v-model="formData!.date"
            />
          </t-form-item>
          <t-form-item>
            <t-space size="small">
              <t-button theme="primary" type="submit">提交</t-button>
              <t-button theme="default" variant="base" type="reset">重置</t-button>
            </t-space>
          </t-form-item>
        </t-form>
      </t-space>
    </t-dialog>
  </div>
</template>

<style lang="less" scoped>
.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: var(--td-comp-margin-s);
  }
}

.list-card-container {
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);

  :deep(.t-card__body) {
    padding: 0;
  }
}

.left-operation-container {
  display: flex;
  align-items: center;
  margin-bottom: var(--td-comp-margin-xxl);

  .selected-count {
    display: inline-block;
    margin-left: var(--td-comp-margin-l);
    color: var(--td-text-color-secondary);
  }
}

.search-input {
  width: 360px;
}

.tdesign-demo-image-viewer__ui-image {
  width: 100%;
  height: 100%;
  display: inline-flex;
  position: relative;
  justify-content: center;
  align-items: center;
  border-radius: var(--td-radius-small);
  overflow: hidden;
}

.tdesign-demo-image-viewer__ui-image--hover {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: var(--td-text-color-anti);
  line-height: 22px;
  transition: 0.2s;
}

.tdesign-demo-image-viewer__ui-image:hover .tdesign-demo-image-viewer__ui-image--hover {
  opacity: 1;
  cursor: pointer;
}

.tdesign-demo-image-viewer__ui-image--img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
  position: absolute;
}

.tdesign-demo-image-viewer__ui-image--footer {
  padding: 0 16px;
  height: 56px;
  width: 100%;
  line-height: 56px;
  font-size: 16px;
  position: absolute;
  bottom: 0;
  color: var(--td-text-color-anti);
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
  display: flex;
  box-sizing: border-box;
}

.tdesign-demo-image-viewer__ui-image--title {
  flex: 1;
}

.tdesign-demo-popup__reference {
  margin-left: 16px;
}

.tdesign-demo-image-viewer__ui-image--icons .tdesign-demo-icon {
  cursor: pointer;
}

.tdesign-demo-image-viewer__base {
  width: 160px;
  height: 90px;
}
</style>
