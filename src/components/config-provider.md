# ProConfigProvider 全局配置组件

一个功能强大的全局配置组件，为整个组件库提供统一的配置管理。通过 `ProConfigProvider` 可以全局配置组件的默认行为，包括 `ProTable`、`ProUpload`、`ProForm`、`ProFilter` 等组件的默认属性和回调函数，同时继承了 TDesign 的全局配置能力。

<script setup>
import { ref, reactive } from 'vue'

// 基础配置示例
const basicConfig = reactive({
  proTable: {
    paginationProps: {
      pageSizeOptions: [10, 20, 50, 100]
    }
  }
})

// 完整配置示例
const fullConfig = reactive({
  proTable: {
    paginationProps: {
      pageSizeOptions: [10, 20, 50, 100],
      showJumper: true
    },
    tableFilterStyle: {
      backgroundColor: '#fafafa',
      padding: '16px'
    },
    tableContentStyle: {
      borderRadius: '8px'
    }
  },
  proForm: {
    itemCol: 8,
    gutter: [16, 32]
  },
  proFilter: {
    showResult: true,
    padding: '20px'
  }
})
</script>

## 使用场景

- **表格默认行为**：配置分页器、请求处理、数据格式化等
- **表单布局配置**：设置表单项的默认栅格、间距等
- **上传组件配置**：统一文件上传的验证、重命名、签名等逻辑
- **筛选组件配置**：设置筛选器的默认样式和行为

## 基础用法

最简单的全局配置用法。

<DemoBox title="基础用法" description="配置基础的组件默认行为">
  <div class="p-4 border rounded">
    <p class="text-[color:var(--vp-c-text-1)] mb-2">当前配置:</p>
    <pre class="text-sm text-[color:var(--vp-c-text-2)] bg-[color:var(--vp-c-bg-alt)] p-3 rounded overflow-auto">{{ JSON.stringify(basicConfig, null, 2) }}</pre>
  </div>
</DemoBox>

```vue
<template>
  <ProConfigProvider :config="config">
    <router-view />
  </ProConfigProvider>
</template>

<script setup>
import { reactive } from 'vue'

const config = reactive({
  proTable: {
    paginationProps: {
      pageSizeOptions: [10, 20, 50, 100]
    }
  }
})
</script>
```

## 完整配置示例

配置多个组件的默认行为。

<DemoBox title="完整配置" description="配置多个组件的默认属性">
  <div class="p-4 border rounded">
    <p class="text-[color:var(--vp-c-text-1)] mb-2">完整配置示例:</p>
    <pre class="text-sm text-[color:var(--vp-c-text-2)] bg-[color:var(--vp-c-bg-alt)] p-3 rounded overflow-auto max-h-64">{{ JSON.stringify(fullConfig, null, 2) }}</pre>
  </div>
</DemoBox>

```vue
<template>
  <ProConfigProvider :config="config">
    <router-view />
  </ProConfigProvider>
</template>

<script setup>
import { reactive } from 'vue'

const config = reactive({
  proTable: {
    paginationProps: {
      pageSizeOptions: [10, 20, 50, 100],
      showJumper: true
    },
    tableFilterStyle: {
      backgroundColor: '#fafafa',
      padding: '16px'
    },
    tableContentStyle: {
      borderRadius: '8px'
    }
  },
  proForm: {
    itemCol: 8,
    gutter: [16, 32]
  },
  proFilter: {
    showResult: true,
    padding: '20px'
  },
  drawer: {
    size: '600px'
  }
})
</script>
```

## API

### Props

| 属性名 | 类型        | 默认值             | 说明         |
| ------ | ----------- | ------------------ | ------------ |
| config | `ProConfig` | `defaultProConfig` | 全局配置对象 |

### Slots

| 名称      | 参数 | 说明               |
| --------- | ---- | ------------------ |
| `default` | `-`  | 需要配置的应用内容 |

### Config 配置项

`ProConfig` 继承自 `TDesign` 的 `GlobalConfigProvider`，并扩展了以下配置：

#### proTable

表格组件的全局配置选项。

| 属性名            | 类型                                            | 默认值                                   | 说明                             |
| ----------------- | ----------------------------------------------- | ---------------------------------------- | -------------------------------- |
| requestSuccess    | `(data: any) => { list: any[]; total: number }` | `-`                                      | 请求成功后的回调，用于格式化数据 |
| requestFailed     | `(error: any) => void`                          | `-`                                      | 请求失败后的回调                 |
| requestBefore     | `(params: any) => any`                          | `-`                                      | 请求前的回调，用于修改请求参数   |
| paginationProps   | `TableProps['pagination']`                      | `{ pageSizeOptions: [10, 20, 30, 100] }` | 分页器属性                       |
| tableFilterStyle  | `CSSProperties`                                 | `-`                                      | 表格筛选区域样式                 |
| tableLayoutStyle  | `CSSProperties`                                 | `-`                                      | 表格布局样式                     |
| tableContentStyle | `CSSProperties`                                 | `-`                                      | 表格内容样式                     |
| contentTopStyle   | `CSSProperties`                                 | `-`                                      | 内容顶部样式                     |
| contentBodyStyle  | `CSSProperties`                                 | `-`                                      | 内容主体样式                     |
| ellipsis          | `ProTableProps['ellipsis']`                     | `{ props: { theme: 'light' } }`          | 省略号配置                       |

#### proUpload

上传组件的全局配置选项。

| 属性名        | 类型                                                                  | 默认值 | 说明               |
| ------------- | --------------------------------------------------------------------- | ------ | ------------------ |
| beforeUpload  | `(file: UploadFile) => boolean`                                       | `-`    | 上传前的钩子       |
| requestMethod | `(files: UploadFile[]) => Promise<RequestMethodResponse>`             | `-`    | 自定义上传方法     |
| onFail        | `(options: { file: UploadFile; e: Error }) => void`                   | `-`    | 上传失败的钩子     |
| signature     | `(fileName: string, file: UploadFile) => Promise<ProUploadSignature>` | `-`    | 获取文件签名的方法 |
| rename        | `(file: UploadFile) => string`                                        | `-`    | 文件重命名函数     |

#### proForm

表单组件的全局配置选项。

| 属性名  | 类型       | 默认值     | 说明               |
| ------- | ---------- | ---------- | ------------------ |
| gutter  | `number[]` | `[16, 24]` | 表单项间距         |
| itemCol | `number`   | `12`       | 表单项默认栅格列数 |

#### proFilter

筛选组件的全局配置选项。

| 属性名       | 类型      | 默认值   | 说明             |
| ------------ | --------- | -------- | ---------------- |
| showResult   | `boolean` | `true`   | 是否显示筛选结果 |
| padding      | `string`  | `'16px'` | 内边距           |
| conditionGap | `string`  | `'8px'`  | 筛选条件间距     |
| resultGap    | `string`  | `'10px'` | 筛选结果间距     |

## 类型定义

```typescript
import type { InjectionKey, PropType } from 'vue'
import type { ProTableProps } from '../Table'
import type { GlobalConfigProvider, UploadProps } from 'tdesign-vue-next'
import type { ProUploadProps } from '../Upload'
import type { ProFormProps } from '../Form'
import type { ProFilterProps } from '../Filter'

export interface ProConfig extends GlobalConfigProvider {
  proTable?: ProTableConfig
  proUpload?: ProUploadConfig
  proForm?: ProFormConfig
  proFilter?: ProFilterConfig
}

export const ProConfigProviderKey: InjectionKey<ProConfig> = Symbol('ProConfigProviderKey')

export const defaultProConfig: ProConfig = {
  proTable: {
    paginationProps: {
      pageSizeOptions: [10, 20, 30, 100]
    },
    ellipsis: {
      props: { theme: 'light' },
      content: (_h, { row, col }) => row[col.colKey!]
    }
  },
  proForm: {
    itemCol: 12,
    gutter: [16, 24]
  },
  proFilter: {
    showResult: true,
    padding: '16px'
  },
  drawer: {
    size: '480px'
  }
}
```

## 使用注意事项

1. **作用域**：`ProConfigProvider` 需要包裹在应用的最外层，确保所有子组件都能获取到配置
2. **配置合并**：组件会深度合并默认配置和传入的配置，传入的配置会覆盖默认值
3. **响应式更新**：使用 `reactive` 创建配置对象，可以动态修改配置
4. **类型安全**：建议使用 TypeScript 并导入相关类型定义
5. **性能考虑**：配置对象不应过于复杂，避免在配置中放置大量数据

## 相关组件

- [`ProTable`](/components/table) - 表格组件，支持全局配置
- [`ProForm`](/components/form) - 表单组件，支持全局配置
- [`ProUpload`](/components/upload) - 上传组件，支持全局配置
- [`ProFilter`](/components/filter) - 筛选组件，支持全局配置
