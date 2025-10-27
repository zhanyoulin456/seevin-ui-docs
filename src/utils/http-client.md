# HttpClient HTTP客户端

HttpClient 是基于 Axios 的现代化 HTTP 客户端，提供了简洁的 API 和强大的功能，支持拦截器、请求取消、错误处理等特性。

<script setup>
</script>

## 导入方式

```ts
import { HttpClient } from '@seevin/common'

// 导入类型
import type {
  BaseResponse,
  RequestError,
  ExtendedAxiosRequestConfig,
  ExtendedAxiosResponse,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from '@seevin/common'

// 导入 axios 实例（用于工具方法）
import { axios } from '@seevin/common'
```

:::tip 提示
`@seevin/common` 已经内置了 axios，你不需要单独安装 axios 依赖。所有 axios 相关的类型和工具方法都可以从 `@seevin/common` 导入。
:::

## 最佳实践

### 1. 实例化HttpClient

```ts
// 在使项目中实例化HttpClient，如在项目src/api/index.ts中
import { MessagePlugin } from 'tdesign-vue-next'
import { HttpClient, axios, type AxiosError } from '@seevin/common'
import { checkNetWorkStatus } from '@seevin/ui'

// 创建客户端实例
export default new HttpClient({
  baseURL: import.meta.env.PUBLIC_BASE_API,
  interceptors: {
    request: [
      {
        onFulfilled: config => {
          const token = 'your token'
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

### 2. 业务模块中使用

```ts
// 在业务模块（如user模块）的api文件中引入HttpClient实例
import http from '@/api'

export const userListAPI = (params: ReqLoginMsg) => {
  return http.get<ResUser[]>('/user/list', { params })
}
```

### 3. 在组件中使用

```vue
<template>
  <div>
    <TButton @click="loadData" :loading="loading">加载数据</TButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TButton } from 'tdesign-vue-next'
import { userListAPI } from '@/api/modules/user'

const loading = ref(false)
const userList = ref([])

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await userListAPI({
      page: 1,
      limit: 10
    })
    userList.value = data
  } catch (error) {
    console.error('加载失败:', error)
  } finally {
    loading.value = false
  }
}
</script>
```

## 拦截器执行顺序

### 多个拦截器的执行机制

当你配置多个拦截器时，执行顺序如下：

#### 请求拦截器（按配置顺序执行）

```ts
const client = new HttpClient({
  interceptors: {
    request: [
      {
        onFulfilled: config => {
          console.log('请求拦截器 1 执行') // 第一个执行
          config.headers.set('Authorization', 'Bearer token')
          return config
        }
      },
      {
        onFulfilled: config => {
          console.log('请求拦截器 2 执行') // 第二个执行
          config.headers.set('X-Custom-Header', 'value')
          return config
        }
      },
      {
        onFulfilled: config => {
          console.log('请求拦截器 3 执行') // 第三个执行
          return config
        }
      }
    ]
  }
})

// 执行顺序：拦截器 1 → 拦截器 2 → 拦截器 3 → 发送请求
```

#### 响应拦截器（按配置顺序执行）

```ts
const client = new HttpClient({
  interceptors: {
    response: [
      {
        onFulfilled: response => {
          console.log('响应拦截器 1 执行') // 第一个执行
          // 检查业务状态码
          if (response.data.code !== 200) {
            throw new Error(response.data.msg)
          }
          return response
        }
      },
      {
        onFulfilled: response => {
          console.log('响应拦截器 2 执行') // 第二个执行
          // 数据转换
          return response
        }
      },
      {
        onFulfilled: response => {
          console.log('响应拦截器 3 执行') // 第三个执行
          // 日志记录
          return response
        },
        onRejected: error => {
          console.log('响应错误拦截器 3 执行')
          // 错误处理
          return Promise.reject(error)
        }
      }
    ]
  }
})

// 成功响应执行顺序：拦截器 1 → 拦截器 2 → 拦截器 3 → 默认错误标准化拦截器
// 错误响应执行顺序：拦截器 1 → 拦截器 2 → 拦截器 3 → 默认错误标准化拦截器
```

:::tip 执行顺序说明

- **请求拦截器**：按照数组顺序执行（从上到下）
- **响应拦截器**：按照数组顺序执行（从上到下）
- **默认错误拦截器**：在所有用户拦截器之后执行，用于错误标准化
  :::

### 错误标准化

HttpClient 会在所有用户拦截器执行完毕后，自动将 `AxiosError` 标准化为 `RequestError`：

```ts
interface RequestError extends Error {
  config: InternalAxiosRequestConfig
  status?: number // HTTP 状态码
  code?: string // 错误代码（如 'ERR_NETWORK'）
  request?: any
  response?: AxiosResponse<BaseResponse>
  message: string // 优先使用后端返回的 msg，兜底使用 axios 的 message
  name: 'RequestError'
  isAxiosError: boolean
}
```

**错误消息优先级**：

1. `response.data.msg`（后端返回的业务错误消息）
2. `response.data.message`（后端返回的备用消息字段）
3. `error.message`（axios 的原始错误消息）

```ts
try {
  await client.get('/api/user')
} catch (error: RequestError) {
  console.log(error.message) // 直接获取友好的错误消息
  console.log(error.status) // HTTP 状态码，如 500
  console.log(error.code) // 错误代码，如 'ERR_BAD_RESPONSE'
}
```

## TypeScript 支持

### 基础类型推导

```ts
// 自动类型推导
const client = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 5000
})

// 泛型支持
interface User {
  id: number
  name: string
  email: string
}

const users = await client.get<User[]>('/users')
// users.data 具有正确的类型：User[]
```

### 导出的类型

HttpClient 导出了以下类型供使用：

```ts
import type {
  // 自定义类型
  BaseResponse, // 基础响应体类型
  RequestError, // 标准化的错误类型
  ExtendedAxiosRequestConfig, // 扩展的请求配置类型
  ExtendedAxiosResponse, // 扩展的响应类型（config 字段为 ExtendedAxiosRequestConfig）
  HttpClientOptions, // HttpClient 构造函数配置类型

  // Axios 原生类型（重新导出）
  AxiosError, // Axios 错误类型
  AxiosResponse, // Axios 响应类型
  AxiosRequestConfig, // Axios 请求配置类型
  InternalAxiosRequestConfig, // Axios 内部请求配置类型
  AxiosHeaders, // Axios Headers 类型
  AxiosInstance // Axios 实例类型
} from '@seevin/common'
```

### 自定义字段支持

`ExtendedAxiosRequestConfig` 支持添加自定义字段：

```ts
// 方式 1：直接使用（运行时有效，但无类型提示）
client.get('/api/user', {
  loading: true, // 自定义字段
  download: false, // 自定义字段
  noErrMsg: true // 自定义字段
})

// 方式 2：使用类型断言（有类型提示）
interface CustomConfig extends ExtendedAxiosRequestConfig {
  loading?: boolean
  download?: boolean
  noErrMsg?: boolean
}

client.get('/api/user', {
  loading: true,
  download: false,
  noErrMsg: true
} as CustomConfig)

// 方式 3：全局扩展（推荐，所有地方都有类型提示）
declare module '@seevin/common' {
  interface ExtendedAxiosRequestConfig {
    loading?: boolean
    download?: boolean
    noErrMsg?: boolean
  }
}

// 之后所有地方都有类型提示
client.get('/api/user', {
  loading: true, // ✓ 有类型提示
  download: false, // ✓ 有类型提示
  noErrMsg: true // ✓ 有类型提示
})
```

### 在拦截器中使用自定义字段

```ts
const client = new HttpClient({
  interceptors: {
    request: [
      {
        onFulfilled: config => {
          // 根据自定义字段显示 loading
          if (config.loading) {
            showLoading()
          }
          return config
        }
      }
    ],
    response: [
      {
        onFulfilled: response => {
          // 隐藏 loading
          if (response.config.loading) {
            hideLoading()
          }

          // 处理文件下载
          if (response.config.download) {
            downloadFile(response.data, response.config.fileName)
          }

          return response
        },
        onRejected: error => {
          // 错误时也要隐藏 loading
          if (error.config?.loading) {
            hideLoading()
          }
          return Promise.reject(error)
        }
      }
    ]
  }
})
```

:::warning 注意
`response.config` 的类型是 `InternalAxiosRequestConfig`，如果需要访问自定义字段，建议使用 `ExtendedAxiosResponse` 类型：

```ts
import type { ExtendedAxiosResponse, BaseResponse } from '@seevin/common'

response: [
  {
    onFulfilled: (response: ExtendedAxiosResponse<BaseResponse<User>>) => {
      if (response.config.loading) {
        // ✓ 有类型提示
        hideLoading()
      }
      return response
    }
  }
]
```

:::

## API 参考

### 类型定义

#### HttpClientOptions

```typescript
type HttpClientOptions = {
  /**
   * 默认是否返回完整的 AxiosResponse 对象
   * @default false
   */
  returnFullResponse?: boolean
  /**
   * 自定义拦截器
   */
  interceptors?: {
    /**
     * 请求拦截器数组
     */
    request?: Array<{
      onFulfilled?: (
        config: InternalAxiosRequestConfig
      ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
      onRejected?: (error: any) => any
    }>
    /**
     * 响应拦截器数组
     */
    response?: Array<{
      onFulfilled?: (response: AxiosResponse<BaseResponse>) => AxiosResponse<BaseResponse>
      onRejected?: (error: AxiosError) => any
    }>
  }
} & Omit<AxiosRequestConfig, 'url' | 'method' | 'data' | 'params'>
```

#### BaseResponse

```typescript
interface BaseResponse<T = any> {
  code: number
  data: T
  msg?: string
  recordsFiltered?: number
  [key: string]: any
}
```

#### ExtendedAxiosRequestConfig

```typescript
interface ExtendedAxiosRequestConfig<TReturnFullResponse extends boolean = false> extends AxiosRequestConfig {
  /**
   * 是否返回完整的 AxiosResponse 对象
   * @default false
   */
  returnFullResponse?: TReturnFullResponse
  /**
   * 用于可管理的请求取消。提供此键后，可以使用 `client.cancelRequest(key)` 来取消请求。
   */
  requestKey?: string
  /**
   * 允许用户添加自定义字段
   */
  [key: string]: any
}
```

#### ExtendedAxiosResponse

```typescript
/**
 * 扩展的 AxiosResponse，config 字段使用 ExtendedAxiosRequestConfig
 * 用于在响应拦截器中访问自定义字段
 */
interface ExtendedAxiosResponse<T = any> extends Omit<AxiosResponse<T>, 'config'> {
  config: ExtendedAxiosRequestConfig
}
```

#### RequestError

```typescript
interface RequestError extends Error {
  config: InternalAxiosRequestConfig
  status?: number
  code?: string
  request?: any
  response?: AxiosResponse<BaseResponse>
  isAxiosError: boolean
}
```

### 实例方法

#### 核心请求方法

```typescript
// 返回完整响应
request<T = any>(config: ExtendedAxiosRequestConfig<true>): Promise<AxiosResponse<BaseResponse<T>>>

// 返回响应数据
request<T = any>(config: ExtendedAxiosRequestConfig<false>): Promise<BaseResponse<T>>

// 通用重载
request<T = any, TReturnFullResponse extends boolean = false>(
  config: ExtendedAxiosRequestConfig<TReturnFullResponse>
): Promise<HttpResponse<T, TReturnFullResponse>>
```

#### HTTP 方法

```typescript
// GET 请求
get<T = any>(url: string, config?: ExtendedAxiosRequestConfig): Promise<BaseResponse<T> | AxiosResponse<BaseResponse<T>>>

// POST 请求
post<T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig): Promise<BaseResponse<T> | AxiosResponse<BaseResponse<T>>>

// PUT 请求
put<T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig): Promise<BaseResponse<T> | AxiosResponse<BaseResponse<T>>>

// DELETE 请求
delete<T = any>(url: string, config?: ExtendedAxiosRequestConfig): Promise<BaseResponse<T> | AxiosResponse<BaseResponse<T>>>

// PATCH 请求
patch<T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig): Promise<BaseResponse<T> | AxiosResponse<BaseResponse<T>>>
```

#### 请求取消

```typescript
// 取消一个或多个请求
cancelRequest(requestKey: string | string[]): void

// 取消所有待处理的请求
cancelAllRequests(): void
```
