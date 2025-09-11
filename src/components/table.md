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
    filterConfig: {
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

在列配置中添加 `filterConfig` 属性可以开启筛选功能。

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
    filterConfig: {
      type: 'input',
      title: '姓名'
    }
  },
  {
    colKey: 'department',
    title: '部门',
    width: 120,
    filterConfig: {
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
    filterConfig: {
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
    filterConfig: {
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

| 名称                | 类型                                                                               | 默认值           | 说明                             |
| ------------------- | ---------------------------------------------------------------------------------- | ---------------- | -------------------------------- |
| `rowKey`            | `string`                                                                           | -                | 唯一标识一行数据的字段名，必需   |
| `columns`           | `ProTableColumn[]`                                                                 | -                | 列配置数组，必需                 |
| `data`              | `T[]`                                                                              | `[]`             | 表格数据，静态数据模式下使用     |
| `showFilter`        | `boolean`                                                                          | `true`           | 是否显示筛选器                   |
| `filterProps`       | `ProFilterProps`                                                                   | `{}`             | 筛选组件属性透传                 |
| `extraFilters`      | `FilterItem[]`                                                                     | `[]`             | 额外的筛选条件，不与列绑定       |
| `showPagination`    | `boolean`                                                                          | `true`           | 是否显示分页器                   |
| `paginationProps`   | `PaginationProps`                                                                  | `{}`             | 分页器配置                       |
| `cacheKey`          | `string`                                                                           | -                | 缓存键名，用于缓存分页和筛选状态 |
| `cacheMode`         | `'localStorage' \| 'sessionStorage'`                                               | `'localStorage'` | 缓存模式                         |
| `request`           | `(params: any) => Promise<any>`                                                    | -                | 列表查询函数                     |
| `autoRequest`       | `boolean`                                                                          | `true`           | 是否自动发起请求                 |
| `customParams`      | `Record<string, any>`                                                              | `{}`             | 自定义初始化参数                 |
| `requestBefore`     | `(params: Record<string, any>) => Record<string, any>`                             | -                | 发起请求前处理参数的回调         |
| `requestSuccess`    | `(data: BaseResponse<T>) => BaseResponse<T>`                                       | -                | 请求成功后处理数据的回调         |
| `requestFailed`     | `(error: unknown) => void`                                                         | -                | 请求失败的错误处理回调           |
| `beforeSearch`      | `(params: Record<string, any>) => Promise<boolean \| Record<string, any> \| void>` | -                | 搜索前置钩子                     |
| `beforeClear`       | `() => boolean \| void`                                                            | -                | 清空前置钩子                     |
| `tableFilterStyle`  | `CSSProperties`                                                                    | -                | 筛选器区域样式                   |
| `tableLayoutStyle`  | `CSSProperties`                                                                    | -                | 布局容器样式                     |
| `tableContentStyle` | `CSSProperties`                                                                    | -                | 内容区域样式                     |
| `contentTopStyle`   | `CSSProperties`                                                                    | -                | 顶部区域样式                     |
| `contentBodyStyle`  | `CSSProperties`                                                                    | -                | 表格主体样式                     |
| `ellipsis`          | `boolean \| TooltipProps`                                                          | `true`           | 单元格省略号配置                 |

**注意：** ProTable 继承了 TDesign EnhancedTable 的所有属性，除了 `rowKey`、`columns`、`data` 被重新定义外，其他所有 EnhancedTable 的属性都可以直接使用，如 `size`、`bordered`、`stripe`、`hover`、`loading`、`empty`、`maxHeight`、`fixedRows`、`headerAffixedTop`、`footerAffixedBottom`、`verticalAlign`、`showHeader`、`showSortColumnBgColor`、`resizable`、`tableLayout`、`dragSort`、`onRowClick`、`onCellClick`、`onSelectChange` 等。

### Events

ProTable 继承了 TDesign EnhancedTable 的所有事件，常用事件包括：

| 事件名           | 参数                                                                                                                                                                   | 说明           |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `onRowClick`     | `(context: { row: T; index: number; e: MouseEvent })`                                                                                                                  | 行点击事件     |
| `onCellClick`    | `(context: { row: T; col: ProTableColumn<T>; rowIndex: number; colIndex: number; e: MouseEvent })`                                                                     | 单元格点击事件 |
| `onSelectChange` | `(selectedRowKeys: Array<string \| number>, options: { selectedRowData: Array<T>; type: 'check' \| 'uncheck'; currentRowKey?: string \| number; currentRowData?: T })` | 选择变化事件   |
| `onSortChange`   | `(sort: { sortBy: string; descending: boolean }, options: { col: ProTableColumn<T>; currentDataSource: Array<T> })`                                                    | 排序变化事件   |
| `onPageChange`   | `(pageInfo: { current: number; previous: number; pageSize: number }, newDataSource: Array<T>)`                                                                         | 分页变化事件   |
| `onExpandChange` | `(expandedRowKeys: Array<string \| number>, options: { expandedRowsData: Array<T>; currentRowKey: string \| number; currentRowData: T; type: 'expand' \| 'fold' })`    | 展开变化事件   |
| `onDragSort`     | `(context: { currentIndex: number; current: T; targetIndex: number; target: T; data: T[]; newData: T[] })`                                                             | 拖拽排序事件   |

更多事件请参考 [TDesign EnhancedTable 文档](https://tdesign.tencent.com/vue-next/components/table)。

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
| `filterRef`        | `Ref<ProFilterExpose \| null>`                    | 筛选器组件实例   |
| `enhancedTableRef` | `Ref<EnhancedTableInstanceFunctions<T> \| null>`  | 底层表格组件实例 |
| `pagination`       | `Ref<PaginationProps \| undefined>`               | 分页配置对象     |
| `getRequestParams` | `() => Record<string, any>`                       | 获取当前请求参数 |
| `tableData`        | `ComputedRef<T[]>`                                | 当前表格数据     |
| `getData`          | `(params?: Record<string, any>) => Promise<void>` | 手动触发数据请求 |

### ProTableColumn 配置

| 名称           | 类型               | 默认值 | 说明                                           |
| -------------- | ------------------ | ------ | ---------------------------------------------- |
| `filterConfig` | `FilterItem`       | -      | 筛选器配置，继承自 ProFilter 组件的 FilterItem |
| `children`     | `ProTableColumn[]` | -      | 子列配置，用于多级表头                         |

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

### 3. 带筛选的数据表格

同时支持多种筛选条件的数据表格：

```vue
<ProTable row-key="id" :columns="columnsWithFilter" :request="fetchData" :extra-filters="extraFilters" />
```

### 4. 缓存状态的表格

对于需要保持用户操作状态的表格：

```vue
<ProTable row-key="id" :columns="columns" :request="fetchData" cache-key="user-table" cache-mode="localStorage" />
```

### 5. 自定义操作列

添加编辑、删除等操作按钮：

```vue
<template>
  <ProTable row-key="id" :columns="columns" :request="fetchData">
    <template #operation="{ row }">
      <TButton size="small" @click="editRow(row)">编辑</TButton>
      <TButton size="small" theme="danger" @click="deleteRow(row)">删除</TButton>
    </template>
  </ProTable>
</template>
```

## 高级用法

### 多级表头

通过 `children` 属性可以创建多级表头：

```vue
<script setup>
const columns = [
  {
    title: '基本信息',
    children: [
      { colKey: 'name', title: '姓名', width: 100 },
      { colKey: 'age', title: '年龄', width: 80 }
    ]
  },
  {
    title: '联系信息',
    children: [
      { colKey: 'email', title: '邮箱', width: 180 },
      { colKey: 'phone', title: '电话', width: 130 }
    ]
  },
  { colKey: 'operation', title: '操作', width: 150 }
]
</script>
```

### 条件显示列

通过 `visible` 属性可以根据条件动态显示或隐藏列：

```vue
<script setup>
import { ref, computed } from 'vue'

const showAdvanced = ref(false)

const columns = [
  { colKey: 'name', title: '姓名', width: 120 },
  { colKey: 'age', title: '年龄', width: 80 },
  {
    colKey: 'salary',
    title: '薪资',
    width: 100,
    visible: () => showAdvanced.value // 动态显示
  },
  {
    colKey: 'bonus',
    title: '奖金',
    width: 100,
    visible: showAdvanced.value // 静态显示
  }
]
</script>
```

### 自定义筛选器

使用 `filterConfig` 配置复杂的筛选条件：

```vue
<script setup>
const columns = [
  {
    colKey: 'name',
    title: '姓名',
    filterConfig: {
      type: 'input',
      title: '姓名',
      placeholder: '请输入姓名',
      order: 1
    }
  },
  {
    colKey: 'createTime',
    title: '创建时间',
    filterConfig: {
      type: 'date-range',
      title: '创建时间',
      order: 2
    }
  },
  {
    colKey: 'status',
    title: '状态',
    filterConfig: {
      type: 'select',
      title: '状态',
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ],
      order: 3
    }
  }
]

// 额外的筛选条件，不与列绑定
const extraFilters = [
  {
    type: 'input',
    title: '关键词',
    colKey: 'keyword',
    placeholder: '搜索关键词',
    order: 0
  }
]
</script>
```

### 自定义单元格渲染

通过插槽或 `cell` 属性自定义单元格内容：

```vue
<template>
  <ProTable row-key="id" :columns="columns" :data="data">
    <!-- 使用插槽自定义 -->
    <template #status="{ row }">
      <TTag :theme="row.status === 'active' ? 'success' : 'danger'" variant="light">
        {{ row.status === 'active' ? '启用' : '禁用' }}
      </TTag>
    </template>

    <!-- 或者使用 cell 属性 -->
    <template #avatar="{ row }">
      <TAvatar :src="row.avatar" :alt="row.name" size="small" />
    </template>
  </ProTable>
</template>

<script setup>
// 或者在列配置中使用 cell 函数
const columns = [
  { colKey: 'name', title: '姓名' },
  {
    colKey: 'status',
    title: '状态',
    // 注意：cell 函数的第一个参数是 h 函数，第二个参数才是上下文对象
    cell: (h, { row }) => {
      return row.status === 'active' ? '启用' : '禁用'
    }
  },
  {
    colKey: 'score',
    title: '评分',
    cell: (h, { row }) => {
      return `${row.score}/100`
    }
  },
  {
    colKey: 'level',
    title: '等级',
    cell: (h, { row }) => {
      // 使用 h 函数创建复杂的 VNode
      return h(
        'span',
        {
          style: {
            color: row.level === 'high' ? '#e34d59' : row.level === 'medium' ? '#ed7b2f' : '#00a870'
          }
        },
        `等级: ${row.level}`
      )
    }
  }
]
</script>
```

**重要说明：**

- 当使用 `cell` 属性时，函数的第一个参数是 Vue 的 `h` 渲染函数
- 第二个参数才是包含 `{ row, rowIndex, col, colIndex }` 的上下文对象
- 如果只需要返回简单的文本，可以直接返回字符串，无需使用 h 函数
- 如果需要复杂的 HTML 结构或组件，建议使用 h 函数或者使用插槽方式

### 自定义请求处理

通过钩子函数对请求进行自定义处理：

```vue
<script setup>
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

// 请求前处理参数
const handleRequestBefore = params => {
  // 添加公共参数
  return {
    ...params,
    timestamp: Date.now(),
    version: '1.0'
  }
}

// 请求成功后处理数据
const handleRequestSuccess = response => {
  // 数据预处理
  if (response.data) {
    response.data = response.data.map(item => ({
      ...item,
      displayName: `${item.firstName} ${item.lastName}`
    }))
  }
  return response
}

// 请求失败处理
const handleRequestFailed = error => {
  console.error('请求失败:', error)
  MessagePlugin.error('数据加载失败，请稍后重试')
}

// 搜索前置钩子
const handleBeforeSearch = async params => {
  // 可以在这里做参数验证
  if (!params.keyword && !params.status) {
    MessagePlugin.warning('请至少输入一个搜索条件')
    return false // 阻止搜索
  }

  // 或者修改搜索参数
  return {
    ...params,
    searchType: 'advanced'
  }
}

// 清空前置钩子
const handleBeforeClear = () => {
  // 可以在这里做确认操作
  return confirm('确定要清空所有筛选条件吗？')
}
</script>

<template>
  <ProTable
    row-key="id"
    :columns="columns"
    :request="fetchData"
    :request-before="handleRequestBefore"
    :request-success="handleRequestSuccess"
    :request-failed="handleRequestFailed"
    :before-search="handleBeforeSearch"
    :before-clear="handleBeforeClear"
  />
</template>
```

### 表格联动

多个表格之间的数据联动：

```vue
<template>
  <div>
    <!-- 主表格 -->
    <ProTable
      ref="mainTableRef"
      row-key="id"
      :columns="mainColumns"
      :request="fetchMainData"
      @row-click="handleMainRowClick"
    />

    <!-- 详情表格 -->
    <ProTable
      v-if="selectedMainRow"
      ref="detailTableRef"
      row-key="id"
      :columns="detailColumns"
      :request="fetchDetailData"
      :custom-params="{ mainId: selectedMainRow.id }"
      :auto-request="false"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const mainTableRef = ref()
const detailTableRef = ref()
const selectedMainRow = ref(null)

// 主表格行点击事件
const handleMainRowClick = ({ row }) => {
  selectedMainRow.value = row
}

// 监听选中行变化，触发详情表格刷新
watch(
  () => selectedMainRow.value,
  newRow => {
    if (newRow && detailTableRef.value) {
      detailTableRef.value.getData()
    }
  }
)
</script>
```

## 样式定制

### CSS 变量定制

组件支持通过 CSS 变量进行样式定制：

```css
.pro-table {
  /* 筛选器样式 */
  --pro-table-filter-bg: #f8f9fa;
  --pro-table-filter-padding: 16px;
  --pro-table-filter-margin: 0 0 16px 0;

  /* 布局样式 */
  --pro-table-layout-gap: 16px;
  --pro-table-content-bg: #ffffff;

  /* 表格样式 */
  --pro-table-header-bg: #f5f7fa;
  --pro-table-border-color: #e6e8eb;
}
```

### 通过 Props 定制样式

```vue
<template>
  <ProTable
    row-key="id"
    :columns="columns"
    :data="data"
    :table-filter-style="{ background: '#f0f2f5', padding: '20px' }"
    :table-layout-style="{ gap: '20px' }"
    :content-top-style="{ padding: '16px 0' }"
    :content-body-style="{ borderRadius: '8px' }"
  />
</template>
```

## 常见问题

### Q: 如何禁用某些行的选择功能？

A: 可以在列配置中使用 `disabled` 函数：

```vue
<script setup>
const columns = [
  {
    colKey: 'row-select',
    type: 'multiple',
    disabled: ({ row }) => row.status === 'locked' // 锁定状态的行不可选
  }
  // ... 其他列
]
</script>
```

### Q: 如何处理大数据量的表格性能问题？

A: 推荐使用以下策略：

1. **启用分页**：控制单页数据量
2. **虚拟滚动**：使用 TDesign 的虚拟滚动功能
3. **懒加载**：按需加载数据
4. **缓存策略**：合理使用缓存

```vue
<template>
  <ProTable
    row-key="id"
    :columns="columns"
    :request="fetchData"
    :pagination-props="{ pageSize: 50, showQuickJumper: true }"
    virtual-scroll
    cache-key="large-table"
  />
</template>
```
