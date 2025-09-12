# ProScaffold 页面脚手架组件

一个功能强大的页面布局脚手架组件，基于现代化的设计理念构建，用于快速搭建标准化的页面布局。组件提供了头部、内容和底部的完整布局结构，支持加载状态、返回按钮、内容宽度控制等特性，帮助开发者快速构建一致性的页面界面。

<script setup>
import { ref } from 'vue'
import { Button as TButton, Input as TInput, Form as TForm, FormItem as TFormItem } from 'tdesign-vue-next'

// 基础示例数据
const loading1 = ref(false)
const loading2 = ref(false)

// 表单数据
const formData1 = ref({
  username: 'John',
  email: 'john@example.com'
})

// 事件处理方法
const handleCancel = () => {
  console.log('取消操作')
}

const handleSave = () => {
  console.log('保存数据:', formData1.value)
}

const handleCustomBack = () => {
  if (confirm('确定要离开当前页面吗？')) {
    console.log('自定义返回逻辑')
  }
}

const toggleLoading = () => {
  loading2.value = !loading2.value
}

const refreshData = async () => {
  loading2.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('数据刷新完成')
  } finally {
    loading2.value = false
  }
}

const data = ref([
  { id: 1, name: '项目 A' },
  { id: 2, name: '项目 B' },
  { id: 3, name: '项目 C' }
])
</script>

## 基础用法

最简单的页面脚手架用法。

<DemoBox title="基础用法" description="最简单的页面脚手架布局">
  <ProScaffold>
    <div class="text-center p-5">
      <h2 class="text-lg text-[color:var(--vp-c-text-1)] mt-0 mb-3 mx-0">页面内容</h2>
      <p class="text-[color:var(--vp-c-text-2)] m-0">这里是页面的主要内容区域。</p>
    </div>
  </ProScaffold>
</DemoBox>

```vue
<template>
  <ProScaffold>
    <div>
      <h2>页面内容</h2>
      <p>这里是页面的主要内容区域。</p>
    </div>
  </ProScaffold>
</template>

<script setup>
// 无需额外导入
</script>
```

## 带头部和底部

使用插槽添加头部和底部内容。

<DemoBox title="带头部和底部" description="完整的页面布局结构">
  <ProScaffold>
    <template #header>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">用户管理</h1>
        <TButton theme="primary">新增用户</TButton>
      </div>
    </template>
    <div class="space-y-4">
      <p>这里是页面的主要内容。</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 border rounded">卡片 1</div>
        <div class="p-4 border rounded">卡片 2</div>
        <div class="p-4 border rounded">卡片 3</div>
      </div>
    </div>
    <template #footer>
      <TButton variant="outline">取消</TButton>
      <TButton theme="primary">保存</TButton>
    </template>
  </ProScaffold>
</DemoBox>

```vue
<template>
  <ProScaffold>
    <template #header>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">用户管理</h1>
        <TButton theme="primary">新增用户</TButton>
      </div>
    </template>

    <div class="space-y-4">
      <p>这里是页面的主要内容。</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 border rounded">卡片 1</div>
        <div class="p-4 border rounded">卡片 2</div>
        <div class="p-4 border rounded">卡片 3</div>
      </div>
    </div>

    <template #footer>
      <TButton variant="outline">取消</TButton>
      <TButton theme="primary">保存</TButton>
    </template>
  </ProScaffold>
</template>

<script setup>
// 组件自动导入
</script>
```

## 显示返回按钮

设置 `show-back-button` 显示返回按钮。

<DemoBox title="显示返回按钮" description="在左上角显示返回按钮">
  <ProScaffold show-back-button>
    <template #header>
      <h1 class="text-xl text-[color:var(--vp-c-text-1)] m-0">编辑用户信息</h1>
    </template>
    <div>
      <TForm :data="formData1">
        <TFormItem label="用户名" name="username">
          <TInput v-model="formData1.username" />
        </TFormItem>
        <TFormItem label="邮箱" name="email">
          <TInput v-model="formData1.email" />
        </TFormItem>
      </TForm>
    </div>
    <template #footer>
      <TButton variant="outline" @click="handleCancel">取消</TButton>
      <TButton theme="primary" @click="handleSave">保存</TButton>
    </template>
  </ProScaffold>
</DemoBox>

```vue
<template>
  <ProScaffold show-back-button>
    <template #header>
      <h1>编辑用户信息</h1>
    </template>

    <div>
      <TForm :data="formData">
        <TFormItem label="用户名" name="username">
          <TInput v-model="formData.username" />
        </TFormItem>
        <TFormItem label="邮箱" name="email">
          <TInput v-model="formData.email" />
        </TFormItem>
      </TForm>
    </div>

    <template #footer>
      <TButton variant="outline" @click="handleCancel">取消</TButton>
      <TButton theme="primary" @click="handleSave">保存</TButton>
    </template>
  </ProScaffold>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  username: '',
  email: ''
})

const handleCancel = () => {
  router.back()
}

const handleSave = () => {
  console.log('保存数据:', formData.value)
}
</script>
```

## 自定义返回按钮

通过 `backButton` 插槽自定义返回按钮。

<DemoBox title="自定义返回按钮" description="使用插槽自定义返回按钮">
  <ProScaffold show-back-button>
    <template #backButton>
      <TButton
        shape="round"
        variant="outline"
        size="small"
        @click="handleCustomBack"
      >
        返回列表
      </TButton>
    </template>
    <template #header>
      <h1 class="text-xl text-[color:var(--vp-c-text-1)] m-0">详情页面</h1>
    </template>
    <div>
      <p>这是一个详情页面，有自定义的返回按钮。</p>
    </div>
  </ProScaffold>
</DemoBox>

```vue
<template>
  <ProScaffold show-back-button>
    <template #backButton>
      <TButton shape="round" variant="outline" size="small" @click="handleCustomBack">
        <ChevronLeftIcon />
        返回列表
      </TButton>
    </template>

    <template #header>
      <h1>详情页面</h1>
    </template>

    <div>
      <p>这是一个详情页面，有自定义的返回按钮。</p>
    </div>
  </ProScaffold>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleCustomBack = () => {
  // 自定义返回逻辑
  if (confirm('确定要离开当前页面吗？')) {
    router.push('/list')
  }
}
</script>
```

## 设置内容宽度

通过 `width` 属性控制内容区域宽度。

<DemoBox title="设置内容宽度" description="控制内容区域的宽度">

<div class="space-y-6">
  <div>
    <h4 class="text-base text-[color:var(--vp-c-text-1)] mb-3">固定像素宽度</h4>
    <div class="h-[180px] border border-[color:var(--vp-c-border)] overflow-hidden rounded-lg border-solid">
      <ProScaffold width="600px">
        <template #header>
          <h2 class="text-base m-0">600px 宽度</h2>
        </template>
        <div class="bg-[color:var(--vp-c-bg-alt)] p-4">
          内容区域宽度为 600px
        </div>
      </ProScaffold>
    </div>
  </div>
  <div>
    <h4 class="text-base text-[color:var(--vp-c-text-1)] mb-3">百分比宽度</h4>
    <div class="h-[180px] border border-[color:var(--vp-c-border)] overflow-hidden rounded-lg border-solid">
      <ProScaffold width="80%">
        <template #header>
          <h2 class="text-base m-0">80% 宽度</h2>
        </template>
        <div class="bg-[color:var(--vp-c-bg-alt)] p-4">
          内容区域宽度为父容器的 80%
        </div>
      </ProScaffold>
    </div>
  </div>
</div>
</DemoBox>

```vue
<template>
  <div class="space-y-8">
    <div>
      <h3>固定像素宽度</h3>
      <ProScaffold width="800px">
        <template #header>
          <h2>800px 宽度</h2>
        </template>
        <div class="bg-gray-100 p-4">内容区域宽度为 800px</div>
      </ProScaffold>
    </div>

    <div>
      <h3>数字宽度（自动添加px）</h3>
      <ProScaffold :width="600">
        <template #header>
          <h2>600px 宽度</h2>
        </template>
        <div class="bg-blue-100 p-4">内容区域宽度为 600px</div>
      </ProScaffold>
    </div>

    <div>
      <h3>百分比宽度</h3>
      <ProScaffold width="80%">
        <template #header>
          <h2>80% 宽度</h2>
        </template>
        <div class="bg-green-100 p-4">内容区域宽度为父容器的 80%</div>
      </ProScaffold>
    </div>
  </div>
</template>

<script setup>
// 无需额外代码
</script>
```

## 加载状态

使用 `loading` 属性显示加载状态。

<DemoBox title="加载状态" description="显示页面加载状态">
<div>
  <div class="mb-4">
    <TButton @click="toggleLoading">
      {{ loading2 ? '停止加载' : '开始加载' }}
    </TButton>
  </div>
  <div class="h-[280px] border border-[color:var(--vp-c-border)] overflow-hidden rounded-lg border-solid">
    <ProScaffold :loading="loading2" show-back-button>
      <template #header>
        <h1 class="text-lg m-0">数据加载页面</h1>
      </template>
      <div v-if="!loading2" class="p-4">
        <h3>数据已加载完成</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div v-for="item in data" :key="item.id" class="p-4 border rounded">
            {{ item.name }}
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <p>数据加载中...</p>
      </div>
      <template #footer>
        <TButton :disabled="loading2" @click="refreshData">
          刷新数据
        </TButton>
      </template>
    </ProScaffold>
  </div>
</div>
</DemoBox>

```vue
<template>
  <div>
    <div class="mb-4">
      <TButton @click="toggleLoading">
        {{ loading ? '停止加载' : '开始加载' }}
      </TButton>
    </div>

    <ProScaffold :loading="loading" show-back-button>
      <template #header>
        <h1>数据加载页面</h1>
      </template>

      <div v-if="!loading">
        <h3>数据已加载完成</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div v-for="item in data" :key="item.id" class="p-4 border rounded">
            {{ item.name }}
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <p>数据加载中...</p>
      </div>

      <template #footer>
        <TButton :disabled="loading" @click="refreshData"> 刷新数据 </TButton>
      </template>
    </ProScaffold>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)

const data = ref([
  { id: 1, name: '项目 A' },
  { id: 2, name: '项目 B' },
  { id: 3, name: '项目 C' }
])

const toggleLoading = () => {
  loading.value = !loading.value
}

const refreshData = async () => {
  loading.value = true
  try {
    // 模拟数据请求
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('数据刷新完成')
  } finally {
    loading.value = false
  }
}
</script>
```

## API

### Props

| 名称             | 类型               | 默认值   | 说明                                        |
| ---------------- | ------------------ | -------- | ------------------------------------------- |
| `loading`        | `boolean`          | `false`  | 是否显示加载状态，使用 `v-loading` 指令实现 |
| `showBackButton` | `boolean`          | `false`  | 是否显示返回按钮                            |
| `width`          | `string \| number` | `'100%'` | 内容区域的宽度，数字会自动添加 `px` 单位    |

### Events

组件无自定义事件，所有交互通过插槽内容处理。

### Methods

组件无暴露的方法。

## 实际应用案例

结合其他组件实现真实的业务场景。

<DemoBox title="用户管理页面" description="完整的用户管理页面实现">
  <ProScaffold show-back-button>
    <template #header>
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-xl font-bold text-[color:var(--vp-c-text-1)] m-0">用户管理</h1>
          <p class="text-sm text-[color:var(--vp-c-text-2)] mt-1 mb-0">管理系统用户信息</p>
        </div>
        <div class="flex gap-2">
          <TButton variant="outline">导出</TButton>
          <TButton theme="primary">新增用户</TButton>
        </div>
      </div>
    </template>
    
    <div class="space-y-4">
      <!-- 搜索区域 -->
      <div class="bg-[color:var(--vp-c-bg-alt)] p-4 rounded">
        <div class="flex gap-4 items-end">
          <div class="flex-1">
            <label class="block text-sm font-medium text-[color:var(--vp-c-text-1)] mb-1">用户名</label>
            <TInput placeholder="请输入用户名" style="width: 200px" />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-[color:var(--vp-c-text-1)] mb-1">状态</label>
            <TInput placeholder="选择状态" style="width: 150px" />
          </div>
          <div>
            <TButton theme="primary">搜索</TButton>
            <TButton variant="outline" class="ml-2">重置</TButton>
          </div>
        </div>
      </div>
      
      <!-- 数据表格 -->
      <div class="bg-white border border-[color:var(--vp-c-border)] rounded">
        <div class="p-4 border-b border-[color:var(--vp-c-border)]">
          <div class="flex justify-between items-center">
            <span class="text-sm text-[color:var(--vp-c-text-2)]">共 156 条记录</span>
            <div class="flex gap-2">
              <TButton size="small" variant="outline">批量删除</TButton>
              <TButton size="small" variant="outline">批量导出</TButton>
            </div>
          </div>
        </div>
        <div class="p-4">
          <div class="space-y-3">
            <div v-for="i in 5" :key="i" class="flex items-center justify-between p-3 border border-[color:var(--vp-c-border)] rounded">
              <div class="flex items-center space-x-4">
                <div class="w-8 h-8 bg-[color:var(--vp-c-brand)] rounded-full flex items-center justify-center text-white text-sm">
                  U{{ i }}
                </div>
                <div>
                  <div class="font-medium text-[color:var(--vp-c-text-1)]">用户{{ i }}</div>
                  <div class="text-sm text-[color:var(--vp-c-text-2)]">user{{ i }}@example.com</div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">正常</span>
                <TButton size="small" variant="text">编辑</TButton>
                <TButton size="small" variant="text" theme="danger">删除</TButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-between items-center w-full">
        <span class="text-sm text-[color:var(--vp-c-text-2)]">显示第 1-10 条，共 156 条</span>
        <div class="flex gap-2">
          <TButton variant="outline" size="small">上一页</TButton>
          <TButton size="small">1</TButton>
          <TButton variant="outline" size="small">2</TButton>
          <TButton variant="outline" size="small">3</TButton>
          <TButton variant="outline" size="small">下一页</TButton>
        </div>
      </div>
    </template>
  </ProScaffold>
</DemoBox>

```vue
<template>
  <ProScaffold show-back-button>
    <template #header>
      <div class="flex justify-between items-center">
        <div>
          <h1>用户管理</h1>
          <p class="text-sm text-gray-600">管理系统用户信息</p>
        </div>
        <div class="flex gap-2">
          <TButton variant="outline">导出</TButton>
          <TButton theme="primary" @click="showAddDialog = true">新增用户</TButton>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <!-- 搜索区域 -->
      <div class="bg-gray-50 p-4 rounded">
        <div class="flex gap-4 items-end">
          <div class="flex-1">
            <label>用户名</label>
            <TInput v-model="searchForm.username" placeholder="请输入用户名" />
          </div>
          <div class="flex-1">
            <label>状态</label>
            <TSelect v-model="searchForm.status" placeholder="选择状态" :options="statusOptions" />
          </div>
          <div>
            <TButton theme="primary" @click="handleSearch">搜索</TButton>
            <TButton variant="outline" @click="handleReset">重置</TButton>
          </div>
        </div>
      </div>

      <!-- 数据表格 -->
      <ProTable :columns="columns" :data="tableData" :loading="loading" row-key="id" />
    </div>

    <template #footer>
      <div class="flex justify-between items-center w-full">
        <span class="text-sm text-gray-600"
          >显示第 {{ pagination.current }}-{{ pagination.pageSize }} 条，共 {{ pagination.total }} 条</span
        >
        <TPagination
          v-model="pagination.current"
          :total="pagination.total"
          :page-size="pagination.pageSize"
          @change="handlePageChange"
        />
      </div>
    </template>
  </ProScaffold>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 搜索表单
const searchForm = reactive({
  username: '',
  status: ''
})

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 分页信息
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 表格列配置
const columns = [
  { colKey: 'username', title: '用户名' },
  { colKey: 'email', title: '邮箱' },
  { colKey: 'status', title: '状态' },
  { colKey: 'operation', title: '操作' }
]

// 状态选项
const statusOptions = [
  { label: '正常', value: 'active' },
  { label: '禁用', value: 'disabled' }
]

// 事件处理
const handleSearch = () => {
  console.log('搜索:', searchForm)
  loadTableData()
}

const handleReset = () => {
  Object.assign(searchForm, { username: '', status: '' })
  loadTableData()
}

const handlePageChange = page => {
  pagination.current = page
  loadTableData()
}

const loadTableData = async () => {
  loading.value = true
  try {
    // 模拟 API 请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 更新表格数据
  } finally {
    loading.value = false
  }
}
</script>
```

### Slots

| 名称         | 参数 | 说明                           |
| ------------ | ---- | ------------------------------ |
| `default`    | `-`  | 页面主要内容区域               |
| `header`     | `-`  | 页面头部内容                   |
| `footer`     | `-`  | 页面底部内容，通常放置操作按钮 |
| `backButton` | `-`  | 自定义返回按钮内容             |

### Methods

当前版本无暴露的方法。

## 样式类名

| 类名                              | 说明                           |
| --------------------------------- | ------------------------------ |
| `.pro-scaffold`                   | 脚手架根容器                   |
| `.pro-scaffold__back-button`      | 返回按钮容器                   |
| `.pro-scaffold__header`           | 头部区域容器                   |
| `.pro-scaffold__content__wrapper` | 内容区域包装器，提供滚动功能   |
| `.pro-scaffold__content`          | 内容区域，居中显示并可设置宽度 |
| `.pro-scaffold__footer`           | 底部区域容器，包含按钮样式     |

## 样式变量

| CSS 变量                  | 默认值 | 说明         |
| ------------------------- | ------ | ------------ |
| `--td-bg-color-container` | `#fff` | 容器背景色   |
| `--td-shadow-1`           | `-`    | 底部阴影效果 |

## 类型定义

```typescript
// Props 接口
export interface ProScaffoldProps {
  /** @description 是否显示加载状态 */
  loading?: boolean
  /** @description 是否显示返回按钮 */
  showBackButton?: boolean
  /** @description 内容区域宽度 */
  width?: string | number
}

// 插槽接口
export interface ProScaffoldSlots {
  /** @description 页面主要内容 */
  default?: () => VNode
  /** @description 页面头部内容 */
  header?: () => VNode
  /** @description 页面底部内容 */
  footer?: () => VNode
  /** @description 自定义返回按钮 */
  backButton?: () => VNode
}
```

## 最佳实践

### 布局原则

1. **头部区域**：建议高度控制在 60-80px 之间，避免过高影响内容区域
2. **内容区域**：使用 `flex: 1` 自适应高度，确保滚动正常
3. **底部区域**：建议高度控制在 60-100px 之间，按钮数量不宜过多

### 响应式设计

```vue
<template>
  <ProScaffold :width="containerWidth">
    <template #header>
      <div class="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 class="text-xl md:text-2xl">标题</h1>
        <div class="flex gap-2 mt-2 md:mt-0">
          <TButton>操作1</TButton>
          <TButton>操作2</TButton>
        </div>
      </div>
    </template>
    <!-- 内容 -->
  </ProScaffold>
</template>

<script setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

const containerWidth = computed(() => {
  if (width.value < 768) return '100%'
  if (width.value < 1024) return '90%'
  return '1200px'
})
</script>
```

### 加载状态处理

```vue
<template>
  <ProScaffold :loading="pageLoading">
    <template #header>
      <div class="flex justify-between items-center">
        <h1>数据管理</h1>
        <TButton theme="primary" :loading="submitLoading" :disabled="pageLoading" @click="handleSubmit"> 保存 </TButton>
      </div>
    </template>

    <div v-if="!pageLoading">
      <!-- 内容区域 -->
    </div>
  </ProScaffold>
</template>

<script setup>
import { ref } from 'vue'

const pageLoading = ref(false) // 页面级加载
const submitLoading = ref(false) // 操作级加载

const handleSubmit = async () => {
  submitLoading.value = true
  try {
    // 提交逻辑
  } finally {
    submitLoading.value = false
  }
}
</script>
```

### 返回按钮处理

```vue
<template>
  <ProScaffold show-back-button>
    <template #backButton>
      <TButton shape="round" variant="outline" size="small" @click="handleBack">
        <ChevronLeftIcon />
        {{ backButtonText }}
      </TButton>
    </template>
    <!-- 其他内容 -->
  </ProScaffold>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const backButtonText = computed(() => {
  // 根据来源页面动态设置返回文案
  const from = route.query.from
  switch (from) {
    case 'list':
      return '返回列表'
    case 'detail':
      return '返回详情'
    default:
      return '返回'
  }
})

const handleBack = () => {
  // 检查是否有未保存的更改
  if (hasUnsavedChanges.value) {
    if (confirm('有未保存的更改，确定要离开吗？')) {
      router.back()
    }
  } else {
    router.back()
  }
}
</script>
```

## 使用注意事项

1. **高度设置**：确保父容器有明确的高度，否则脚手架布局可能不正常
2. **滚动区域**：内容区域默认可滚动，避免在内容内部再设置滚动容器
3. **按钮间距**：底部区域的按钮会自动添加 16px 的左边距
4. **返回按钮位置**：返回按钮使用绝对定位，确保不与头部内容重叠
5. **加载状态**：加载时会覆盖整个组件，注意处理用户交互

## 与其他组件结合使用

### 结合ProTable的列表页面

```vue
<template>
  <ProScaffold show-back-button>
    <template #header>
      <div class="flex justify-between items-center">
        <h1>数据列表</h1>
        <div class="flex gap-2">
          <ProSearch v-model="searchKeyword" @search="handleSearch" @clear="handleClear" />
          <TButton theme="primary">新增</TButton>
        </div>
      </div>
    </template>

    <ProTable
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @page-change="handlePageChange"
    />

    <template #footer>
      <div class="flex justify-between items-center w-full">
        <span class="text-sm text-gray-600"> 已选择 {{ selectedRows.length }} 项 </span>
        <div class="flex gap-2">
          <TButton :disabled="!selectedRows.length">批量删除</TButton>
          <TButton theme="primary" :disabled="!selectedRows.length">批量导出</TButton>
        </div>
      </div>
    </template>
  </ProScaffold>
</template>
```

### 结合ProForm的表单页面

```vue
<template>
  <ProScaffold show-back-button width="800px">
    <template #header>
      <h1>{{ isEdit ? '编辑' : '新增' }}用户</h1>
    </template>

    <ProForm ref="formRef" v-model="formData" :rules="formRules" :columns="formColumns" label-width="120px" />

    <template #footer>
      <TButton @click="handleCancel">取消</TButton>
      <TButton theme="primary" :loading="submitLoading" @click="handleSubmit">
        {{ isEdit ? '更新' : '创建' }}
      </TButton>
    </template>
  </ProScaffold>
</template>
```

### 分步骤的向导页面

```vue
<template>
  <ProScaffold show-back-button>
    <template #header>
      <div>
        <h1>创建项目向导</h1>
        <TSteps :current="currentStep" class="mt-4">
          <TStep title="基本信息" />
          <TStep title="配置选项" />
          <TStep title="确认创建" />
        </TSteps>
      </div>
    </template>

    <div class="py-6">
      <component :is="stepComponents[currentStep]" v-model="wizardData" />
    </div>

    <template #footer>
      <TButton v-if="currentStep > 0" @click="handlePrevStep"> 上一步 </TButton>
      <TButton v-if="currentStep < stepComponents.length - 1" theme="primary" @click="handleNextStep"> 下一步 </TButton>
      <TButton v-else theme="primary" :loading="creating" @click="handleCreate"> 创建项目 </TButton>
    </template>
  </ProScaffold>
</template>
```

## 常见问题

### Q: 为什么内容区域没有滚动条？

A: 请确保父容器有明确的高度设置。脚手架组件使用 `height: 100%`，需要父容器提供具体高度。

```css
/* 示例：设置页面容器高度 */
.page-container {
  height: 100vh; /* 或其他明确的高度值 */
}
```

### Q: 返回按钮与头部内容重叠怎么办？

A: 返回按钮使用绝对定位在左上角，建议在头部内容中预留左侧空间：

```vue
<template #header>
  <div class="pl-16">
    <!-- 预留返回按钮空间 -->
    <h1>页面标题</h1>
  </div>
</template>
```
