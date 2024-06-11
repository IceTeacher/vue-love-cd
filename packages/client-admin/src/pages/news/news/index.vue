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
import type { AppRouter } from '../../../../../server/src/router';
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
    title: '标题',
    align: 'left',
    width: 80,
    colKey: 'title',
  },
  { title: '封面', align: 'left', width: 100, colKey: 'imgUrl' },
  {
    title: '内容',
    align: 'left',
    width: 240,
    colKey: 'desc',
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
  queryKey: ['getNewsByPage', { page: pagination.value.current, pageSize: pagination.value.pageSize }],
  queryFn: () =>
    trpcClient.getNewsByPage.query({
      page: pagination.value.current,
      size: pagination.value.pageSize,
    }),
});

// 监听data总数
watch(data, (newValue, _oldValue) => {
  if (newValue && newValue.newsList.length !== 0) {
    pagination.value.total = data.value?.total!;
  }
});

// 删除索引
const deleteIdx = ref(-1);
const confirmBody = computed(() => {
  if (deleteIdx.value > -1 && isSuccess && data.value) {
    const { title } = data.value.newsList[deleteIdx.value];
    return `删除后，标题为 “${title}” 的新闻动态将被清空，且无法恢复`;
  }
  return '';
});

// 确认对话框可见性
const confirmVisible = ref(false);
const detailFormVisible = ref(false);
const dialogTitle = ref('新增新闻动态');
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
    const deleteId = data.value.newsList[deleteIdx.value].id;
    await trpcClient.deleteNewById.mutate({ id: deleteId });
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
  files.value = [];
  console.log('DetailForm取消');
};

// 表单详情框确认钩子
const onDetailFormConfirm = () => {
  form.value?.submit();
  if (uploadRef.value) {
    uploadRef.value.uploadFiles();
  }
  detailFormVisible.value = false;
  console.log('DetailForm确认');
};

// 打开表单详情框
const openDetailForm = async (item?: any) => {
  if (item) {
    dialogTitle.value = '修改新闻动态';
    dialogFormState.value = 'updateNews';
    const id = item.row.id;
    const result = await trpcClient.getNewsById.query({ id });
    if (result && formData) {
      form.value?.reset();
      files.value = [];
      files.value?.push({
        url: result.imgUrl,
      });
      formData.id = result.id;
      formData.title = result.title;
      formData.desc = result.desc;
      formData.imgUrl = result.imgUrl;
      detailFormVisible.value = true;
    }
  } else {
    dialogTitle.value = '新增新闻动态';
    dialogFormState.value = 'addNews';
    form.value?.reset();
    files.value = [];
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
  title: '',
  desc: '',
  imgUrl: '',
});
const rules: FormProps['rules'] = {
  title: [
    {
      required: true,
      message: '标题必填',
      type: 'error',
      trigger: 'blur',
    },
    {
      required: true,
      message: '标题必填',
      type: 'error',
      trigger: 'change',
    },
    {
      whitespace: true,
      message: '标题不能为空',
    },
    {
      min: 4,
      message: '标题字数应在4到24之间',
      type: 'error',
      trigger: 'blur',
    },
    {
      max: 24,
      message: '标题字数应在4到24之间',
      type: 'error',
      trigger: 'blur',
    },
  ],
  desc: [
    {
      required: true,
      message: '内容详情必填',
      type: 'error',
      trigger: 'blur',
    },
    {
      required: true,
      message: '内容详情必填',
      type: 'error',
      trigger: 'change',
    },
    {
      whitespace: true,
      message: '内容详情不能为空',
    },
    {
      min: 4,
      message: '内容详情字数应在4到360之间',
      type: 'error',
      trigger: 'blur',
    },
    {
      max: 360,
      message: '内容详情应在4到360之间',
      type: 'error',
      trigger: 'blur',
    },
  ],
  imgUrl: [{ required: true, type: 'error', trigger: 'change' }],
};
// 表单提交的监听事件
const onSubmit: FormProps['onSubmit'] = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    if (dialogFormState.value === 'addNews') {
      await trpcClient.addNews.mutate({
        title: formData.title,
        desc: formData.desc,
        imgUrl: `http://localhost:3000${formData.imgUrl}`,
      });
    } else {
      await trpcClient.updateNewsById.mutate({
        id: formData.id,
        title: formData.title,
        desc: formData.desc,
        imgUrl: formData.imgUrl.includes('http://localhost:3000')
          ? formData.imgUrl
          : `http://localhost:3000${formData.imgUrl}`,
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

// 图片上传配置
const files = ref<UploadProps['value']>([]);
const disabled = ref(false);
const uploadAllFilesInOneRequest = ref(false);
const autoUpload = ref(true);
const uploadRef = ref<UploadInstanceFunctions>();
const sizeLimit = ref<UploadProps['sizeLimit']>({
  size: 3 * 1024,
  unit: 'KB',
});
const abridgeName: UploadProps['abridgeName'] = [6, 6];
// 监听图片上传失败的钩子
const handleFail: UploadProps['onFail'] = ({ file }) => {
  MessagePlugin.error(`文件 ${file.name} 上传失败`);
};
// 监听图片上传成功的钩子
const handleSuccess: UploadProps['onSuccess'] = ({ file }) => {
  formData.imgUrl = file?.response?.data.imgUrl;
  MessagePlugin.success(`文件 ${file?.name} 上传成功`);
};
// 确认上传图片的钩子
const uploadFiles: ButtonProps['onClick'] = () => {
  if (uploadRef.value) {
    uploadRef.value.uploadFiles();
  }
};
/* // 监听formData变化
watch(formData, (newValue, _oldValue) => {
  console.log('formData变化', newValue);
});
// 监听files变化
watch(files, (newValue, _oldValue) => {
  console.log('files变化', newValue);
}); */
</script>

<template>
  <div>
    <!-- 卡片容器 -->
    <t-card class="list-card-container" :bordered="false">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-button @click="() => openDetailForm()">新增新闻动态</t-button>
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
        :data="data?.newsList"
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
        <template #title="{ row }">
          {{ row.title }}
        </template>
        <template #imgUrl="{ row }">
          <div class="tdesign-demo-image-viewer__base">
            <t-image-viewer :images="[`${row.imgUrl}`]">
              <template #trigger="{ open }">
                <div class="tdesign-demo-image-viewer__ui-image">
                  <img alt="test" :src="row.imgUrl" class="tdesign-demo-image-viewer__ui-image--img" />
                  <div class="tdesign-demo-image-viewer__ui-image--hover" @click="open">
                    <span><BrowseIcon size="1.4em" /> 预览</span>
                  </div>
                </div>
              </template>
            </t-image-viewer>
          </div>
        </template>
        <template #desc="{ row }"> {{ row.desc }} </template>

        <!-- 操作列的自定义模板 -->
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
      header="确认删除当前所选新闻动态？"
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
          <t-form-item label="标题" name="title" initial-data="">
            <t-input v-model="formData!.title" placeholder="请输入标题" />
          </t-form-item>
          <t-form-item label="内容详情" name="desc" initial-data="">
            <t-input v-model="formData!.desc" placeholder="请输入内容详情" />
          </t-form-item>
          <t-form-item label="封面图片" name="imgUrl" initial-data="">
            <t-upload
              ref="uploadRef"
              v-model="files"
              action="http://localhost:3002/api/upload"
              theme="image"
              tips="仅允许上传一张封面图片，限制图片格式为jpeg/jpg/png，且大小不超过3MB"
              accept="image/*"
              :size-limit="sizeLimit"
              :abridge-name="abridgeName"
              :disabled="disabled"
              :auto-upload="true"
              :upload-all-files-in-one-request="uploadAllFilesInOneRequest"
              :max="1"
              @fail="handleFail"
              @success="handleSuccess"
            ></t-upload>
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
