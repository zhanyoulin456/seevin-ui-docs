# HttpClient HTTP 客户端工具

一个基于 Axios 构建的现代化 HTTP 客户端工具，提供请求拦截、响应处理、错误标准化、请求取消等功能。

<script setup>
import { ref } from 'vue'
import { Button as TButton } from 'tdesign-vue-next'

// 基础示例数据
const loading = ref(false)
const response = ref(null)
const error = ref(null)

// 创建客户端实例
const createClient = () => {
  console.log('创建 HTTP 客户端实例')
}

const sendRequest = async () => {
  loading.value = true
  try {
    // 模拟请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    response.value = { code: 200, data: { message: '请求成功' }, msg: 'success' }
    error.value = null
  } catch (err) {
    error.value = err
    response.value = null
  } finally {
    loading.value = false
  }
}
</script>

## 导入方式

### 默认导入

```ts
import { HttpClient } from '@seevin/common'

const client = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 30000
})
```

### 按需导入

```ts
import { HttpClient, type BaseResponse, type RequestError } from '@seevin/common'
```

## 基础用法

最简单的 HTTP 客户端使用方式。

<DemoBox title="基础用法" description="创建客户端实例并发送请求">
<div>
  <div class="mb-4">
    <TButton @click="createClient">创建客户端</TButton>
    <TButton theme="primary" :loading="loading" @click="sendRequest" style="margin-left: 8px;">
      发送请求
    </TButton>
  </div>
  <div v-if="response" class="mb-3">
    <h4 class="text-base text-[color:var(--vp-c-text-1)] mb-2">响应结果：</h4>
    <pre class="text-sm bg-[color:var(--vp-c-bg-alt)] p-3 rounded border">{{ JSON.stringify(response, null, 2) }}</pre>
  </div>
  <div v-if="error" class="mb-3">
    <h4 class="text-base text-[color:var(--vp-c-text-1)] mb-2">错误信息：</h4>
    <pre class="text-sm bg-red-50 p-3 rounded border text-red-600">{{ error.message }}</pre>
  </div>
</div>
</DemoBox>

```ts
import { HttpClient } from '@seevin/common'

// 创建客户端实例
const client = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 30000
})

// 发送 GET 请求
const response = await client.get('/users')
console.log(response.data)
```

## 配置选项

使用各种配置选项自定义客户端行为。

```ts
import { HttpClient } from '@seevin/common'

const client = new HttpClient({
  // 基础 URL
  baseURL: 'https://api.example.com',

  // 超时时间（毫秒）
  timeout: 30000,

  // 默认请求头
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer your-token'
  },

  // 自定义参数序列化
  paramsSerializer: params => {
    return new URLSearchParams(params).toString()
  },

  // 请求拦截器
  interceptors: {
    request: [
      {
        onFulfilled: config => {
          // 添加时间戳
          config.headers['X-Timestamp'] = Date.now()
          return config
        },
        onRejected: error => Promise.reject(error)
      }
    ],
    response: [
      {
        onFulfilled: response => {
          // 处理响应数据
          console.log('响应成功:', response.data)
          return response
        },
        onRejected: error => {
          // 统一错误处理
          console.error('请求失败:', error.message)
          return Promise.reject(error)
        }
      }
    ]
  }
})
```

## HTTP 方法

支持所有常用的 HTTP 方法。

```ts
// GET 请求
const users = await client.get('/users', {
  params: { page: 1, size: 10 }
})

// POST 请求
const newUser = await client.post('/users', {
  name: '张三',
  email: 'zhangsan@example.com'
})

// PUT 请求
const updatedUser = await client.put('/users/1', {
  name: '李四',
  email: 'lisi@example.com'
})

// DELETE 请求
await client.delete('/users/1')

// PATCH 请求
const patchedUser = await client.patch('/users/1', {
  name: '王五'
})
```

## 请求取消

支持单个或批量取消请求。

```ts
// 使用 requestKey 标识请求
const request1 = client.get('/api/data', {
  requestKey: 'fetch-data'
})

const request2 = client.get('/api/users', {
  requestKey: 'fetch-users'
})

// 取消单个请求
client.cancelRequest('fetch-data')

// 取消多个请求
client.cancelRequest(['fetch-data', 'fetch-users'])

// 取消所有待处理请求
client.cancelAllRequests()
```

## 响应处理

控制响应数据的返回格式。

```ts
// 默认返回 response.data
const data = await client.get('/users')
console.log(data) // { code: 200, data: [...], msg: 'success' }

// 返回完整响应对象
const fullResponse = await client.get('/users', {
  returnFullResponse: true
})
console.log(fullResponse.status) // 200
console.log(fullResponse.headers) // 响应头
console.log(fullResponse.data) // 响应数据
```

## 错误处理

标准化的错误处理机制。

```ts
try {
  const response = await client.get('/api/data')
} catch (error) {
  if (error.name === 'RequestError') {
    console.log('状态码:', error.status)
    console.log('错误消息:', error.message)
    console.log('响应数据:', error.response?.data)
  } else if (axios.isCancel(error)) {
    console.log('请求被取消')
  } else {
    console.log('其他错误:', error.message)
  }
}
```

## API

### HttpClient 构造函数

| 参数      | 类型                | 默认值 | 说明           |
| --------- | ------------------- | ------ | -------------- |
| `options` | `HttpClientOptions` | `{}`   | 客户端配置选项 |

### HttpClientOptions 配置

| 名称               | 类型                      | 默认值         | 说明             |
| ------------------ | ------------------------- | -------------- | ---------------- |
| `baseURL`          | `string`                  | -              | 基础 URL         |
| `timeout`          | `number`                  | `30000`        | 超时时间（毫秒） |
| `headers`          | `Record<string, string>`  | -              | 默认请求头       |
| `paramsSerializer` | `(params: any) => string` | `qs.stringify` | 参数序列化函数   |
| `interceptors`     | `InterceptorsConfig`      | -              | 拦截器配置       |

### 实例方法

| 方法名              | 参数                                                           | 返回值                     | 说明         |
| ------------------- | -------------------------------------------------------------- | -------------------------- | ------------ |
| `request<T>`        | `config: ExtendedAxiosRequestConfig`                           | `Promise<BaseResponse<T>>` | 发送请求     |
| `get<T>`            | `url: string, config?: ExtendedAxiosRequestConfig`             | `Promise<BaseResponse<T>>` | GET 请求     |
| `post<T>`           | `url: string, data?: any, config?: ExtendedAxiosRequestConfig` | `Promise<BaseResponse<T>>` | POST 请求    |
| `put<T>`            | `url: string, data?: any, config?: ExtendedAxiosRequestConfig` | `Promise<BaseResponse<T>>` | PUT 请求     |
| `delete<T>`         | `url: string, config?: ExtendedAxiosRequestConfig`             | `Promise<BaseResponse<T>>` | DELETE 请求  |
| `patch<T>`          | `url: string, data?: any, config?: ExtendedAxiosRequestConfig` | `Promise<BaseResponse<T>>` | PATCH 请求   |
| `cancelRequest`     | `requestKey: string \| string[]`                               | `void`                     | 取消指定请求 |
| `cancelAllRequests` | -                                                              | `void`                     | 取消所有请求 |

### ExtendedAxiosRequestConfig 扩展配置

| 名称                 | 类型      | 默认值  | 说明                   |
| -------------------- | --------- | ------- | ---------------------- |
| `returnFullResponse` | `boolean` | `false` | 是否返回完整响应对象   |
| `requestKey`         | `string`  | -       | 请求标识，用于请求取消 |

## 类型定义

### BaseResponse 基础响应类型

```ts
interface BaseResponse<T = any> {
  code: number
  data: T
  msg?: string
  recordsFiltered?: number
  [key: string]: any
}
```

### RequestError 请求错误类型

```ts
interface RequestError extends Error {
  config: InternalAxiosRequestConfig
  status?: number
  code?: string
  request?: any
  response?: AxiosResponse<BaseResponse>
  isAxiosError: boolean
}
```

### InterceptorsConfig 拦截器配置

```ts
interface InterceptorsConfig {
  request?: Array<{
    onFulfilled?: (
      config: InternalAxiosRequestConfig
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
    onRejected?: (error: any) => any
  }>
  response?: Array<{
    onFulfilled?: (response: AxiosResponse<BaseResponse>) => AxiosResponse<BaseResponse>
    onRejected?: (error: AxiosError) => any
  }>
}
```

## 最佳实践

### 1. 创建服务层

推荐创建专门的服务层来管理 API 请求：

```ts
// services/api.ts
import { HttpClient } from '@seevin/common'

class ApiService {
  private client: HttpClient

  constructor() {
    this.client = new HttpClient({
      baseURL: process.env.VUE_APP_API_BASE_URL,
      timeout: 30000,
      interceptors: {
        request: [
          {
            onFulfilled: config => {
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
              if (error.status === 401) {
                // 处理认证失败
                this.handleAuthError()
              }
              return Promise.reject(error)
            }
          }
        ]
      }
    })
  }

  private handleAuthError() {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  // 用户相关 API
  async getUsers(params: { page: number; size: number }) {
    return this.client.get('/users', { params })
  }

  async createUser(data: { name: string; email: string }) {
    return this.client.post('/users', data)
  }

  // 可取消的请求
  async searchUsers(keyword: string) {
    return this.client.get('/users/search', {
      params: { keyword },
      requestKey: 'search-users' // 相同 key 的请求会自动取消
    })
  }
}

export const apiService = new ApiService()
```

### 2. 在 Vue 组件中使用

```vue
<template>
  <div>
    <button @click="loadUsers" :disabled="loading">加载用户</button>
    <button @click="cancelRequest">取消请求</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { apiService } from '@/services/api'

const loading = ref(false)
const users = ref([])

const loadUsers = async () => {
  loading.value = true
  try {
    const response = await apiService.getUsers({ page: 1, size: 10 })
    users.value = response.data
  } catch (error) {
    if (!axios.isCancel(error)) {
      console.error('加载用户失败:', error.message)
    }
  } finally {
    loading.value = false
  }
}

const cancelRequest = () => {
  apiService.client.cancelAllRequests()
}
</script>
```

### 3. 环境配置

根据不同环境使用不同的配置：

```ts
// config/http.ts
import { HttpClient } from '@seevin/common'

const isDevelopment = process.env.NODE_ENV === 'development'

export const httpClient = new HttpClient({
  baseURL: isDevelopment ? 'http://localhost:3000/api' : 'https://api.production.com',
  timeout: isDevelopment ? 60000 : 30000,
  interceptors: {
    request: [
      {
        onFulfilled: config => {
          if (isDevelopment) {
            console.log('请求配置:', config)
          }
          return config
        }
      }
    ],
    response: [
      {
        onFulfilled: response => {
          if (isDevelopment) {
            console.log('响应数据:', response.data)
          }
          return response
        }
      }
    ]
  }
})
```

## 注意事项

1. **内存泄漏**：在组件卸载时记得取消相关请求
2. **错误处理**：始终处理 `RequestError` 和取消错误
3. **拦截器顺序**：自定义拦截器会按注册顺序执行
4. **参数序列化**：默认使用 `qs.stringify`，数组参数使用 `repeat` 格式
5. **TypeScript**：充分利用泛型来获得更好的类型提示

```ts
// 好的做法
interface User {
  id: number
  name: string
  email: string
}

const response = await client.get<User[]>('/users')
// response.data 现在有正确的类型提示
```
