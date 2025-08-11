# Upload 文件上传

基于 TDesign Upload 组件封装的高级文件上传组件，提供拖拽上传、类型限制、尺寸配置、文件重命名、图片裁剪等功能，并集成阿里云 OSS 上传能力。

<script setup lang="ts">
import { ref } from 'vue'
import { MessagePlugin, type UploadFile, Button as TButton, Icon as TIcon } from 'tdesign-vue-next'
import { CloudUploadIcon, UploadIcon } from 'tdesign-icons-vue-next'
import { ProUploadProps, ProConfigProvider } from '@seevin/ui'

const fileList = ref<UploadFile[]>([])
const fileList2 = ref<UploadFile[]>([])
const fileList3 = ref<UploadFile[]>([
  {
    url: 'https://tdesign.gtimg.com/site/source/figma-pc.png',
    name: '示例图片.png',
    status: 'success'
  }
])

// 模拟获取后端的上传签名
const getSignature: ProUploadProps['signature'] = async (fileName, file) => {
  // 实际项目中，这里应该是调用您的后端服务来获取签名
  // 为了演示，我们模拟一个异步操作
  await new Promise(resolve => setTimeout(resolve, 300))

  // 模拟签名数据
  return {
    accessId: 'YOUR_ACCESS_ID',
    dir: 'user-uploads',
    host: 'https://your-oss-bucket.oss-cn-hangzhou.aliyuncs.com',
    policy: 'YOUR_POLICY_BASE64',
    signature: 'YOUR_SIGNATURE',
    fileName: `demo_${Date.now()}_${file.name}`
  }
}

const handleSuccess: ProUploadProps['onSuccess'] = ({ file, fileList }) => {
  MessagePlugin.success(`文件 ${file.name} 上传成功`)
  console.log('上传成功:', file, fileList)
}

const handleFail: ProUploadProps['onFail'] = ({ file, error }) => {
  MessagePlugin.error(`文件 ${file.name} 上传失败`)
  console.log('上传失败:', file, error)
}

const beforeUploadCheck: ProUploadProps['beforeUpload'] = (file) => {
  if (file.size! > 5 * 1024 * 1024) {
    MessagePlugin.warning('上传的文件大小不能超过 5MB')
    return false
  }
  return true
}

// 自定义上传逻辑
const customUploadFn: ProUploadProps['requestMethod'] = () => {
  const [file] = files
  return new Promise(resolve => {
    const formData = new FormData()
    formData.append('file', file as any)
    formData.append('filename', file.name)

    // 模拟上传进度
    let percent = 0
    const interval = setInterval(() => {
      percent += 10
      if (percent >= 100) {
        clearInterval(interval)
        // 模拟成功响应
        const response = {
          status: 'success' as const,
          response: {
            url: URL.createObjectURL(file.raw!),
            name: file.name
          }
        }
        MessagePlugin.success('自定义上传成功')
        resolve(response)
      }
    }, 200)
  })
}
</script>

## 基础用法

最基础的文件上传，点击或拖拽文件到指定区域即可上传。

<DemoBox title="基础用法" description="点击或拖拽上传">
  <ProUpload
    v-model="fileList"
    :signature="getSignature"
    @success="handleSuccess"
    @fail="handleFail"
  />
</DemoBox>

```vue
<template>
  <ProUpload v-model="fileList" :signature="getSignature" @success="handleSuccess" @fail="handleFail" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessagePlugin, UploadFile, ProUploadProps } from '@seevin/ui'

const fileList = ref<UploadFile[]>([])

// 模拟获取后端的上传签名
const getSignature: ProUploadProps['signature'] = async (fileName, file) => {
  // 实际项目中，这里应该是调用您的后端服务来获取签名
  return {
    accessId: 'YOUR_ACCESS_ID',
    dir: 'user-uploads',
    host: 'https://your-oss-bucket.oss-cn-hangzhou.aliyuncs.com',
    policy: 'YOUR_POLICY_BASE64',
    signature: 'YOUR_SIGNATURE',
    fileName: `demo_${Date.now()}_${file.name}`
  }
}

const handleSuccess: ProUploadProps['onSuccess'] = ({ file, fileList }) => {
  MessagePlugin.success(`文件 ${file.name} 上传成功`)
}

const handleFail: ProUploadProps['onFail'] = ({ file, error }) => {
  MessagePlugin.error(`文件 ${file.name} 上传失败`)
}
</script>
```

## 拖拽上传

通过 `draggable` 属性开启拖拽上传。

<DemoBox title="拖拽上传" description="将文件拖拽到指定区域进行上传">
  <ProUpload
    v-model="fileList2"
    draggable
    :signature="getSignature"
    accept="image/*"
    :before-upload="beforeUploadCheck"
    @success="handleSuccess"
    @fail="handleFail"
  >
    <div class="p-8 border border-dashed rounded-md text-center cursor-pointer hover:border-primary">
      <TIcon name="cloud-upload" size="48px" class="text-gray-400" />
      <p class="mt-2 text-sm text-gray-600">将图片拖到此处，或<span class="text-primary">点击上传</span></p>
      <p class="text-xs text-gray-400 mt-1">仅支持图片文件，大小不超过 5MB</p>
    </div>
  </ProUpload>
</DemoBox>

```vue
<template>
  <ProUpload
    v-model="fileList"
    draggable
    :signature="getSignature"
    accept="image/*"
    :before-upload="beforeUploadCheck"
    @success="handleSuccess"
    @fail="handleFail"
  >
    <div class="custom-drag-area">
      <TIcon name="cloud-upload" size="48px" />
      <p>将图片拖到此处，或<span class="text-primary">点击上传</span></p>
      <p class="tip">仅支持图片文件，大小不超过 5MB</p>
    </div>
  </ProUpload>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessagePlugin, UploadFile, ProUploadProps } from '@seevin/ui'

const fileList = ref<UploadFile[]>([])

const getSignature: ProUploadProps['signature'] = async (fileName, file) => {
  // ... 获取签名逻辑
}

const handleSuccess: ProUploadProps['onSuccess'] = ({ file }) => {
  MessagePlugin.success(`${file.name} 上传成功`)
}

const handleFail: ProUploadProps['onFail'] = ({ file }) => {
  MessagePlugin.error(`${file.name} 上传失败`)
}

const beforeUploadCheck: ProUploadProps['beforeUpload'] = file => {
  if (file.size! > 5 * 1024 * 1024) {
    MessagePlugin.warning('上传的文件大小不能超过 5MB')
    return false
  }
  return true
}
</script>
```

## 图片墙

设置 `theme="image"` 可以展示为图片墙，并支持预览。

<DemoBox title="图片墙" description="用于上传图片并展示缩略图">
  <ProUpload
    v-model="fileList3"
    theme="image"
    :signature="getSignature"
    accept="image/*"
    :max="5"
    multiple
    @success="handleSuccess"
    @fail="handleFail"
  />
</DemoBox>

```vue
<template>
  <ProUpload
    v-model="fileList"
    theme="image"
    :signature="getSignature"
    accept="image/*"
    :max="5"
    multiple
    @success="handleSuccess"
    @fail="handleFail"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UploadFile, ProUploadProps } from '@seevin/ui'

const fileList = ref<UploadFile[]>([
  {
    url: 'https://tdesign.gtimg.com/site/source/figma-pc.png',
    name: '示例图片.png',
    status: 'success'
  }
])

const getSignature: ProUploadProps['signature'] = async (fileName, file) => {
  // ... 获取签名逻辑
}

const handleSuccess: ProUploadProps['onSuccess'] = e => {
  // ...
}

const handleFail: ProUploadProps['onFail'] = e => {
  // ...
}
</script>
```

## 自定义上传方法

通过 `request-method` 属性可以完全自定义上传的行为，适用于不使用内置 OSS 上传的场景。

<DemoBox title="自定义上传方法" description="使用 request-method 覆盖默认的上传逻辑">
  <ProUpload
    v-model="fileList"
    :request-method="customUploadFn"
  >
    <TButton theme="primary">
      <template #icon>
        <TIcon name="upload" />
      </template>
      自定义上传
    </TButton>
  </ProUpload>
</DemoBox>

```vue
<template>
  <ProUpload v-model="fileList" :request-method="customUploadFn">
    <TButton theme="primary">
      <template #icon>
        <TIcon name="upload" />
      </template>
      自定义上传
    </TButton>
  </ProUpload>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessagePlugin, UploadFile, ProUploadProps } from '@seevin/ui'

const fileList = ref<UploadFile[]>([])

// 自定义上传逻辑
const customUploadFn: ProUploadProps['requestMethod'] = files => {
  const [file] = files
  return new Promise(resolve => {
    const formData = new FormData()
    formData.append('file', file as any)
    formData.append('filename', file.name)

    // 模拟上传进度
    let percent = 0
    const interval = setInterval(() => {
      percent += 10
      if (percent >= 100) {
        clearInterval(interval)
        // 模拟成功响应
        const response = {
          status: 'success' as const,
          response: {
            url: URL.createObjectURL(file.raw!),
            name: file.name
          }
        }
        MessagePlugin.success('自定义上传成功')
        resolve(response)
      }
    }, 200)
  })
}
</script>
```

## 全局配置与 Props

`ProUpload` 组件的许多核心功能，如 `signature`、`rename`、`beforeUpload` 和 `onFail` 等，都支持两种配置方式：

1.  **全局配置**：通过 `ProConfigProvider` 组件在应用根部进行统一配置。这对于需要全站统一上传行为的场景非常有用。
2.  **Props 单独配置**：直接在 `ProUpload` 组件上通过 `props` 进行配置。

当两种配置同时存在时，**`props` 的优先级总是高于 `ProConfigProvider` 中的全局配置**。这意味着你可以先进行全局配置，然后在个别需要特殊处理的 `ProUpload` 实例上通过 `props` 进行覆盖。

这种设计提供了高度的灵活性，让你既能保持整体一致性，又能轻松处理特殊情况。

<DemoBox title="配置优先级示例" description="第一个上传组件使用全局配置的 rename，第二个通过 prop 覆盖它。">
  <ProConfigProvider :config="{ ProUpload: { rename: file => `global_${file.name}` } }">
    <div class="space-y-4">
      <p>↓ 这个组件会使用全局配置的 rename 函数，文件名前缀为 'global_'</p>
      <ProUpload :signature="getSignature">
        <TButton>全局配置上传</TButton>
      </ProUpload>
      <p>↓ 这个组件使用 prop 覆盖了全局配置，文件名前缀为 'local_'</p>
      <ProUpload :signature="getSignature" :rename="file => `local_${file.name}`">
        <TButton>Prop 覆盖上传</TButton>
      </ProUpload>
    </div>
  </ProConfigProvider>
</DemoBox>

```vue
<template>
  <ProConfigProvider :config="globalUploadConfig">
    <div class="space-y-4">
      <p>↓ 这个组件会使用全局配置的 rename 函数，文件名前缀为 'global_'</p>
      <ProUpload :signature="getSignature">
        <TButton>全局配置上传</TButton>
      </ProUpload>

      <p>↓ 这个组件使用 prop 覆盖了全局配置，文件名前缀为 'local_'</p>
      <ProUpload :signature="getSignature" :rename="file => `local_${file.name}`">
        <TButton>Prop 覆盖上传</TButton>
      </ProUpload>
    </div>
  </ProConfigProvider>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { CConfig, ProUploadProps } from '@seevin/ui'

const globalUploadConfig = reactive<CConfig>({
  ProUpload: {
    rename: file => `global_${file.name}`
  }
})

const getSignature: ProUploadProps['signature'] = async (fileName, file) => {
  // ... 模拟签名逻辑
  return {
    accessId: 'YOUR_ACCESS_ID',
    dir: 'user-uploads',
    host: 'https://your-oss-bucket.oss-cn-hangzhou.aliyuncs.com',
    policy: 'YOUR_POLICY_BASE64',
    signature: 'YOUR_SIGNATURE',
    fileName: `demo_${Date.now()}_${file.name}`
  }
}
</script>
```

## API

### Props

| 名称        | 类型                                                                  | 默认值                             | 说明                                                                               |
| ----------- | --------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------- |
| `signature` | `(fileName: string, file: UploadFile) => Promise<ProUploadSignature>` | -                                  | **必需**。获取 OSS 上传签名信息的函数。函数优先级：`props` > `ProConfigProvider`。 |
| `rename`    | `(file: UploadFile) => string`                                        | `() => generateUUID() + file.name` | 文件重命名函数，返回新的文件名。                                                   |

同时继承 `TDesign Upload` 的所有 `Props`，常用属性包括 `accept`, `max`, `multiple`, `disabled`, `theme`, `before-upload` 等。

[查看 TDesign Upload Props](https://tdesign.tencent.com/vue-next/components/upload?tab=api)

### Events

继承 `TDesign Upload` 的所有 `Events`，常用事件包括 `success`, `fail`, `progress`, `remove`。

[查看 TDesign Upload Events](https://tdesign.tencent.com/vue-next/components/upload?tab=api)

### Slots

继承 `TDesign Upload` 的所有 `Slots`。

[查看 TDesign Upload Slots](https://tdesign.tencent.com/vue-next/components/upload?tab=api)

### Methods

| 名称       | 说明                                               |
| ---------- | -------------------------------------------------- |
| `instance` | 获取 `TDesign Upload` 组件实例，可调用其所有方法。 |

[查看 TDesign Upload Methods](https://tdesign.tencent.com/vue-next/components/upload?tab=api)

## 类型定义

```ts
import type { UploadFile, UploadInstanceFunctions, UploadProps } from '@seevin/ui'
import { Ref } from 'vue'

export interface ProUploadProps extends UploadProps {
  /**
   * @description 文件签名函数。props 优先级最高，其次是 ProConfigProvider。
   */
  signature?: (fileName: string, file: UploadFile) => Promise<ProUploadSignature>
  /**
   * @description 文件重命名函数，返回新的文件名。
   */
  rename?: (file: UploadFile) => string
}

export interface ProUploadSignature {
  accessId: string
  dir: string
  fileName: string
  host: string
  policy: string
  signature: string
}

export interface ProUploadExpose extends UploadInstanceFunctions {
  /** @description 获取上传实例 有些实例方法没有在 UploadInstanceFunctions 中定义，需要通过该实例调用 */
  instance: Ref<UploadInstanceFunctions | undefined>
}
```
