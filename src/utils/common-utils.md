# 通用工具函数

@seevin/common 提供了一系列实用的通用工具函数，涵盖开发调试、URL 处理、UUID 生成等常见场景。

<script setup>
import { ref } from 'vue'
import { Button as TButton } from 'tdesign-vue-next'
import DemoBox from '../../.vitepress/components/DemoBox.vue'

// 示例数据
const warnMessage = ref('')
const errorMessage = ref('')
const testUrl = ref('https://example.com/image.jpg')
const isNetwork = ref(null)
const generatedUUID = ref('')
const generatedShortUUID = ref('')

const showWarning = () => {
  warnMessage.value = '[MyComponent] 这是一个警告信息'
  console.warn('[MyComponent] 这是一个警告信息')
}

const showError = () => {
  errorMessage.value = '[MyComponent] 这是一个错误信息'
  console.error('[MyComponent] 这是一个错误信息')
}

const checkUrl = () => {
  // 模拟 isNetworkUrl 函数
  isNetwork.value = testUrl.value.startsWith('http')
}

const generateUUID = () => {
  // 模拟 UUID 生成
  generatedUUID.value = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const generateShortUUID = () => {
  // 模拟短 UUID 生成
  generatedShortUUID.value = Math.random().toString(36).substr(2, 8)
}
</script>

## 导入方式

### 按需导入（推荐）

```ts
// 开发调试工具
import { devWarn, devError } from '@seevin/common'

// UUID 生成工具
import { generateShortUUID, generateUUID } from '@seevin/common'

// 类型判断工具
import {
  is,
  isFunction,
  isDef,
  isUnDef,
  isObject,
  isDate,
  isNumber,
  isAsyncFunction,
  isPromise,
  isString,
  isBoolean,
  isArray,
  isNull,
  isNullOrUnDef,
  isElement
} from '@seevin/common'

// URL 和媒体检测
import { isNetworkUrl, isImage, isVideo, isHexColor } from '@seevin/common'

// 环境检测
import { isClient, isWindow, isDingTalk, isAndroid, isiOS, isWeChat, isAlipay } from '@seevin/common'
```

## 开发调试工具

### devWarn

开发环境下输出警告信息，生产环境会被 Tree-shaking 移除。

<DemoBox title="开发警告" description="在开发环境输出格式化的警告信息">
<div>
  <div class="mb-4">
    <TButton @click="showWarning">触发警告</TButton>
  </div>
  <div v-if="warnMessage" class="mb-3">
    <h4 class="text-base text-[color:var(--vp-c-text-1)] mb-2">控制台输出：</h4>
    <pre class="text-sm bg-yellow-50 p-3 rounded border text-yellow-700">{{ warnMessage }}</pre>
  </div>
</div>
</DemoBox>

```ts
import { devWarn } from '@seevin/common'

// 基础用法
devWarn('MyComponent', '这是一个警告信息')

// 带详细信息
devWarn('DataTable', '数据格式不正确', {
  expected: 'Array<Object>',
  received: 'string'
})
```

**参数说明：**

- `scope` (string): 组件或模块名称
- `message` (string): 警告信息
- `details` (any, 可选): 详细信息对象

### devError

开发环境下输出错误信息，生产环境会被 Tree-shaking 移除。

<DemoBox title="开发错误" description="在开发环境输出格式化的错误信息">
<div>
  <div class="mb-4">
    <TButton theme="danger" @click="showError">触发错误</TButton>
  </div>
  <div v-if="errorMessage" class="mb-3">
    <h4 class="text-base text-[color:var(--vp-c-text-1)] mb-2">控制台输出：</h4>
    <pre class="text-sm bg-red-50 p-3 rounded border text-red-600">{{ errorMessage }}</pre>
  </div>
</div>
</DemoBox>

```ts
import { devError } from '@seevin/common'

// 基础用法
devError('MyComponent', '发生了一个错误')

// 带错误对象
devError('ApiService', '请求失败', new Error('Network Error'))
```

**参数说明：**

- `scope` (string): 组件或模块名称
- `message` (string): 错误信息
- `error` (Error | any, 可选): 错误对象或详细信息

## URL 工具

### isNetworkUrl

判断给定的 URL 是否为网络地址。

<DemoBox title="URL 检测" description="检测 URL 是否为网络地址">
<div>
  <div class="mb-4">
    <div class="flex items-center gap-2 mb-2">
      <input 
        v-model="testUrl" 
        class="px-3 py-2 border rounded flex-1" 
        placeholder="输入要检测的 URL"
      />
      <TButton @click="checkUrl">检测</TButton>
    </div>
  </div>
  <div v-if="isNetwork !== null" class="mb-3">
    <h4 class="text-base text-[color:var(--vp-c-text-1)] mb-2">检测结果：</h4>
    <pre class="text-sm p-3 rounded border" :class="isNetwork ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'">{{ isNetwork ? '✓ 是网络地址' : '✗ 不是网络地址' }}</pre>
  </div>
</div>
</DemoBox>

```ts
import { isNetworkUrl } from '@seevin/common'

// 检测网络图片
const imageUrl = 'https://example.com/image.jpg'
const isNetwork = isNetworkUrl(imageUrl) // true

// 检测本地路径
const localPath = '/assets/image.jpg'
const isLocal = isNetworkUrl(localPath) // false

// 检测 base64
const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'
const isBase64 = isNetworkUrl(base64) // false
```

**参数说明：**

- `url` (string): 要检测的 URL 字符串

**返回值：**

- `boolean`: 如果是网络地址返回 `true`，否则返回 `false`

### isImage

判断给定的 URL 是否为图片文件。

```ts
import { isImage } from '@seevin/common'

// 检测图片文件
const imageUrl = 'https://example.com/photo.jpg'
const isImg = isImage(imageUrl) // true

const videoUrl = 'https://example.com/video.mp4'
const isImg2 = isImage(videoUrl) // false
```

**参数说明：**

- `url` (string): 要检测的 URL 字符串

**返回值：**

- `boolean`: 如果是图片文件返回 `true`，否则返回 `false`

### isVideo

判断给定的 URL 是否为视频文件。

```ts
import { isVideo } from '@seevin/common'

// 检测视频文件
const videoUrl = 'https://example.com/video.mp4'
const isVid = isVideo(videoUrl) // true

const imageUrl = 'https://example.com/photo.jpg'
const isVid2 = isVideo(imageUrl) // false
```

**参数说明：**

- `url` (string): 要检测的 URL 字符串

**返回值：**

- `boolean`: 如果是视频文件返回 `true`，否则返回 `false`

### isHexColor

判断给定的字符串是否为有效的16进制颜色值。

```ts
import { isHexColor } from '@seevin/common'

// 检测16进制颜色
const color1 = '#ff0000'
const isColor1 = isHexColor(color1) // true

const color2 = '#f00'
const isColor2 = isHexColor(color2) // true

const color3 = 'red'
const isColor3 = isHexColor(color3) // false
```

**参数说明：**

- `str` (string): 要检测的颜色字符串

**返回值：**

- `boolean`: 如果是有效的16进制颜色返回 `true`，否则返回 `false`

## 类型判断工具

### is

通用类型判断函数，用于检测值的具体类型。

```ts
import { is } from '@seevin/common'

// 检测各种类型
const isStr = is('hello', 'String') // true
const isNum = is(123, 'Number') // true
const isArr = is([], 'Array') // true
const isObj = is({}, 'Object') // true
```

### 基础类型判断

```ts
import {
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isFunction,
  isDate,
  isPromise,
  isAsyncFunction
} from '@seevin/common'

// 字符串检测
const str = 'hello'
const isStr = isString(str) // true

// 数字检测
const num = 123
const isNum = isNumber(num) // true

// 布尔值检测
const bool = true
const isBool = isBoolean(bool) // true

// 数组检测
const arr = [1, 2, 3]
const isArr = isArray(arr) // true

// 对象检测
const obj = { name: 'John' }
const isObj = isObject(obj) // true

// 函数检测
const fn = () => {}
const isFn = isFunction(fn) // true

// 日期检测
const date = new Date()
const isDateVal = isDate(date) // true

// Promise 检测
const promise = Promise.resolve()
const isPromiseVal = isPromise(promise) // true

// 异步函数检测
const asyncFn = async () => {}
const isAsyncFn = isAsyncFunction(asyncFn) // true
```

### 空值判断

```ts
import { isDef, isUnDef, isNull, isNullOrUnDef } from '@seevin/common'

// 已定义检测
const defined = 'hello'
const isDefinedVal = isDef(defined) // true

// 未定义检测
const undefined = void 0
const isUndefinedVal = isUnDef(undefined) // true

// null 检测
const nullVal = null
const isNullVal = isNull(nullVal) // true

// null 或 undefined 检测
const empty1 = null
const empty2 = undefined
const isEmpty1 = isNullOrUnDef(empty1) // true
const isEmpty2 = isNullOrUnDef(empty2) // true
```

### DOM 元素判断

```ts
import { isElement, isWindow } from '@seevin/common'

// 元素检测
const div = document.createElement('div')
const isEl = isElement(div) // true

// Window 对象检测
const isWin = isWindow(window) // true (在浏览器环境中)
```

## 环境检测工具

### 客户端环境检测

```ts
import { isClient } from '@seevin/common'

// 检测是否在客户端环境
const inBrowser = isClient() // true (在浏览器中)
```

### 移动设备检测

```ts
import { isAndroid, isiOS } from '@seevin/common'

// 检测 Android 设备
const isAndroidDevice = isAndroid() // true (在 Android 设备上)

// 检测 iOS 设备
const isiOSDevice = isiOS() // true (在 iPhone/iPad 上)
```

### 应用环境检测

```ts
import { isDingTalk, isWeChat, isAlipay } from '@seevin/common'

// 检测钉钉环境
const inDingTalk = isDingTalk() // true (在钉钉中)

// 检测微信环境
const inWeChat = isWeChat() // true (在微信中)

// 检测支付宝环境
const inAlipay = isAlipay() // true (在支付宝中)
```

## UUID 生成工具

### generateUUID

生成标准的 UUID v4 字符串。

<DemoBox title="UUID 生成" description="生成标准的 UUID 字符串">
<div>
  <div class="mb-4">
    <TButton @click="generateUUID">生成 UUID</TButton>
  </div>
  <div v-if="generatedUUID" class="mb-3">
    <h4 class="text-base text-[color:var(--vp-c-text-1)] mb-2">生成的 UUID：</h4>
    <pre class="text-sm bg-[color:var(--vp-c-bg-alt)] p-3 rounded border font-mono">{{ generatedUUID }}</pre>
  </div>
</div>
</DemoBox>

```ts
import { generateUUID } from '@seevin/common'

// 生成 UUID
const id = generateUUID()
console.log(id) // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

// 用作组件 key
const items = data.map(item => ({
  ...item,
  key: generateUUID()
}))
```

**返回值：**

- `string`: 标准的 UUID v4 字符串，格式为 `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`

### generateShortUUID

生成简短的随机字符串，适用于临时标识符。

<DemoBox title="短 UUID 生成" description="生成简短的随机字符串">
<div>
  <div class="mb-4">
    <TButton @click="generateShortUUID">生成短 UUID</TButton>
  </div>
  <div v-if="generatedShortUUID" class="mb-3">
    <h4 class="text-base text-[color:var(--vp-c-text-1)] mb-2">生成的短 UUID：</h4>
    <pre class="text-sm bg-[color:var(--vp-c-bg-alt)] p-3 rounded border font-mono">{{ generatedShortUUID }}</pre>
  </div>
</div>
</DemoBox>

```ts
import { generateShortUUID } from '@seevin/common'

// 生成短 UUID
const shortId = generateShortUUID()
console.log(shortId) // 'a7b3c9d2'

// 用作临时文件名
const tempFileName = `temp_${generateShortUUID()}.json`

// 用作表单字段 ID
const fieldId = `field_${generateShortUUID()}`
```

**返回值：**

- `string`: 8位随机字符串，包含数字和小写字母

## 最佳实践

### Tree Shaking 优化

开发调试工具在生产环境会被自动移除：

```ts
// 开发环境：输出警告信息
// 生产环境：代码被移除，不会增加包体积
devWarn('MyComponent', '数据为空')
```

### 组合使用

```ts
import { devWarn, isNetworkUrl, generateUUID } from '@seevin/common'

function processImage(url: string) {
  if (!url) {
    devWarn('ImageProcessor', '图片 URL 不能为空')
    return null
  }

  if (!isNetworkUrl(url)) {
    devWarn('ImageProcessor', '只支持网络图片', { url })
    return null
  }

  return {
    id: generateUUID(),
    url,
    processed: true
  }
}
```

## API 参考

### 类型定义

```ts
// 开发调试
type DevWarnFn = (scope: string, message: string, details?: any) => void
type DevErrorFn = (scope: string, message: string, error?: Error | any) => void

// UUID 生成
type GenerateUUIDFn = () => string
type GenerateShortUUIDFn = () => string

// 类型判断
type IsFn<T = any> = (val: unknown) => val is T
type IsTypeFn = (val: unknown, type: string) => boolean

// URL 和媒体检测
type UrlValidatorFn = (url: string) => boolean
type ColorValidatorFn = (str: string) => boolean

// 环境检测
type EnvironmentDetectorFn = () => boolean
```

### 函数签名

```ts
// 开发调试
function devWarn(scope: string, message: string, details?: any): void
function devError(scope: string, message: string, error?: Error | any): void

// 类型判断
function is(val: unknown, type: string): boolean
function isFunction<T = (...args: any[]) => any>(val: unknown): val is T
function isDef<T = unknown>(val?: T): val is T
function isUnDef<T = unknown>(val?: T): val is T
function isObject(val: any): val is Record<any, any>
function isDate(val: unknown): val is Date
function isNumber(val: unknown): val is number
function isAsyncFunction<T = any>(val: unknown): val is Promise<T>
function isPromise<T = any>(val: unknown): val is Promise<T>
function isString(val: unknown): val is string
function isBoolean(val: unknown): val is boolean
function isArray(val: any): val is Array<any>
function isNull(val: unknown): val is null
function isNullOrUnDef(val: unknown): val is null | undefined
function isElement(val: unknown): val is Element
function isWindow(val: any): val is Window

// URL 和媒体检测
function isNetworkUrl(url: string): boolean
function isImage(url: string): boolean
function isVideo(url: string): boolean
function isHexColor(str: string): boolean

// 环境检测
function isClient(): boolean
function isDingTalk(): boolean
function isAndroid(): boolean
function isiOS(): boolean
function isWeChat(): boolean
function isAlipay(): boolean

// UUID 生成
function generateUUID(): string
function generateShortUUID(): string
```
