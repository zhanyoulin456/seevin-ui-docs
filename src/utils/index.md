# @seevin/common 工具库

一个现代化的 JavaScript/TypeScript 工具库，提供常用的工具函数和类，帮助开发者提升开发效率。

<script setup>
import { ref } from 'vue'

const installedPackage = ref(false)
const currentTool = ref('HttpClient')

const installPackage = () => {
  installedPackage.value = true
  setTimeout(() => {
    installedPackage.value = false
  }, 2000)
}

const tools = [
  {
    name: 'HttpClient',
    description: 'HTTP 客户端工具',
    icon: '🌐'
  },
  {
    name: 'devWarn',
    description: '开发环境警告日志',
    icon: '⚠️'
  },
  {
    name: 'devError',
    description: '开发环境错误日志',
    icon: '❌'
  },
  {
    name: 'isNetworkImage',
    description: '判断是否为网络图片 URL',
    icon: '🖼️'
  },
  {
    name: 'generateShortUUID',
    description: '生成简短随机字符串',
    icon: '🔑'
  },
  {
    name: 'generateUUID',
    description: '生成随机字符串',
    icon: '🗝️'
  }
]
</script>

## 概述

@seevin/common 是一个独立的工具库，不依赖 Vue 框架，可以在任何 JavaScript 或 TypeScript 项目中使用。它提供了一系列经过测试和优化的工具函数和类，旨在简化日常开发工作。

## 特性

- **🚀 现代化**：使用最新的 JavaScript/TypeScript 特性
- **📦 轻量级**：按需引入，支持 Tree Shaking
- **🔧 实用性**：覆盖常见的开发场景和需求
- **💪 类型安全**：完整的 TypeScript 类型定义
- **🧪 可靠性**：经过充分测试，稳定可靠
- **📚 易用性**：简洁明了的 API 设计

## 安装

```bash
# npm
npm install @seevin/common

# pnpm
pnpm install @seevin/common
```

## 快速开始

### 全量导入

```ts
import * as SeevinCommon from '@seevin/common'

const { HttpClient, devWarn, devError, isNetworkImage, generateShortUUID, generateUUID } = SeevinCommon
```

### 按需导入（推荐）

```ts
import { HttpClient, devWarn, devError, isNetworkImage, generateShortUUID, generateUUID } from '@seevin/common'

// 创建 HTTP 客户端实例
const client = new HttpClient({
  baseURL: 'https://api.example.com'
})

// 使用 devWarn
devWarn('MyComponent', '这是一个警告信息')

// 使用 generateUUID
const uuid = generateUUID()
console.log(uuid)
```

### 类型导入

```ts
import type { BaseResponse, RequestError, HttpClientOptions, ExtendedAxiosRequestConfig } from '@seevin/common'
import type {
  DevWarnFn,
  DevErrorFn,
  IsNetworkImageFn,
  GenerateShortUUIDFn,
  GenerateUUIDFn
} from '@seevin/common/shared'
```

## 可用工具

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
  <div v-for="tool in tools" :key="tool.name" class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <div class="flex items-center mb-2">
      <span class="text-2xl mr-2">{{ tool.icon }}</span>
      <h3 class="text-lg font-semibold !m-0 truncate">{{ tool.name }}</h3>
    </div>
    <p class="text-sm text-[color:var(--vp-c-text-2)] m-0">{{ tool.description }}</p>
  </div>
</div>

### HTTP 工具

| 工具名称       | 说明                                                                  | 文档链接                       |
| -------------- | --------------------------------------------------------------------- | ------------------------------ |
| **HttpClient** | 基于 Axios 的现代化 HTTP 客户端，支持拦截器、请求取消、错误处理等功能 | [查看文档](/utils/http-client) |

### 通用工具

| 工具名称              | 说明                                      | 文档链接（待创建） |
| --------------------- | ----------------------------------------- | ------------------ |
| **devWarn**           | 开发环境下输出警告信息，支持 Tree-shaking | -                  |
| **devError**          | 开发环境下输出错误信息，支持 Tree-shaking | -                  |
| **isNetworkImage**    | 判断给定 URL 是否为网络图片               | -                  |
| **generateShortUUID** | 生成简短的随机字符串                      | -                  |
| **generateUUID**      | 生成标准的 UUID 字符串                    | -                  |

## 使用示例

### HTTP 请求示例

```ts
import { HttpClient } from '@seevin/common'

// 创建客户端实例
const api = new HttpClient({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  interceptors: {
    request: [
      {
        onFulfilled: config => {
          // 添加认证 token
          const token = localStorage.getItem('token')
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
          return config
        }
      }
    ],
    response: [
      {
        onRejected: error => {
          // 统一错误处理
          if (error.status === 401) {
            // 处理认证失败
            window.location.href = '/login'
          }
          return Promise.reject(error)
        }
      }
    ]
  }
})

// 使用示例
async function fetchUserData() {
  try {
    const users = await api.get('/users')
    console.log('用户数据:', users.data)

    const newUser = await api.post('/users', {
      name: '张三',
      email: 'zhangsan@example.com'
    })
    console.log('创建用户:', newUser.data)
  } catch (error) {
    console.error('请求失败:', error.message)
  }
}
```

### 通用工具示例

```ts
import { devWarn, devError, isNetworkImage, generateShortUUID, generateUUID } from '@seevin/common'

// devWarn 和 devError 示例
if (process.env.NODE_ENV === 'development') {
  devWarn('MyComponent', '这是一个开发环境警告', { detail: '更多信息' })
  devError('AnotherComponent', new Error('这是一个开发环境错误'), '错误上下文')
}

// isNetworkImage 示例
const imageUrl = 'https://example.com/image.jpg'
console.log(`'${imageUrl}' 是网络图片吗？`, isNetworkImage(imageUrl))

const localPath = '/path/to/local/image.png'
console.log(`'${localPath}' 是网络图片吗？`, isNetworkImage(localPath))

// UUID 生成示例
console.log('简短 UUID:', generateShortUUID())
console.log('标准 UUID:', generateUUID())
```

### 在 Vue 项目中使用

```vue
<template>
  <div>
    <TButton @click="loadData" :loading="loading">加载数据</TButton>
    <div v-if="data">
      <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { HttpClient } from '@seevin/common'

const loading = ref(false)
const data = ref(null)

const client = new HttpClient({
  baseURL: 'https://api.example.com'
})

const loadData = async () => {
  loading.value = true
  try {
    const response = await client.get('/data')
    data.value = response.data
  } catch (error) {
    console.error('加载失败:', error)
  } finally {
    loading.value = false
  }
}
</script>
```

### 在 Node.js 中使用

```js
const { HttpClient } = require('@seevin/common')

// 创建客户端
const client = new HttpClient({
  baseURL: process.env.API_BASE_URL,
  timeout: 30000
})

// 在服务端使用
async function fetchExternalData() {
  try {
    const response = await client.get('/external-api/data')
    return response.data
  } catch (error) {
    console.error('External API Error:', error.message)
    throw error
  }
}
```

## 环境支持

### 浏览器环境

支持所有现代浏览器：

- Chrome >= 84
- Firefox >= 83
- Safari >= 14.1
- Edge >= 84

### Node.js 环境

支持 Node.js 18+：

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## TypeScript 支持

工具库提供完整的 TypeScript 类型定义：

```ts
// 自动类型推导
const client = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 5000 // 类型检查
})

// 泛型支持
interface User {
  id: number
  name: string
  email: string
}

const users = await client.get<User[]>('/users')
// users.data 具有正确的类型：User[]

// 导入类型
import type { BaseResponse, RequestError, HttpClientOptions, ExtendedAxiosRequestConfig } from '@seevin/common'
import type {
  DevWarnFn,
  DevErrorFn,
  IsNetworkImageFn,
  GenerateShortUUIDFn,
  GenerateUUIDFn
} from '@seevin/common/shared'
```

## 构建配置

工具库使用现代化的构建配置：

- **构建工具**：Rslib
- **模块格式**：ESM
- **目标环境**：Node.js 18+
- **类型定义**：完整的 .d.ts 文件
- **Tree Shaking**：支持按需引入

## 贡献指南

欢迎贡献代码和建议！

### 开发环境设置

```bash
# 克隆仓库
git clone <repository-url>

# 安装依赖
pnpm install

# 开发模式（监听文件变化）
pnpm dev

# 构建
pnpm build
```

### 提交规范

请遵循 Conventional Commits 规范：

```bash
feat: 添加新的工具函数
fix: 修复 HttpClient 的错误处理
docs: 更新文档
test: 添加单元测试
```

## 版本兼容性

| 版本  | 状态   | Node.js  | TypeScript |
| ----- | ------ | -------- | ---------- |
| 0.0.x | 开发中 | >=18.0.0 | >=4.5.0    |

## 更新日志

查看 [更新日志](/changelog) 了解详细的版本更新信息。

## 相关链接

- [组件库文档](/components/search) - @seevin/ui 组件库
- [安装指南](/installation) - 安装和配置说明
- [快速开始](/quick-start) - 快速上手指南

---

## 许可证

MIT License - 详见 LICENSE 文件。
