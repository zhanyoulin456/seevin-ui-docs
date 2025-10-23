# ProUpload 文件上传组件

一个功能强大的文件上传组件，基于 TDesign Upload 组件深度封装，提供了阿里云 OSS 直传、图片裁剪、文件类型自动验证、进度监控等企业级特性。组件支持全局配置和局部配置的灵活组合，内置了完善的错误处理和用户友好的提示机制，适用于各种文件上传场景。

## 使用场景

- **单文件上传**：头像上传、身份证照片上传、合同文件上传等
- **图片裁剪上传**：头像裁剪、横幅图片裁剪、产品图片统一尺寸等
- **批量文件上传**：产品图片批量上传、数据导入文件上传等
- **拖拽上传**：大文件上传、多文件同时上传等高效场景
- **图片墙**：商品图片管理、照片相册等需要缩略图展示的场景
- **定制上传**：特殊格式文件处理、上传前加密、大文件分片上传等
- **企业级应用**：OA 系统文件附件、CRM 客户资料上传等

## 核心特性

- **OSS 直传**：内置阿里云 OSS 直传支持，减少服务器压力
- **图片裁剪**：内置图片裁剪功能，支持自定义裁剪比例和裁剪参数
- **类型验证**：自动根据 MIME 类型验证文件格式，提供友好提示
- **进度监控**：实时显示上传进度，支持暂停和取消操作
- **全局配置**：支持通过 ProConfigProvider 进行全局配置
- **错误处理**：完善的错误处理机制和用户友好的错误提示
- **自定义扩展**：支持自定义上传逻辑，灵活适配各种业务需求

## 快速开始

在使用 ProUpload 组件之前，您需要：

1. **准备 OSS 配置**：获取阿里云 OSS 的 AccessKey、Bucket 等信息
2. **实现签名服务**：在后端实现一个获取 OSS 上传签名的接口
3. **配置签名函数**：在前端实现 `signature` 函数，调用后端接口获取签名

⚠️ **提示**：

- 如果您不使用 OSS 直传，可以通过 `request-method` 属性自定义上传逻辑
- 图片裁剪功能基于 `vue-cropper` 库实现，组件已内置该依赖，无需额外安装

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

## 图片裁剪

通过 `aspect-ratio` 属性开启图片裁剪功能，支持自定义裁剪比例。组件会在上传图片前自动弹出裁剪弹窗。

<DemoBox title="图片裁剪" description="上传图片前进行裁剪，支持自定义裁剪比例">
  <div class="space-y-4">
    <ProUpload
      v-model="fileList"
      :signature="getSignature"
      accept="image/*"
      aspect-ratio="16:9"
      theme="image"
      @success="handleSuccess"
      @fail="handleFail"
    />
    <p class="text-sm text-gray-500">裁剪比例：16:9（适用于横幅图片）</p>
  </div>
</DemoBox>

```vue
<template>
  <ProUpload
    v-model="fileList"
    :signature="getSignature"
    accept="image/*"
    aspect-ratio="16:9"
    theme="image"
    @success="handleSuccess"
    @fail="handleFail"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessagePlugin, type UploadFile, type ProUploadProps } from '@seevin/ui'

const fileList = ref<UploadFile[]>([])

const getSignature: ProUploadProps['signature'] = async (fileName, file) => {
  // 获取签名逻辑...
  return {
    accessId: 'YOUR_ACCESS_ID',
    dir: 'user-uploads',
    host: 'https://your-oss-bucket.oss-cn-hangzhou.aliyuncs.com',
    policy: 'YOUR_POLICY_BASE64',
    signature: 'YOUR_SIGNATURE',
    fileName: `demo_${Date.now()}_${file.name}`
  }
}

const handleSuccess: ProUploadProps['onSuccess'] = ({ file }) => {
  MessagePlugin.success(`${file.name} 上传成功`)
}

const handleFail: ProUploadProps['onFail'] = ({ file }) => {
  MessagePlugin.error(`${file.name} 上传失败`)
}
</script>
```

### 自定义裁剪参数

通过 `cropper-props` 和 `dialog-props` 可以自定义裁剪器和弹窗的配置。

<DemoBox title="自定义裁剪参数" description="自定义裁剪器的输出格式、质量等参数">
  <ProUpload
    v-model="fileList"
    :signature="getSignature"
    accept="image/*"
    aspect-ratio="1:1"
    :cropper-props="{
      outputType: 'jpeg',
      outputSize: 0.8,
      canScale: true,
      autoCropWidth: 200,
      autoCropHeight: 200
    }"
    :dialog-props="{
      header: '裁剪头像',
      width: '800px'
    }"
    theme="image"
    @success="handleSuccess"
  />
</DemoBox>

```vue
<template>
  <ProUpload
    v-model="fileList"
    :signature="getSignature"
    accept="image/*"
    aspect-ratio="1:1"
    :cropper-props="{
      outputType: 'jpeg',
      outputSize: 0.8,
      canScale: true,
      autoCropWidth: 200,
      autoCropHeight: 200
    }"
    :dialog-props="{
      header: '裁剪头像',
      width: '800px'
    }"
    theme="image"
    @success="handleSuccess"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UploadFile, ProUploadProps } from '@seevin/ui'

const fileList = ref<UploadFile[]>([])

const getSignature: ProUploadProps['signature'] = async (fileName, file) => {
  // 获取签名逻辑...
}

const handleSuccess: ProUploadProps['onSuccess'] = ({ file }) => {
  console.log('裁剪后的图片已上传:', file)
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

`ProUpload` 组件的许多核心功能，如 `signature`、`rename`、`beforeUpload` `requestMethod` 和 `onFail` 等，都支持两种配置方式：

1.  **全局配置**：通过 `ProConfigProvider` 组件在应用根部进行统一配置。这对于需要全站统一上传行为的场景非常有用。
2.  **Props 单独配置**：直接在 `ProUpload` 组件上通过 `props` 进行配置。

当两种配置同时存在时，**`props` 的优先级总是高于 `ProConfigProvider` 中的全局配置**。这意味着你可以先进行全局配置，然后在个别需要特殊处理的 `ProUpload` 实例上通过 `props` 进行覆盖。

## 高级用法

### 文件类型限制和大小验证

组件内置了智能的文件类型验证，支持 MIME 类型匹配和友好的错误提示。

<DemoBox title="文件类型限制" description="只允许上传 PDF 和 Word 文档">
  <ProUpload
    v-model="fileList"
    :signature="getSignature"
    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    :before-upload="beforeUploadCheck"
    @success="handleSuccess"
    @fail="handleFail"
  >
    <TButton theme="primary">
      <template #icon>
        <UploadIcon />
      </template>
      上传文档
    </TButton>
  </ProUpload>
</DemoBox>

```vue
<template>
  <ProUpload
    v-model="fileList"
    :signature="getSignature"
    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    :before-upload="beforeUploadCheck"
    @success="handleSuccess"
    @fail="handleFail"
  >
    <TButton theme="primary">
      <UploadIcon />
      上传文档
    </TButton>
  </ProUpload>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessagePlugin, type UploadFile, type ProUploadProps } from '@seevin/ui'

const fileList = ref<UploadFile[]>([])

const beforeUploadCheck: ProUploadProps['beforeUpload'] = file => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size! > maxSize) {
    MessagePlugin.warning('文件大小不能超过 10MB')
    return false
  }
  return true
}

const getSignature: ProUploadProps['signature'] = async (fileName, file) => {
  // 获取签名逻辑...
}
</script>
```

### 图片压缩和预处理

结合 `before-upload` 属性对图片进行压缩处理。

```vue
<template>
  <ProUpload
    v-model="fileList"
    :signature="getSignature"
    accept="image/*"
    :before-upload="compressImage"
    theme="image"
    multiple
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessagePlugin, type ProUploadProps } from '@seevin/ui'

const fileList = ref([])

const compressImage: ProUploadProps['beforeUpload'] = file => {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // 计算压缩后的尺寸
      const maxWidth = 1920
      const maxHeight = 1080
      let { width, height } = img

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }

      canvas.width = width
      canvas.height = height

      // 绘制压缩后的图片
      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        blob => {
          if (blob) {
            // 替换原文件
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })

            // 更新文件对象
            Object.assign(file, {
              raw: compressedFile,
              size: compressedFile.size
            })

            MessagePlugin.success(`图片已压缩：${(file.size! / 1024 / 1024).toFixed(2)}MB`)
          }
          resolve(true)
        },
        file.type,
        0.8
      )
    }

    img.src = URL.createObjectURL(file.raw!)
  })
}
</script>
```

### 批量上传进度监控

对于大量文件上传，可以监控整体进度。

```vue
<template>
  <div>
    <ProUpload
      v-model="fileList"
      :signature="getSignature"
      multiple
      :max="10"
      @progress="handleProgress"
      @success="handleBatchSuccess"
    >
      <div class="upload-area">
        <p>批量上传文件（最多10个）</p>
        <p class="text-sm text-gray-500">支持拖拽多个文件</p>
      </div>
    </ProUpload>

    <div v-if="totalProgress > 0" class="mt-4">
      <div class="flex justify-between text-sm text-gray-600">
        <span>整体进度</span>
        <span>{{ totalProgress.toFixed(1) }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded h-2 mt-1">
        <div class="bg-blue-500 h-2 rounded transition-all duration-300" :style="{ width: `${totalProgress}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { type UploadFile, type ProUploadProps } from '@seevin/ui'

const fileList = ref<UploadFile[]>([])
const progressMap = ref<Record<string, number>>({})

// 计算整体进度
const totalProgress = computed(() => {
  const progresses = Object.values(progressMap.value)
  if (progresses.length === 0) return 0
  return progresses.reduce((sum, progress) => sum + progress, 0) / progresses.length
})

const handleProgress: ProUploadProps['onProgress'] = ({ file, percent }) => {
  progressMap.value[file.id || file.name] = percent
}

const handleBatchSuccess: ProUploadProps['onSuccess'] = ({ file }) => {
  // 上传成功后移除进度记录
  delete progressMap.value[file.id || file.name]

  // 检查是否所有文件都上传完成
  if (Object.keys(progressMap.value).length === 0) {
    MessagePlugin.success('所有文件上传完成！')
  }
}
</script>
```

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

| 名称           | 类型                                                                  | 默认值                             | 说明                                                                                                   |
| -------------- | --------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `signature`    | `(fileName: string, file: UploadFile) => Promise<ProUploadSignature>` | `-`                                | **必需**。获取 OSS 上传签名信息的函数。函数优先级：`props` > `ProConfigProvider`。                     |
| `rename`       | `(file: UploadFile) => string`                                        | `() => generateUUID() + file.name` | 文件重命名函数，返回新的文件名。                                                                       |
| `aspectRatio`  | `string`                                                              | `-`                                | 图片裁剪比例，格式为 `"4:3"` 或 `"16:9"`。设置后会在上传图片前自动弹出裁剪弹窗。                       |
| `cropperProps` | `Record<string, any>`                                                 | 见下方默认值                       | `vue-cropper` 的配置项，用于自定义裁剪器行为。[查看完整配置](https://github.com/xyxiao001/vue-cropper) |
| `dialogProps`  | `DialogProps`                                                         | `-`                                | `TDesign Dialog` 的配置项，用于自定义裁剪弹窗样式和行为。                                              |

#### cropperProps 默认配置

组件为 `vue-cropper` 提供了以下默认配置，您可以通过 `cropperProps` 覆盖这些默认值：

```javascript
{
  outputSize: 1,        // 输出图片质量（0-1）
  outputType: 'png',    // 输出图片格式（jpeg/png/webp）
  info: true,           // 显示裁剪信息
  full: false,          // 是否输出原图比例的截图
  canMove: true,        // 图片是否可以移动
  canMoveBox: true,     // 裁剪框是否可以移动
  original: false,      // 是否按原始比例渲染
  autoCrop: true,       // 是否默认生成截图框
  fixed: true,          // 是否固定裁剪框比例
  centerBox: true,      // 裁剪框是否限制在图片内
  infoTrue: true,       // 是否显示真实的输出图片宽高
  mode: 'contain'       // 图片渲染模式（contain/cover）
}
```

同时继承 `TDesign Upload` 的所有 `Props`，常用属性包括：

| 名称            | 类型                                                      | 默认值   | 说明                                                                       |
| --------------- | --------------------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| `accept`        | `string`                                                  | `-`      | 允许上传的文件类型，使用 MIME 类型，如 `image/*` 或 `image/jpeg,image/png` |
| `multiple`      | `boolean`                                                 | `false`  | 是否支持多文件上传                                                         |
| `max`           | `number`                                                  | `-`      | 最大上传文件数量                                                           |
| `maxSize`       | `number`                                                  | `-`      | 单个文件的最大尺寸（字节）                                                 |
| `disabled`      | `boolean`                                                 | `false`  | 是否禁用上传                                                               |
| `draggable`     | `boolean`                                                 | `false`  | 是否支持拖拽上传                                                           |
| `theme`         | `'file' \| 'image' \| 'image-flow' \| 'custom'`           | `'file'` | 上传组件风格                                                               |
| `beforeUpload`  | `(file: UploadFile) => boolean \| Promise<boolean>`       | `-`      | 上传文件之前的验证函数                                                     |
| `requestMethod` | `(files: UploadFile[]) => Promise<RequestMethodResponse>` | `-`      | 自定义上传方法，覆盖默认的 OSS 上传                                        |

🔗 [查看 TDesign Upload 完整 Props](https://tdesign.tencent.com/vue-next/components/upload?tab=api)

### Events

继承 `TDesign Upload` 的所有 `Events`，常用事件包括：

| 名称           | 参数                                                           | 说明               |
| -------------- | -------------------------------------------------------------- | ------------------ |
| `success`      | `{ file: UploadFile, fileList: UploadFile[], response?: any }` | 上传成功时触发     |
| `fail`         | `{ file: UploadFile, e: Error, response?: any }`               | 上传失败时触发     |
| `progress`     | `{ file: UploadFile, percent: number }`                        | 上传进度变化时触发 |
| `remove`       | `{ file: UploadFile, fileList: UploadFile[] }`                 | 移除文件时触发     |
| `preview`      | `{ file: UploadFile }`                                         | 点击文件预览时触发 |
| `selectChange` | `{ files: UploadFile[] }`                                      | 选择文件变化时触发 |

🔗 [查看 TDesign Upload 完整 Events](https://tdesign.tencent.com/vue-next/components/upload?tab=api)

### Slots

继承 `TDesign Upload` 的所有 `Slots`：

| 名称                 | 参数                      | 说明                 |
| -------------------- | ------------------------- | -------------------- |
| `default`            | `-`                       | 默认上传按钮区域     |
| `trigger`            | `-`                       | 自定义触发上传的元素 |
| `tips`               | `-`                       | 上传提示文案         |
| `dragContent`        | `-`                       | 拖拽区域的内容       |
| `fileListDisplay`    | `{ files: UploadFile[] }` | 自定义文件列表展示   |
| `uploadButton`       | `-`                       | 自定义上传按钮       |
| `cancelUploadButton` | `-`                       | 自定义取消上传按钮   |

🔗 [查看 TDesign Upload 完整 Slots](https://tdesign.tencent.com/vue-next/components/upload?tab=api)

### Methods

组件暴露的方法：

| 名称                | 参数                                    | 说明                                             |
| ------------------- | --------------------------------------- | ------------------------------------------------ |
| `triggerUpload`     | `-`                                     | 手动触发上传                                     |
| `uploadFilePercent` | `{ file: UploadFile, percent: number }` | 更新文件上传进度                                 |
| `uploadFiles`       | `files: UploadFile[]`                   | 批量上传文件                                     |
| `instance`          | `-`                                     | 获取 `TDesign Upload` 组件实例，可调用其所有方法 |

🔗 [查看 TDesign Upload 完整 Methods](https://tdesign.tencent.com/vue-next/components/upload?tab=api)

## 类型定义

```ts
import type { UploadFile, UploadInstanceFunctions, UploadProps, DialogProps } from '@seevin/ui'
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
  /**
   * @description 图片裁剪比例，格式为 "4:3" 或 "16:9"
   */
  aspectRatio?: string
  /**
   * @description vue-cropper 的配置项
   */
  cropperProps?: Record<string, any>
  /**
   * @description t-dialog 的配置项，用于控制裁剪弹窗
   */
  dialogProps?: DialogProps
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

## 最佳实践

### 1. 安全性配置

```javascript
// 后端签名接口示例
const getOSSSignature = async (fileName, file) => {
  try {
    const response = await fetch('/api/oss/signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        fileName,
        fileSize: file.size,
        fileType: file.type
      })
    })

    if (!response.ok) {
      throw new Error('获取签名失败')
    }

    return await response.json()
  } catch (error) {
    console.error('签名获取失败:', error)
    throw error
  }
}
```

### 2. 文件类型限制最佳实践

```javascript
// 推荐的文件类型配置（MIME 类型）
const acceptConfigs = {
  image: 'image/*', // 所有图片类型
  imageSpecific: 'image/jpeg,image/png,image/gif,image/webp', // 特定图片类型
  document: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document', // PDF和Word
  video: 'video/*', // 所有视频类型
  audio: 'audio/*', // 所有音频类型
  text: 'text/plain,text/csv' // 文本文件
}

// 使用示例
<ProUpload accept={acceptConfigs.image} />
<ProUpload accept={acceptConfigs.document} />
```

**注意**：组件内部使用 `mime-match` 库进行 MIME 类型匹配，确保了准确的文件类型验证。

### 3. 全局配置示例

```vue
<template>
  <ProConfigProvider :config="uploadConfig">
    <div id="app">
      <router-view />
    </div>
  </ProConfigProvider>
</template>

<script setup>
import { reactive } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const uploadConfig = reactive({
  proUpload: {
    // 全局签名函数
    signature: async (fileName, file) => {
      return await getOSSSignature(fileName, file)
    },

    // 全局文件重命名
    rename: file => {
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 8)
      const ext = file.name.split('.').pop()
      return `${timestamp}_${randomStr}.${ext}`
    },

    // 全局上传前验证
    beforeUpload: file => {
      // 文件大小限制（100MB）
      const maxSize = 100 * 1024 * 1024
      if (file.size > maxSize) {
        MessagePlugin.error('文件大小不能超过 100MB')
        return false
      }
      return true
    },

    // 全局错误处理
    onFail: ({ file, error }) => {
      console.error(`文件 ${file.name} 上传失败:`, error)
      MessagePlugin.error(`文件 ${file.name} 上传失败，请重试`)
    },

    // 全局裁剪配置
    cropperProps: {
      outputType: 'jpeg',
      outputSize: 0.9,
      canScale: true
    },

    // 全局裁剪弹窗配置
    dialogProps: {
      width: '800px',
      placement: 'center'
    }
  }
})
</script>
```

### 4. 常用裁剪比例配置

```javascript
// 常用的图片裁剪比例
const cropRatios = {
  square: '1:1', // 正方形（头像、图标）
  landscape: '16:9', // 横向（横幅、视频封面）
  portrait: '9:16', // 竖向（手机壁纸、故事）
  photo: '4:3', // 照片（传统相机比例）
  widescreen: '21:9', // 超宽屏（电影、横幅）
  card: '3:2', // 卡片（名片、证件照）
  a4: '210:297' // A4 纸张比例
}

// 使用示例
<ProUpload aspect-ratio="1:1" /> // 头像上传
<ProUpload aspect-ratio="16:9" /> // 横幅图片
<ProUpload aspect-ratio="4:3" /> // 产品图片
```

## 使用注意事项

1. **安全性**：签名函数必须在后端实现，不要在前端硬编码 AccessKey
2. **文件大小**：建议在 `beforeUpload` 中限制文件大小，避免上传过大文件
3. **网络状态**：在网络不稳定的环境下建议实现重试机制
4. **内存优化**：对于大量文件上传，注意及时清理不需要的文件引用
5. **兼容性**：在低版本浏览器中可能需要 polyfill 支持
6. **用户体验**：提供清晰的上传状态反馈和错误提示
7. **图片裁剪**：裁剪功能仅对图片文件生效，非图片文件会跳过裁剪流程直接上传
8. **裁剪比例**：`aspectRatio` 格式必须为 `"宽:高"`，如 `"16:9"`、`"4:3"`、`"1:1"` 等

## 相关组件

- [`ProConfigProvider`](/components/config-provider) - 全局配置组件，用于配置上传组件的全局参数
- [`ProForm`](/components/form) - 表单组件，常与上传组件结合使用
- [`ProTable`](/components/table) - 表格组件，可在表格中显示上传的文件
