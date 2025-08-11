# ProTable 表格组件

一个功能强大的数据表格组件，基于 TDesign EnhancedTable 构建，集成了筛选、分页、数据请求、缓存等常用功能，适用于各种数据展示场景。

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Button as TButton, Input as TInput, Option as TOption, Select as TSelect } from 'tdesign-vue-next'

// 基础示例数据
const basicColumns = [
  { colKey: 'name', title: '姓名', width: 120 },
  { colKey: 'age', title: '年龄', width: 80 },
  { colKey: 'email', title: '邮箱', ellipsis: true },
  { colKey: 'status', title: '状态', width: 100 }
]

const basicData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', status: '在职' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com', status: '离职' },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', status: '在职' }
])

// 带筛选的表格
const filterColumns = [
  { 
    colKey: 'name', 
    title: '姓名', 
    width: 120,
    cFilter: {
      type: 'input',
      title: '姓名'
    }
  },
  { 
    colKey: 'department', 
    title: '部门', 
    width: 120,
    cFilter: {
      type: 'select',
      title: '部门',
      options: [
        { label: '技术部', value: 'tech' },
        { label: '产品部', value: 'product' },
        { label: '运营部', value: 'operation' }
      ]
    }
  },
  { colKey: 'email', title: '邮箱', ellipsis: true },
  { 
    colKey: 'status', 
    title: '状态', 
    width: 100,
    cFilter: {
      type: 'select',
      title: '状态',
      options: [
        { label: '在职', value: 'active' },
        { label: '离职', value: 'inactive' }
      ]
    }
  }
]

const filterData = ref([
  { id: 1, name: '张三', department: 'tech', email: 'zhangsan@example.com', status: 'active' },
  { id: 2, name: '李四', department: 'product', email: 'lisi@example.com', status: 'inactive' },
  { id: 3, name: '王五', department: 'tech', email: 'wangwu@example.com', status: 'active' },
  { id: 4, name: '赵六', department: 'operation', email: 'zhaoliu@example.com', status: 'active' }
])

// 带操作列的表格
const operationColumns = [
  { colKey: 'name', title: '姓名', width: 120 },
  { colKey: 'email', title: '邮箱' },
  { colKey: 'operation', title: '操作', width: 150 }
]

const operationData = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' }
])

// 请求式表格
const requestColumns = [
  { colKey: 'name', title: '姓名', width: 120 },
  { colKey: 'age', title: '年龄', width: 80 },
  { colKey: 'department', title: '部门', width: 120 },
  { colKey: 'email', title: '邮箱' }
]

// 模拟请求函数
const fetchTableData = async (params) => {
  console.log('请求参数:', params)
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 模拟返回数据
  const mockData = [
    { id: 1, name: '张三', age: 25, department: '技术部', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', age: 30, department: '产品部', email: 'lisi@example.com' },
    { id: 3, name: '王五', age: 28, department: '技术部', email: 'wangwu@example.com' },
    { id: 4, name: '赵六', age: 32, department: '运营部', email: 'zhaoliu@example.com' },
    { id: 5, name: '钱七', age: 27, department: '技术部', email: 'qianqi@example.com' }
  ]
  
  return {
    code: 200,
    msg: 'success',
    data: mockData.slice((params.page - 1) * params.limit, params.page * params.limit),
    recordsFiltered: mockData.length
  }
}

// 表格引用
const tableRef = ref()

// 事件处理
const handleEdit = (row) => {
  console.log('编辑:', row)
}

const handleDelete = (row) => {
  console.log('删除:', row)
}

const handleRefresh = () => {
  tableRef.value?.getData()
}

const getTableData = () => {
  const data = tableRef.value?.tableData
  console.log('当前表格数据:', data)
}

// 自定义请求处理
const handleRequestBefore = (params) => {
  // 添加额外参数
  return {
    ...params,
    timestamp: Date.now()
  }
}

const handleRequestSuccess = (response) => {
  // 处理响应数据
  console.log('请求成功:', response)
  return response
}

const handleRequestFailed = (error) => {
  console.error('请求失败:', error)
}
</script>

## 基础用法

最简单的表格用法，直接传入数据和列配置。

<DemoBox title="基础用法" description="展示基础的数据表格功能">
<ProTable
  row-key="id"
  :columns="basicColumns"
  :data="basicData"
  :show-filter="false"
  :show-pagination="false"
/>
</DemoBox>

```vue
<template>
  <ProTable row-key="id" :columns="columns" :data="data" :show-filter="false" :show-pagination="false" />
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { colKey: 'name', title: '姓名', width: 120 },
  { colKey: 'age', title: '年龄', width: 80 },
  { colKey: 'email', title: '邮箱', ellipsis: true },
  { colKey: 'status', title: '状态', width: 100 }
]

const data = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', status: '在职' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com', status: '离职' },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', status: '在职' }
])
</script>
```

## 带筛选功能

在列配置中添加 `cFilter` 属性可以开启筛选功能。

<DemoBox title="带筛选功能" description="集成筛选器，支持多种筛选类型">
<ProTable
  row-key="id"
  :columns="filterColumns"
  :data="filterData"
  :show-pagination="false"
/>
</DemoBox>

```vue
<template>
  <ProTable row-key="id" :columns="columns" :data="data" :show-pagination="false" />
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  {
    colKey: 'name',
    title: '姓名',
    width: 120,
    cFilter: {
      type: 'input',
      title: '姓名'
    }
  },
  {
    colKey: 'department',
    title: '部门',
    width: 120,
    cFilter: {
      type: 'select',
      title: '部门',
      options: [
        { label: '技术部', value: 'tech' },
        { label: '产品部', value: 'product' },
        { label: '运营部', value: 'operation' }
      ]
    }
  },
  { colKey: 'email', title: '邮箱', ellipsis: true },
  {
    colKey: 'status',
    title: '状态',
    width: 100,
    cFilter: {
      type: 'select',
      title: '状态',
      options: [
        { label: '在职', value: 'active' },
        { label: '离职', value: 'inactive' }
      ]
    }
  }
]

const data = ref([
  { id: 1, name: '张三', department: 'tech', email: 'zhangsan@example.com', status: 'active' },
  { id: 2, name: '李四', department: 'product', email: 'lisi@example.com', status: 'inactive' },
  { id: 3, name: '王五', department: 'tech', email: 'wangwu@example.com', status: 'active' },
  { id: 4, name: '赵六', department: 'operation', email: 'zhaoliu@example.com', status: 'active' }
])
</script>
```

## 自定义操作列

通过插槽可以自定义表格列的内容，特别是操作列。

<DemoBox title="自定义操作列" description="使用插槽自定义操作按钮">
<ProTable
  row-key="id"
  :columns="operationColumns"
  :data="operationData"
  :show-filter="false"
  :show-pagination="false"
>
  <template #operation="{ row }">
    <TButton
      theme="primary"
      variant="text"
      size="small"
      @click="handleEdit(row)"
    >
      编辑
    </TButton>
    <TButton
      theme="danger"
      variant="text"
      size="small"
      @click="handleDelete(row)"
    >
      删除
    </TButton>
  </template>
</ProTable>
</DemoBox>

```vue
<template>
  <ProTable row-key="id" :columns="columns" :data="data" :show-filter="false" :show-pagination="false">
    <template #operation="{ row }">
      <TButton theme="primary" variant="text" size="small" @click="handleEdit(row)"> 编辑 </TButton>
      <TButton theme="danger" variant="text" size="small" @click="handleDelete(row)"> 删除 </TButton>
    </template>
  </ProTable>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { colKey: 'name', title: '姓名', width: 120 },
  { colKey: 'email', title: '邮箱' },
  { colKey: 'operation', title: '操作', width: 150 }
]

const data = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' }
])

const handleEdit = row => {
  console.log('编辑:', row)
}

const handleDelete = row => {
  console.log('删除:', row)
}
</script>
```

## 请求式表格

配置 `request` 函数可以实现数据的异步加载和分页。

<DemoBox title="请求式表格" description="支持异步数据加载和分页功能">
<div>
  <div style="margin-bottom: 16px;">
    <TButton @click="handleRefresh">刷新数据</TButton>
    <TButton @click="getTableData">获取当前数据</TButton>
  </div>
  <ProTable
    ref="tableRef"
    row-key="id"
    :columns="requestColumns"
    :request="fetchTableData"
    :request-before-callback="handleRequestBefore"
    :request-success-callback="handleRequestSuccess"
    :request-failed-callback="handleRequestFailed"
    :show-filter="false"
    :pagination-props="{ pageSize: 3 }"
  />
</div>
</DemoBox>

```vue
<template>
  <div>
    <div class="mb-4">
      <TButton @click="handleRefresh">刷新数据</TButton>
      <TButton @click="getTableData">获取当前数据</TButton>
    </div>
    <ProTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request="fetchTableData"
      :request-before-callback="handleRequestBefore"
      :request-success-callback="handleRequestSuccess"
      :request-failed-callback="handleRequestFailed"
      :show-filter="false"
      :pagination-props="{ pageSize: 10 }"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tableRef = ref()

const columns = [
  { colKey: 'name', title: '姓名', width: 120 },
  { colKey: 'age', title: '年龄', width: 80 },
  { colKey: 'department', title: '部门', width: 120 },
  { colKey: 'email', title: '邮箱' }
]

// 模拟请求函数
const fetchTableData = async params => {
  console.log('请求参数:', params)
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 模拟返回数据
  const mockData = [
    { id: 1, name: '张三', age: 25, department: '技术部', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', age: 30, department: '产品部', email: 'lisi@example.com' }
    // ... 更多数据
  ]

  return {
    code: 200,
    msg: 'success',
    data: mockData.slice((params.page - 1) * params.limit, params.page * params.limit),
    recordsFiltered: mockData.length
  }
}

// 自定义请求处理
const handleRequestBefore = params => {
  return {
    ...params,
    timestamp: Date.now()
  }
}

const handleRequestSuccess = response => {
  console.log('请求成功:', response)
  return response
}

const handleRequestFailed = error => {
  console.error('请求失败:', error)
}

const handleRefresh = () => {
  tableRef.value?.getData()
}

const getTableData = () => {
  const data = tableRef.value?.tableData
  console.log('当前表格数据:', data)
}
</script>
```

## 缓存功能

通过 `cacheKey` 可以缓存表格的分页和筛选状态，页面刷新后会自动恢复。

<DemoBox title="缓存功能" description="自动缓存表格状态，刷新页面后恢复">
<ProTable
  row-key="id"
  :columns="filterColumns"
  :request="fetchTableData"
  cache-key="demo-table-cache"
  cache-mode="sessionStorage"
  :pagination-props="{ pageSize: 2 }"
/>
</DemoBox>

```vue
<template>
  <ProTable
    row-key="id"
    :columns="columns"
    :request="fetchTableData"
    cache-key="user-table-cache"
    cache-mode="localStorage"
    :pagination-props="{ pageSize: 10 }"
  />
</template>

<script setup>
const columns = [
  {
    colKey: 'name',
    title: '姓名',
    width: 120,
    cFilter: {
      type: 'input',
      title: '姓名'
    }
  }
  // ... 更多列配置
]

// 请求函数
const fetchTableData = async params => {
  // 实现数据请求逻辑
  return {
    code: 200,
    msg: 'success',
    data: [], // 表格数据
    recordsFiltered: 0 // 总数
  }
}
</script>
```

## 自定义布局

使用插槽可以自定义表格的各个区域。

<DemoBox title="自定义布局" description="使用插槽自定义筛选区域和顶部区域">
<ProTable
  row-key="id"
  :columns="basicColumns"
  :data="basicData"
  :show-pagination="false"
>
  <template #table-filter>
    <div style="background: var(--vp-c-bg-alt); padding: 16px; border-radius: 6px; margin-bottom: 16px;">
      <h4 style="margin: 0 0 12px 0; font-size: 14px; color: var(--vp-c-text-1);">自定义筛选区域</h4>
      <div style="display: flex; gap: 12px; align-items: center;">
        <TInput placeholder="搜索姓名" style="width: 200px;" />
        <TSelect placeholder="选择状态" style="width: 120px;">
          <TOption value="active" label="在职" />
          <TOption value="inactive" label="离职" />
        </TSelect>
        <TButton theme="primary">查询</TButton>
        <TButton variant="outline">重置</TButton>
      </div>
    </div>
  </template>
  
  <template #table-top>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <h3 style="margin: 0; font-size: 16px; color: var(--vp-c-text-1);">员工列表</h3>
      <div style="display: flex; gap: 8px;">
        <TButton theme="primary" size="small">新增员工</TButton>
        <TButton variant="outline" size="small">导出</TButton>
      </div>
    </div>
  </template>
  
  <template #table-left>
    <div style="width: 200px; background: var(--vp-c-bg-alt); padding: 16px; margin-right: 12px;">
      <h4 style="margin: 0 0 12px 0; font-size: 14px;">左侧面板</h4>
      <p style="margin: 0; font-size: 12px; color: var(--vp-c-text-2);">可以放置筛选条件、统计信息等内容</p>
    </div>
  </template>
  
  <template #table-right>
    <div style="width: 200px; background: var(--vp-c-bg-alt); padding: 16px; margin-left: 12px;">
      <h4 style="margin: 0 0 12px 0; font-size: 14px;">右侧面板</h4>
      <p style="margin: 0; font-size: 12px; color: var(--vp-c-text-2);">可以放置操作按钮、详情信息等内容</p>
    </div>
  </template>
</ProTable>
</DemoBox>

```vue
<template>
  <ProTable row-key="id" :columns="columns" :data="data" :show-pagination="false">
    <template #table-filter>
      <div class="custom-filter">
        <h4>自定义筛选区域</h4>
        <div class="filter-controls">
          <TInput placeholder="搜索姓名" />
          <TSelect placeholder="选择状态">
            <TOption value="active" label="在职" />
            <TOption value="inactive" label="离职" />
          </TSelect>
          <TButton theme="primary">查询</TButton>
          <TButton variant="outline">重置</TButton>
        </div>
      </div>
    </template>

    <template #table-top>
      <div class="table-header">
        <h3>员工列表</h3>
        <div class="header-actions">
          <TButton theme="primary" size="small">新增员工</TButton>
          <TButton variant="outline" size="small">导出</TButton>
        </div>
      </div>
    </template>

    <template #table-left>
      <div class="left-panel">
        <h4>左侧面板</h4>
        <p>可以放置筛选条件、统计信息等内容</p>
      </div>
    </template>

    <template #table-right>
      <div class="right-panel">
        <h4>右侧面板</h4>
        <p>可以放置操作按钮、详情信息等内容</p>
      </div>
    </template>
  </ProTable>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { colKey: 'name', title: '姓名', width: 120 },
  { colKey: 'age', title: '年龄', width: 80 },
  { colKey: 'email', title: '邮箱', ellipsis: true },
  { colKey: 'status', title: '状态', width: 100 }
]

const data = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', status: '在职' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com', status: '离职' }
])
</script>

<style scoped>
.custom-filter {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.left-panel,
.right-panel {
  width: 200px;
  background: #f5f5f5;
  padding: 16px;
}

.left-panel {
  margin-right: 12px;
}

.right-panel {
  margin-left: 12px;
}
</style>
```

## API

### Props

| 名称              | 类型                                                        | 默认值           | 说明                             |
| ----------------- | ----------------------------------------------------------- | ---------------- | -------------------------------- |
| `rowKey`          | `string`                                                    | -                | 唯一标识一行数据的字段名，必需   |
| `columns`         | `ProTableColumn[]`                                          | -                | 列配置数组，必需                 |
| `data`            | `T[]`                                                       | `[]`             | 表格数据，静态数据模式下使用     |
| `tableProps`      | `Omit<EnhancedTableProps, 'rowKey' \| 'columns' \| 'data'>` | `{}`             | 透传给底层 TDesign Table 的属性  |
| `showFilter`      | `boolean`                                                   | `true`           | 是否显示筛选器                   |
| `showPagination`  | `boolean`                                                   | `true`           | 是否显示分页器                   |
| `paginationProps` | `PaginationProps`                                           | `{}`             | 分页器配置                       |
| `cacheKey`        | `string`                                                    | -                | 缓存键名，用于缓存分页和筛选状态 |
| `cacheMode`       | `'localStorage' \| 'sessionStorage'`                        | `'localStorage'` | 缓存模式                         |
| `request`         | `(params: any) => Promise<ResPageData<T>>`                  | -                | 列表查询函数                     |
| `autoRequest`     | `boolean`                                                   | `true`           | 是否自动发起请求                 |
| `customParams`    | `Record<string, any>`                                       | -                | 自定义初始化参数                 |
| `requestBefore`   | `(params: Record<string, any>) => Record<string, any>`      | -                | 发起请求前处理参数的回调         |
| `requestSuccess`  | `(data: ResPageData) => ResPageData`                        | -                | 请求成功后处理数据的回调         |
| `requestFailed`   | `(error: unknown) => void`                                  | -                | 请求失败的错误处理回调           |

### Events

无自定义事件，所有事件都通过 `tableProps` 透传给底层表格组件。

### Slots

| 名称           | 参数                        | 说明                                     |
| -------------- | --------------------------- | ---------------------------------------- |
| `default`      | -                           | 默认插槽，用于放置整个表格组件           |
| `table-filter` | -                           | 自定义筛选区域内容                       |
| `table-top`    | -                           | 表格顶部区域内容                         |
| `table-bottom` | -                           | 表格底部区域内容                         |
| `table-left`   | -                           | 表格左侧区域内容                         |
| `table-right`  | -                           | 表格右侧区域内容                         |
| `table`        | -                           | 自定义表格区域，完全替换默认表格         |
| `[columnKey]`  | `PrimaryTableCellParams<T>` | 动态插槽，根据列的 `colKey` 自定义列内容 |
| `operation`    | `PrimaryTableCellParams<T>` | 操作列插槽                               |

### Methods

通过 `ref` 可以访问以下方法：

| 名称               | 类型                                              | 说明             |
| ------------------ | ------------------------------------------------- | ---------------- |
| `filterRef`        | `Ref<CFilterExpose \| null>`                      | 筛选器组件实例   |
| `enhancedTableRef` | `Ref<EnhancedTableInstanceFunctions<T> \| null>`  | 底层表格组件实例 |
| `pagination`       | `Ref<PaginationProps \| undefined>`               | 分页配置对象     |
| `getRequestParams` | `() => Record<string, any>`                       | 获取当前请求参数 |
| `tableData`        | `ComputedRef<T[]>`                                | 当前表格数据     |
| `getData`          | `(params?: Record<string, any>) => Promise<void>` | 手动触发数据请求 |

### ProTableColumn 配置

| 名称       | 类型               | 默认值 | 说明                                         |
| ---------- | ------------------ | ------ | -------------------------------------------- |
| `cFilter`  | `FilterItem`       | -      | 筛选器配置，继承自 CFilter 组件的 FilterItem |
| `children` | `ProTableColumn[]` | -      | 子列配置，用于多级表头                       |

继承 TDesign `PrimaryTableCol` 的所有属性，如 `colKey`、`title`、`width`、`ellipsis` 等。

### ResPageData 数据格式

请求函数返回的数据格式：

```ts
interface ResPageData<T = any> {
  code: number
  msg: string
  data: T[] | null
  recordsFiltered: number // 总记录数，用于分页
}
```

## 样式类名

| 类名                          | 说明                         |
| ----------------------------- | ---------------------------- |
| `.pro-table`                  | 表格组件根容器               |
| `.pro-table__filter`          | 筛选器区域                   |
| `.pro-table__layout`          | 布局容器，包含左、中、右三栏 |
| `.pro-table__content`         | 内容区域容器                 |
| `.pro-table__content__top`    | 顶部区域容器                 |
| `.pro-table__content__body`   | 表格主体区域                 |
| `.pro-table__content__bottom` | 底部区域容器                 |

## 最佳实践

### 1. 静态数据表格

适用于展示固定数据，不需要后端交互：

```vue
<ProTable row-key="id" :columns="columns" :data="staticData" :show-filter="false" :show-pagination="false" />
```

### 2. 请求式数据表格

适用于需要后端数据交互的场景：

```vue
<ProTable row-key="id" :columns="columns" :request="fetchData" :auto-request="true" />
```

### 3.
