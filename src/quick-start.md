# 快速开始

## 全量引入

在 main.ts 中引入所有组件：

```ts
import { createApp } from 'vue'
import TDesignUI from '@seevin/ui'
import '@seevin/ui/style/index.css'

import App from './App.vue'

const app = createApp(App)
app.use(TDesignUI)
app.mount('#app')
```

## 按需引入

### 手动导入

```vue
<template>
  <div>
    <ProSearch v-model="searchValue" @search="handleSearch" />
    <ProTable :data="tableData" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ProSearch, ProTable } from '@seevin/ui'
import '@seevin/ui/components/Search/style.css'
import '@seevin/ui/components/Table/style.css'

const searchValue = ref('')
const tableData = ref([])

const handleSearch = value => {
  console.log('搜索内容:', value)
}
</script>
```

### 自动导入（推荐）

使用 `unplugin-vue-components` 和 `unplugin-auto-import` 实现自动导入：

```bash
pnpm install unplugin-vue-demos unplugin-auto-import -D
```

**Vite 配置：**

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-demos/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { SeevinUIResolver } from '@seevin/ui'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [SeevinUIResolver()]
    }),
    Components({
      resolvers: [
        SeevinUIResolver({
          resolveIcons: true // 自动解析图标组件
        })
      ]
    })
  ]
})
```

**Webpack 配置：**

```js
// webpack.config.js
const Components = require('unplugin-vue-demos/webpack')
const AutoImport = require('unplugin-auto-import/webpack')
const { SeevinUIResolver } = require('@seevin/ui')

module.exports = {
  plugins: [
    AutoImport({
      resolvers: [SeevinUIResolver()]
    }),
    Components({
      resolvers: [
        SeevinUIResolver({
          resolveIcons: true
        })
      ]
    })
  ]
}
```

配置完成后，可以直接使用组件而无需手动导入：

```vue
<template>
  <div>
    <!-- 自动导入 TDesign 组件 -->
    <TButton @click="openDialog">打开对话框</TButton>

    <!-- 自动导入自定义组件 -->
    <ProSearch v-model="keyword" @search="handleSearch" />
    <ProFilter :conditions="filterConditions" @search="handleFilter" />

    <!-- 自动导入图标组件 -->
    <AddIcon />
    <SearchIcon />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const keyword = ref('')
const filterConditions = ref([])

const handleSearch = value => {
  console.log('搜索:', value)
}

const handleFilter = params => {
  console.log('筛选:', params)
}

const openDialog = () => {
  // 自动导入的 TDesign 插件式组件
  DialogPlugin({
    header: '确认',
    body: '确定要删除吗？',
    onConfirm: () => console.log('确认删除')
  })
}
</script>
```

## 样式导入

### 全量导入样式

```ts
// main.ts
import '@seevin/ui/style/index.css'
```

### 按需导入样式

使用自动导入时，样式会自动按需加载。手动导入时：

```ts
// 导入基础样式
import '@seevin/ui/style/base.css'

// 导入重置样式（可选，用于统一 TDesign 组件样式）
import '@seevin/ui/style/reset.css'

// 导入单个组件样式
import '@seevin/ui/components/Search/style.css'
import '@seevin/ui/components/Table/style.css'
```

#### 重置样式说明

重置样式 (`reset.css`) 包含了对 TDesign 组件的样式调整，主要包括：

- **Dialog 组件**：调整对话框内容区域的内边距和文字颜色，统一按钮最小宽度
- **Drawer 组件**：设置抽屉边框颜色，调整底部按钮布局和最小宽度

```ts
// 如果你需要这些样式调整，可以单独引入
import '@seevin/ui/style/reset.css'

// 或者在全量引入时已经包含了重置样式
import '@seevin/ui/style/index.css' // 已包含 reset.css
```

## 工具库使用示例

## 工具库引入

引入工具库中的实用工具：

```ts
import { HttpClient } from '@seevin/common'

// 创建 HTTP 客户端实例
const httpClient = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 30000
})

// 使用客户端发送请求
const response = await httpClient.get('/users')
console.log(response.data)
```

### HTTP 客户端

```vue
<template>
  <div>
    <TButton @click="fetchUsers" :loading="loading">获取用户数据</TButton>
    <div v-if="users.length > 0">
      <h3>用户列表</h3>
      <ul>
        <li v-for="user in users" :key="user.id">{{ user.name }} - {{ user.email }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { HttpClient } from '@seevin/common'

const loading = ref(false)
const users = ref([])

// 创建 HTTP 客户端
const httpClient = new HttpClient({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  interceptors: {
    request: [
      {
        onFulfilled: config => {
          console.log('发送请求:', config.url)
          return config
        }
      }
    ],
    response: [
      {
        onFulfilled: response => {
          console.log('请求成功:', response.data)
          return response
        },
        onRejected: error => {
          console.error('请求失败:', error.message)
          return Promise.reject(error)
        }
      }
    ]
  }
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await httpClient.get('/users')
    users.value = response.data || response // 处理不同的响应格式
  } catch (error) {
    console.error('获取用户失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
```

## 开始使用

现在你可以开始使用组件了！以下是一个完整的示例：

```vue
<template>
  <div class="app">
    <h1>@seevin/ui 示例</h1>

    <!-- 搜索组件 -->
    <ProSearch v-model="searchKeyword" placeholder="请输入搜索关键字" @search="handleSearch" @clear="handleClear" />

    <!-- 筛选组件 -->
    <ProFilter :conditions="filterConditions" @search="handleFilterSearch" @clear="handleFilterClear" />

    <!-- 表格组件 -->
    <ProTable size="medium" />

    <!-- 页面脚手架 -->
    <ProScaffold :loading="loading" show-back-button width="800px">
      <template #header>
        <h2>页面标题</h2>
      </template>

      <div>
        <p>这里是页面内容</p>
      </div>

      <template #footer>
        <TButton variant="outline">取消</TButton>
        <TButton theme="primary">保存</TButton>
      </template>
    </ProScaffold>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchKeyword = ref('')
const loading = ref(false)

const filterConditions = ref([
  {
    title: '状态',
    colKey: 'status',
    type: 'select',
    value: '',
    options: [
      { label: '启用', value: '1' },
      { label: '禁用', value: '0' }
    ]
  },
  {
    title: '创建时间',
    colKey: 'createTime',
    type: 'dateRange',
    value: []
  }
])

const handleSearch = value => {
  console.log('搜索:', value)
}

const handleClear = () => {
  console.log('清空搜索')
}

const handleFilterSearch = params => {
  console.log('筛选参数:', params)
}

const handleFilterClear = () => {
  console.log('清空筛选')
}
</script>
```

## TypeScript 支持

组件库提供了完整的 TypeScript 类型定义：

```ts
import type { ProSearchProps, ProFilterProps, ProTableProps, ProScaffoldProps } from '@seevin/ui'

// 使用类型
const searchProps: CSearchProps = {
  placeholder: '搜索',
  size: 'medium',
  loading: false
}
```

## 下一步

- 查看 [组件文档](/components/search) 了解各个组件的详细用法
- 查看 [工具库文档](/utils/http-client) 了解实用工具的使用方法

[//]: # '- 参考 [设计规范](/design) 了解设计原则'
[//]: # '- 查看 [主题定制](/theme) 学习如何自定义主题'
