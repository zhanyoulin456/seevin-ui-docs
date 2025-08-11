# ConfigProvider 全局配置

为组件提供统一的全局化配置，你可以在 `ProConfigProvider` 中配置一些全局参数，例如 `proTable` 和 `proUpload` 的默认行为。

## 使用示例

```vue
<template>
  <ProConfigProvider :config="config">
    <App />
  </ProConfigProvider>
</template>

<script setup>
import { reactive } from 'vue'

const config = reactive({
  proTable: {
    paginationProps: {
      pageSizeOptions: [10, 20, 30, 100]
    }
  },
  proUpload: {
    rename: file => {
      return `${Date.now()}_${file.name}`
    }
  },
  drawer: {
    size: `480px`
  }
})
</script>
```

## Props

| 属性名 | 类型        | 默认值 | 说明         |
| ------ | ----------- | ------ | ------------ |
| config | `ProConfig` | `{}`   | 全局配置对象 |

## ProConfig

`ProConfig` 继承自 `TDesign` 的 `GlobalConfigProvider`，并扩展了以下配置：

### proTable

| 属性名          | 类型                                            | 说明                             |
| --------------- | ----------------------------------------------- | -------------------------------- |
| requestSuccess  | `(data: any) => { list: any[]; total: number }` | 请求成功后的回调，用于格式化数据 |
| requestFailed   | `(error: any) => void`                          | 请求失败后的回调                 |
| requestBefore   | `(params: any) => any`                          | 请求前的回调，用于修改请求参数   |
| paginationProps | `TableProps['pagination']`                      | 分页器属性，参考 `TDesign Table` |

### proUpload

| 属性名        | 类型                                                                  | 说明                                  |
| ------------- | --------------------------------------------------------------------- | ------------------------------------- |
| beforeUpload  | `(file: UploadFile) => boolean`                                       | 上传前的钩子，返回 `false` 则取消上传 |
| requestMethod | `(files: UploadFile[]) => Promise<RequestMethodResponse>`             | 自定义上传方法                        |
| onFail        | `(options: { file: UploadFile; e: Error }) => void`                   | 上传失败的钩子                        |
| signature     | `(fileName: string, file: UploadFile) => Promise<ProUploadSignature>` | 获取文件签名的方法                    |
| rename        | `(file: UploadFile) => string`                                        | 文件重命名函数                        |

## 类型定义

```ts
import type { InjectionKey, PropType } from 'vue'
import type { ProTableProps } from '../Table'
import { GlobalConfigProvider, UploadProps } from 'tdesign-vue-next'
import { ProUploadProps } from '../Upload'

export interface ProTableConfig {
  requestSuccess?: ProTableProps<any>['requestSuccess']
  requestFailed?: ProTableProps<any>['requestFailed']
  requestBefore?: ProTableProps<any>['requestBefore']
  paginationProps?: ProTableProps<any>['paginationProps']
}

export type ProUploadConfig = Pick<UploadProps, 'beforeUpload' | 'requestMethod' | 'onFail'> &
  Pick<ProUploadProps, 'signature' | 'rename'>

export interface ProConfig extends GlobalConfigProvider {
  proTable?: ProTableConfig
  proUpload?: ProUploadConfig
}

export const ProConfigProviderKey: InjectionKey<ProConfig> = Symbol('ProConfigProviderKey')
export const defaultProConfig: ProConfig = {
  proTable: {
    paginationProps: {
      pageSizeOptions: [10, 20, 30, 100]
    }
  },
  drawer: {
    size: `480px`
  }
}
export const configProviderProps = {
  config: {
    type: Object as PropType<ProConfig>,
    default: () => defaultProConfig
  }
}
```
