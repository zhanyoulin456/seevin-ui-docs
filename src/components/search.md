# ProSearch 搜索框组件

一个带有搜索按钮的输入框组件，支持自定义样式和事件处理。

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
      <SearchIcon />
      查询
    </TButton>
  </template>
</ProSearch>
</DemoBox>

```vue
<template>
  <ProSearch v-model="keyword" @search="handleSearch">
    <template #button>
      <TButton theme="primary" size="small">
        <SearchIcon />
        查询
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
| `v-model`     | `string`                         | `''`                       | 搜索关键字，支持双向绑定           |
| `size`        | `'small' \| 'medium' \| 'large'` | `'medium'`                 | 组件尺寸                           |
| `placeholder` | `string`                         | `'搜索'`                   | 输入框占位符                       |
| `width`       | `string \| number`               | `'240px'`                  | 组件宽度，数字会自动添加 `px` 单位 |
| `loading`     | `boolean`                        | `false`                    | 搜索按钮加载状态                   |
| `buttonText`  | `string`                         | `'搜索'`                   | 搜索按钮文案                       |
| `showButton`  | `boolean`                        | `true`                     | 是否显示搜索按钮                   |
| `background`  | `string`                         | `'var(--td-gray-color-1)'` | 搜索框背景色                       |

### Events

| 名称     | 类型                      | 说明                         |
| -------- | ------------------------- | ---------------------------- |
| `search` | `(value: string) => void` | 点击搜索按钮或按下回车时触发 |
| `clear`  | `() => void`              | 点击清空按钮时触发           |

### Slots

| 名称     | 参数 | 说明               |
| -------- | ---- | ------------------ |
| `button` | `-`  | 自定义搜索按钮内容 |

### 样式变量

| CSS 变量          | 默认值                   | 说明         |
| ----------------- | ------------------------ | ------------ |
| `--pro-search-bg` | `var(--td-gray-color-1)` | 搜索框背景色 |

## 样式类名

| 类名                  | 说明         |
| --------------------- | ------------ |
| `.pro-search`         | 搜索框根容器 |
| `.pro-search__input`  | 输入框容器   |
| `.pro-search__button` | 搜索按钮     |
