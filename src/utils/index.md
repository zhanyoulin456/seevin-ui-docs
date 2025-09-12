# @seevin/common 工具库

@seevin/common 是一个独立的工具库，提供了一系列工具函数和类，旨在简化日常开发工作。

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
    description: 'HTTP 客户端工具'
  },
  {
    name: 'commonUtils',
    description: '通用工具函数'
  },
  {
    name: 'eventBus',
    description: '事件总线'
  }
]
</script>

## 特性

- **🚀 现代化**：使用最新的 JavaScript/TypeScript 特性
- **📦 轻量级**：按需引入，支持 Tree Shaking
- **🔧 实用性**：覆盖常见的开发场景和需求
- **💪 类型安全**：完整的 TypeScript 类型定义
- **🧪 可靠性**：经过充分测试，稳定可靠
- **📚 易用性**：简洁明了的 API 设计

## 安装

```bash
# pnpm
pnpm install @seevin/common

# npm
npm install @seevin/common

```

## 快速开始

### 全量导入

```ts
import * as SeevinCommon from '@seevin/common'

const { HttpClient, generateUUID } = SeevinCommon
```

### 按需导入（推荐）

```ts
import { HttpClient, generateUUID } from '@seevin/common'

// 创建 HTTP 客户端实例
const client = new HttpClient({
  baseURL: 'https://api.example.com'
})

// 使用 generateUUID
const uuid = generateUUID()
console.log(uuid)
```

### 类型导入

```ts
import type { BaseResponse, RequestError, HttpClientOptions, ExtendedAxiosRequestConfig } from '@seevin/common'
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

提供常用的工具函数，[查看文档](/utils/common-utils)

### 事件通信

| 工具名称     | 说明                                                     | 文档链接                    |
| ------------ | -------------------------------------------------------- | --------------------------- |
| **EventBus** | 轻量级事件总线，支持组件间通信、事件订阅发布、类型安全等 | [查看文档](/utils/eventbus) |
