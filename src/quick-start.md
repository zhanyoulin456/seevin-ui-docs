# 快速开始

## 全量引入

基础使用会全量注册所有组件，如果您的项目大规模使用组件，请放心使用这种方式
在 main.ts 中引入所有组件：

```ts
import { createApp } from 'vue'
import SeevinUI from '@seevin/ui'
import '@seevin/ui/style/index.css' // 引入所有组件的样式

import App from './App.vue'

const app = createApp(App)
app.use(SeevinUI)
app.mount('#app')
```

> 避免重复注册（二选一）

1.  全量注册：app.use(@seevin/ui) 后，所有 Pro\* 组件已全局可用；此时不要再单独 app.use(ProForm)
2.  按需注册：不调用 app.use(@seevin/ui)，仅对需要的组件 app.use(ProForm)/app.use(ProTable) 或在组件内局部注册

## 按需引入

### 手动导入

```vue
<template>
  <div>
    <ProSearch v-model="searchValue" @search="handleSearch" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ProSearch } from '@seevin/ui'
import '@seevin/ui/components/Search/style.css'

const searchValue = ref('')

const handleSearch = value => {
  console.log('搜索内容:', value)
}
</script>
```

### 自动导入（推荐）

使用 `unplugin-vue-components` 和 `unplugin-auto-import` 实现自动导入：

```bash
pnpm install unplugin-vue-components unplugin-auto-import -D
```

**Vite 配置：**

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'
import { SeevinUIResolver } from '@seevin/ui'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        TDesignResolver({
          library: 'vue-next',
          resolveIcons: true
        })
      ]
    }),
    Components({
      resolvers: [
        TDesignResolver({
          library: 'vue-next',
          resolveIcons: true
        }),
        {
          type: 'directive',
          resolve: name => {
            if (name === 'Loading') {
              return {
                name: 'vLoading',
                from: `tdesign-vue-next/esm/loading/directive`
              }
            } else {
              return
            }
          }
        },
        SeevinUIResolver()
      ]
    })
  ]
})
```

**Webpack 配置：**

```js
// webpack.config.js
const Components = require('unplugin-vue-components/webpack')
const AutoImport = require('unplugin-auto-import/webpack')
const { SeevinUIResolver } = require('@seevin/ui')

module.exports = {
  plugins: [
    AutoImport({
      resolvers: [
        TDesignResolver({
          library: 'vue-next',
          resolveIcons: true
        })
      ]
    }),
    Components({
      resolvers: [
        TDesignResolver({
          library: 'vue-next',
          resolveIcons: true
        }),
        {
          type: 'directive',
          resolve: name => {
            if (name === 'Loading') {
              return {
                name: 'vLoading',
                from: `tdesign-vue-next/esm/loading/directive`
              }
            } else {
              return
            }
          }
        },
        SeevinUIResolver()
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
    <ProFilter :items="filterConditions" @search="handleFilter" />

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

使用自动导入时，组件样式会自动按需加载，无需手动引入，只需要导入基础样式。

```ts
// 导入基础样式
import '@seevin/ui/style/base.css'
```

使用手动导入时：

```ts
// 导入基础样式
import '@seevin/ui/style/base.css'

// 导入单个组件样式
import '@seevin/ui/components/Search/style.css'
import '@seevin/ui/components/Table/style.css'
```

#### 重置样式说明

@seevin/ui对TDesign组件的样式进行了调整，用户可导入直接覆盖tdesign样式，主要包括：

- **Dialog 组件**：调整对话框内容区域的内边距和文字颜色，统一按钮最小宽度
- **Drawer 组件**：设置抽屉边框颜色，调整底部按钮布局和最小宽度

```ts
// 导入内置的重置样式文件
import '@seevin/ui/style/reset.css'

// 也可以单独某个组件的重置样式文件
import '@seevin/ui/style/reset/dialog.css'
import '@seevin/ui/style/reset/drawer.css'

// 或者在全量引入时已经包含了重置样式
import '@seevin/ui/style/index.css' // 已包含 reset.css
```

## 工具库使用示例

### HTTP 客户端

```ts
import { HttpClient } from '@seevin/common'

// 创建 HTTP 客户端
import { MessagePlugin } from 'tdesign-vue-next'
import { HttpClient, axios, type AxiosError } from '@seevin/common'
import { checkNetWorkStatus } from '@seevin/ui'
import { useUserStore } from '@/stores/modules/user'

export default new HttpClient({
  baseURL: import.meta.env.PUBLIC_BASE_API,
  interceptors: {
    request: [
      {
        onFulfilled: config => {
          const userStore = useUserStore()
          const token = userStore.token
          config.headers.set('Authorization', `Bearer ${token}`)
          return config
        }
      }
    ],
    response: [
      {
        onFulfilled: response => {
          const resData = response.data
          if (resData.code !== 200) {
            MessagePlugin.error(resData.msg || '服务异常，请稍后重试')
            throw response
          }
          return response
        },
        onRejected: (error: AxiosError) => {
          if (!axios.isCancel(error)) {
            // 请求超时 && 网络错误单独判断，没有 response
            if ((error as AxiosError).message.indexOf('timeout') !== -1) MessagePlugin.error('请求超时！请您稍后重试')
            if ((error as AxiosError).message.indexOf('Network Error') !== -1)
              MessagePlugin.error('网络错误！请您稍后重试')
            // 根据服务器响应的错误状态码，做不同的处理
            if ((error as AxiosError).response) checkNetWorkStatus((error as AxiosError)!.response!.status)
          }
          return Promise.reject(error)
        }
      }
    ]
  }
})
```

```ts
// src/api/modules/user/index.ts
// 使用客户端发送请求
export const userListAPI = (data: ReqParams) => {
  return http.post<ResParams>('/user/list', data)
}
```

```vue
<!-- 组件中使用 -->
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
import { userListAPI } from '@/api/modules/user'

const loading = ref(false)
const users = ref([])

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await userListAPI({ page: 1, limit: 10 })
    users.value = response.data
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

## 下一步

- 查看 [组件文档](/components/search) 了解各个组件的详细用法
- 查看 [工具库文档](/utils/http-client) 了解实用工具的使用方法

[//]: # '- 参考 [设计规范](/design) 了解设计原则'
[//]: # '- 查看 [主题定制](/theme) 学习如何自定义主题'
