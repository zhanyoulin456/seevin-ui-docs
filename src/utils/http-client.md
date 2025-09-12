# HttpClient HTTP客户端

HttpClient 是基于 Axios 的现代化 HTTP 客户端，提供了简洁的 API 和强大的功能，支持拦截器、请求取消、错误处理等特性。

<script setup>
</script>

## 导入方式

```ts
import { HttpClient } from '@seevin/common'
```

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

## TypeScript 支持

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
