# ProSearch 搜索框组件

一个功能强大的搜索组件，基于 TDesign Vue Next 构建，支持多种尺寸、自定义样式、加载状态等特性。组件提供了灵活的配置选项和事件处理，适用于各种搜索场景。

<script setup>
import { ref } from 'vue'
import { Button as TButton } from 'tdesign-vue-next'
import { SearchIcon } from 'tdesign-icons-vue-next'

// 基础示例数据
const keyword1 = ref('')
const keyword2 = ref('')
const keyword3 = ref('')
const keyword4 = ref('')
const keyword5 = ref('')
const keyword6 = ref('')
const loading = ref(false)

// 事件处理
const handleSearch = (value) => {
  console.log('搜索内容:', value)
}

const handleClear = () => {
  console.log('清空搜索')
}

// 表格搜索示例
const tableSearchKeyword = ref('')

const handleTableSearch = (value) => {
  console.log('表格搜索:', value)
  // 这里可以触发表格数据刷新
}

const handleTableClear = () => {
  console.log('清空表格搜索')
}

const handleAsynProSearch = async (value) => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('搜索结果:', value)
  } finally {
    loading.value = false
  }
}
</script>

## 基础用法

最简单的搜索框用法。

<DemoBox title="基础用法" description="最简单的搜索框用法">
<div>
  <ProSearch v-model="keyword1" @search="handleSearch" />
  <p class="text-[color:var(--vp-c-text-2)] text-sm mt-3">
    搜索关键字: {{ keyword1 }}
  </p>
</div>
</DemoBox>

```vue
<template>
  <div>
    <ProSearch v-model="keyword" @search="handleSearch" />
    <p>搜索关键字: {{ keyword }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const keyword = ref('')

const handleSearch = value => {
  console.log('搜索内容:', value)
}
</script>
```

## 不同尺寸

提供 `small`、`medium`、`large` 三种尺寸。

<DemoBox title="不同尺寸" description="支持三种尺寸规格">
<div class="space-y-4">
  <ProSearch v-model="keyword2" size="small" placeholder="小尺寸搜索框" />
  <ProSearch v-model="keyword3" size="medium" placeholder="中尺寸搜索框" />
  <ProSearch v-model="keyword4" size="large" placeholder="大尺寸搜索框" />
</div>
</DemoBox>

```vue
<template>
  <div class="space-y-4">
    <ProSearch v-model="keyword1" size="small" placeholder="小尺寸搜索框" />
    <ProSearch v-model="keyword2" size="medium" placeholder="中尺寸搜索框" />
    <ProSearch v-model="keyword3" size="large" placeholder="大尺寸搜索框" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const keyword1 = ref('')
const keyword2 = ref('')
const keyword3 = ref('')
</script>
```

## 自定义宽度

通过 `width` 属性设置搜索框宽度。

<DemoBox title="自定义宽度" description="支持数字和字符串两种宽度设置">
<div class="space-y-4">
  <ProSearch v-model="keyword5" width="200px" placeholder="200px 宽度" />
  <ProSearch v-model="keyword6" :width="300" placeholder="300px 宽度" />
  <ProSearch v-model="keyword1" width="50%" placeholder="50% 宽度" />
</div>
</DemoBox>

```vue
<template>
  <div class="space-y-4">
    <ProSearch v-model="keyword1" width="200px" placeholder="200px 宽度" />
    <ProSearch v-model="keyword2" :width="300" placeholder="300px 宽度" />
    <ProSearch v-model="keyword3" width="50%" placeholder="50% 宽度" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const keyword1 = ref('')
const keyword2 = ref('')
const keyword3 = ref('')
</script>
```

## 隐藏搜索按钮

设置 `showButton` 为 `false` 可以隐藏搜索按钮。

<DemoBox title="隐藏搜索按钮" description="通过回车键触发搜索">
<ProSearch 
  v-model="keyword2" 
  :show-button="false"
  placeholder="按回车搜索"
  @search="handleSearch"
/>
</DemoBox>

```vue
<template>
  <ProSearch v-model="keyword" :show-button="false" placeholder="按回车搜索" @search="handleSearch" />
</template>

<script setup>
import { ref } from 'vue'

const keyword = ref('')

const handleSearch = value => {
  console.log('搜索内容:', value)
}
</script>
```

## 加载状态

搜索时显示加载状态。

<DemoBox title="加载状态" description="模拟异步搜索过程">
<ProSearch 
  v-model="keyword3" 
  :loading="loading"
  @search="handleAsynProSearch"
  @clear="handleClear"
/>
</DemoBox>

```vue
<template>
  <ProSearch v-model="keyword" :loading="loading" @search="handleSearch" @clear="handleClear" />
</template>

<script setup>
import { ref } from 'vue'

const keyword = ref('')
const loading = ref(false)

const handleSearch = async value => {
  loading.value = true
  try {
    // 模拟搜索请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('搜索结果:', value)
  } finally {
    loading.value = false
  }
}

const handleClear = () => {
  console.log('清空搜索')
}
</script>
```

## 自定义按钮

通过 `button` 插槽可以自定义搜索按钮。

<DemoBox title="自定义按钮" description="使用插槽自定义搜索按钮">
<ProSearch v-model="keyword4" @search="handleSearch">
  <template #button>
    <TButton theme="primary" size="small">
      <template #icon><SearchIcon /></template>
      搜索
    </TButton>
  </template>
</ProSearch>
</DemoBox>

```vue
<template>
  <ProSearch v-model="keyword" @search="handleSearch">
    <template #button>
      <TButton theme="primary" size="small">
        <template #icon><SearchIcon /></template>
        搜索
      </TButton>
    </template>
  </ProSearch>
</template>

<script setup>
import { ref } from 'vue'

const keyword = ref('')

const handleSearch = value => {
  console.log('搜索内容:', value)
}
</script>
```

## 自定义样式

通过 `background` 属性自定义背景色。

<DemoBox title="自定义样式" description="自定义背景色和样式">
<div class="space-y-4">
  <ProSearch 
    v-model="keyword5" 
    background="#f0f8ff"
    placeholder="自定义背景色"
  />
  <ProSearch 
    v-model="keyword6" 
    background="var(--td-brand-color-1)"
    placeholder="使用主题色变量"
  />
</div>
</DemoBox>

```vue
<template>
  <div class="space-y-4">
    <ProSearch v-model="keyword1" background="#f0f8ff" placeholder="自定义背景色" />
    <ProSearch v-model="keyword2" background="var(--td-brand-color-1)" placeholder="使用主题色变量" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const keyword1 = ref('')
const keyword2 = ref('')
</script>
```

## API

### Props

| 名称          | 类型                             | 默认值                     | 说明                               |
| ------------- | -------------------------------- | -------------------------- | ---------------------------------- |
| `modelValue`  | `string`                         | `''`                       | 搜索关键字，支持 v-model 双向绑定  |
| `size`        | `'small' \| 'medium' \| 'large'` | `'medium'`                 | 组件尺寸                           |
| `placeholder` | `string`                         | `'搜索'`                   | 输入框占位符                       |
| `width`       | `string \| number`               | `'240px'`                  | 组件宽度，数字会自动添加 `px` 单位 |
| `loading`     | `boolean`                        | `false`                    | 搜索按钮加载状态                   |
| `buttonText`  | `string`                         | `'搜索'`                   | 搜索按钮文案                       |
| `showButton`  | `boolean`                        | `true`                     | 是否显示搜索按钮                   |
| `background`  | `string`                         | `'var(--td-gray-color-1)'` | 搜索框背景色                       |

### Events

| 名称                | 类型                      | 说明                         |
| ------------------- | ------------------------- | ---------------------------- |
| `search`            | `(value: string) => void` | 点击搜索按钮或按下回车时触发 |
| `clear`             | `() => void`              | 点击清空按钮时触发           |
| `update:modelValue` | `(value: string) => void` | v-model 双向绑定更新事件     |

### Slots

| 名称     | 参数 | 说明               |
| -------- | ---- | ------------------ |
| `button` | `-`  | 自定义搜索按钮内容 |

### 样式变量

| CSS 变量          | 默认值                   | 说明         |
| ----------------- | ------------------------ | ------------ |
| `--pro-search-bg` | `var(--td-gray-color-1)` | 搜索框背景色 |

### 样式类名

| 类名                  | 说明         |
| --------------------- | ------------ |
| `.pro-search`         | 搜索框根容器 |
| `.pro-search__input`  | 输入框容器   |
| `.pro-search__button` | 搜索按钮     |

### 类型定义

```typescript
// 组件 Props 接口
export interface ProSearchProps {
  /** @description 组件尺寸 */
  size?: 'small' | 'medium' | 'large'
  /** @description 占位符 */
  placeholder?: string
  /** @description 组件宽度 */
  width?: string | number
  /** @description 搜索按钮加载状态 */
  loading?: boolean
  /** @description 搜索按钮文案 */
  buttonText?: string
  /** @description 是否显示搜索按钮 */
  showButton?: boolean
  /** @description 背景色 */
  background?: string
  /** @description 搜索关键字，支持 v-model 双向绑定 */
  modelValue?: string
}

// 组件事件接口
export interface ProSearchEmits {
  /** @description 搜索事件 */
  search: [value: string]
  /** @description 清空事件 */
  clear: []
  /** @description v-model 更新事件 */
  'update:modelValue': [value: string]
}

// 组件插槽接口
export interface ProSearchSlots {
  /** @description 自定义按钮内容 */
  button?: () => VNode
}
```

## 特性说明

- **响应式设计**：支持多种尺寸和自适应宽度
- **加载状态**：内置加载状态显示，提升用户体验
- **事件处理**：支持搜索和清空事件，满足不同交互需求
- **自定义样式**：支持背景色、宽度等样式定制
- **插槽支持**：提供按钮插槽，支持完全自定义搜索按钮
- **键盘交互**：支持回车键快速搜索
- **无障碍支持**：良好的键盘导航和屏幕阅读器支持

## 使用注意事项

1. **v-model 绑定**：使用 `v-model` 进行双向数据绑定
2. **宽度设置**：`width` 属性支持数字（自动添加px）和字符串（支持百分比、vw等单位）
3. **事件处理**：`search` 事件在点击搜索按钮或按下回车时触发
4. **样式定制**：通过 CSS 变量 `--pro-search-bg` 可以全局定制背景色
5. **加载状态**：设置 `loading` 为 `true` 时，搜索按钮会显示加载动画
6. **自定义按钮**：使用 `button` 插槽时，需要自行处理点击事件

_继承 TDesign Input 组件的所有特性，详见 [TDesign Input API](https://tdesign.tencent.com/vue-next/components/input)_
