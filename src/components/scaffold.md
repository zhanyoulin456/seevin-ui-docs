# ProScaffold 页面脚手架组件

一个页面布局脚手架组件，用于快速构建包含标准头部、内容和底部的页面布局，支持加载状态、返回按钮等常用功能。

<script setup>
import { ref } from 'vue'
import { Button as TButton, Input as TInput, Form as TForm, FormItem as TFormItem } from 'tdesign-vue-next'

// 基础示例数据
const loading1 = ref(false)
const loading2 = ref(false)

// 表单数据
const formData1 = ref({
  username: 'John',
  email: 'john@example.com'
})

// 事件处理方法
const handleCancel = () => {
  console.log('取消操作')
}

const handleSave = () => {
  console.log('保存数据:', formData1.value)
}

const handleCustomBack = () => {
  if (confirm('确定要离开当前页面吗？')) {
    console.log('自定义返回逻辑')
  }
}

const toggleLoading = () => {
  loading2.value = !loading2.value
}

const refreshData = async () => {
  loading2.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('数据刷新完成')
  } finally {
    loading2.value = false
  }
}

const data = ref([
  { id: 1, name: '项目 A' },
  { id: 2, name: '项目 B' },
  { id: 3, name: '项目 C' }
])
</script>

## 基础用法

最简单的页面脚手架用法。

<DemoBox title="基础用法" description="最简单的页面脚手架布局">
  <ProScaffold>
    <div class="text-center p-5">
      <h2 class="text-lg text-[color:var(--vp-c-text-1)] mt-0 mb-3 mx-0">页面内容</h2>
      <p class="text-[color:var(--vp-c-text-2)] m-0">这里是页面的主要内容区域。</p>
    </div>
  </ProScaffold>
</DemoBox>

```vue
<template>
  <ProScaffold>
    <div>
      <h2>页面内容</h2>
      <p>这里是页面的主要内容区域。</p>
    </div>
  </ProScaffold>
</template>

<script setup>
// 无需额外导入
</script>
```

## 带头部和底部

使用插槽添加头部和底部内容。

<DemoBox title="带头部和底部" description="完整的页面布局结构">
  <ProScaffold>
    <template #header>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">用户管理</h1>
        <TButton theme="primary">新增用户</TButton>
      </div>
    </template>
    <div class="space-y-4">
      <p>这里是页面的主要内容。</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 border rounded">卡片 1</div>
        <div class="p-4 border rounded">卡片 2</div>
        <div class="p-4 border rounded">卡片 3</div>
      </div>
    </div>
    <template #footer>
      <TButton variant="outline">取消</TButton>
      <TButton theme="primary">保存</TButton>
    </template>
  </ProScaffold>
</DemoBox>

```vue
<template>
  <ProScaffold>
    <template #header>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">用户管理</h1>
        <TButton theme="primary">新增用户</TButton>
      </div>
    </template>

    <div class="space-y-4">
      <p>这里是页面的主要内容。</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 border rounded">卡片 1</div>
        <div class="p-4 border rounded">卡片 2</div>
        <div class="p-4 border rounded">卡片 3</div>
      </div>
    </div>

    <template #footer>
      <TButton variant="outline">取消</TButton>
      <TButton theme="primary">保存</TButton>
    </template>
  </ProScaffold>
</template>

<script setup>
// 组件自动导入
</script>
```

## 显示返回按钮

设置 `show-back-button` 显示返回按钮。

<DemoBox title="显示返回按钮" description="在左上角显示返回按钮">
  <ProScaffold show-back-button>
    <template #header>
      <h1 class="text-xl text-[color:var(--vp-c-text-1)] m-0">编辑用户信息</h1>
    </template>
    <div>
      <TForm :data="formData1">
        <TFormItem label="用户名" name="username">
          <TInput v-model="formData1.username" />
        </TFormItem>
        <TFormItem label="邮箱" name="email">
          <TInput v-model="formData1.email" />
        </TFormItem>
      </TForm>
    </div>
    <template #footer>
      <TButton variant="outline" @click="handleCancel">取消</TButton>
      <TButton theme="primary" @click="handleSave">保存</TButton>
    </template>
  </ProScaffold>
</DemoBox>

```vue
<template>
  <ProScaffold show-back-button>
    <template #header>
      <h1>编辑用户信息</h1>
    </template>

    <div>
      <TForm :data="formData">
        <TFormItem label="用户名" name="username">
          <TInput v-model="formData.username" />
        </TFormItem>
        <TFormItem label="邮箱" name="email">
          <TInput v-model="formData.email" />
        </TFormItem>
      </TForm>
    </div>

    <template #footer>
      <TButton variant="outline" @click="handleCancel">取消</TButton>
      <TButton theme="primary" @click="handleSave">保存</TButton>
    </template>
  </ProScaffold>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  username: '',
  email: ''
})

const handleCancel = () => {
  router.back()
}

const handleSave = () => {
  console.log('保存数据:', formData.value)
}
</script>
```

## 自定义返回按钮

通过 `backButton` 插槽自定义返回按钮。

<DemoBox title="自定义返回按钮" description="使用插槽自定义返回按钮">
  <ProScaffold show-back-button>
    <template #backButton>
      <TButton
        shape="round"
        variant="outline"
        size="small"
        @click="handleCustomBack"
      >
        返回列表
      </TButton>
    </template>
    <template #header>
      <h1 class="text-xl text-[color:var(--vp-c-text-1)] m-0">详情页面</h1>
    </template>
    <div>
      <p>这是一个详情页面，有自定义的返回按钮。</p>
    </div>
  </ProScaffold>
</DemoBox>

```vue
<template>
  <ProScaffold show-back-button>
    <template #backButton>
      <TButton shape="round" variant="outline" size="small" @click="handleCustomBack">
        <ChevronLeftIcon />
        返回列表
      </TButton>
    </template>

    <template #header>
      <h1>详情页面</h1>
    </template>

    <div>
      <p>这是一个详情页面，有自定义的返回按钮。</p>
    </div>
  </ProScaffold>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleCustomBack = () => {
  // 自定义返回逻辑
  if (confirm('确定要离开当前页面吗？')) {
    router.push('/list')
  }
}
</script>
```

## 设置内容宽度

通过 `width` 属性控制内容区域宽度。

<DemoBox title="设置内容宽度" description="控制内容区域的宽度">

<div class="space-y-6">
  <div>
    <h4 class="text-base text-[color:var(--vp-c-text-1)] mb-3">固定像素宽度</h4>
    <div class="h-[180px] border border-[color:var(--vp-c-border)] overflow-hidden rounded-lg border-solid">
      <ProScaffold width="600px">
        <template #header>
          <h2 class="text-base m-0">600px 宽度</h2>
        </template>
        <div class="bg-[color:var(--vp-c-bg-alt)] p-4">
          内容区域宽度为 600px
        </div>
      </ProScaffold>
    </div>
  </div>
  <div>
    <h4 class="text-base text-[color:var(--vp-c-text-1)] mb-3">百分比宽度</h4>
    <div class="h-[180px] border border-[color:var(--vp-c-border)] overflow-hidden rounded-lg border-solid">
      <ProScaffold width="80%">
        <template #header>
          <h2 class="text-base m-0">80% 宽度</h2>
        </template>
        <div class="bg-[color:var(--vp-c-bg-alt)] p-4">
          内容区域宽度为父容器的 80%
        </div>
      </ProScaffold>
    </div>
  </div>
</div>
</DemoBox>

```vue
<template>
  <div class="space-y-8">
    <div>
      <h3>固定像素宽度</h3>
      <ProScaffold width="800px">
        <template #header>
          <h2>800px 宽度</h2>
        </template>
        <div class="bg-gray-100 p-4">内容区域宽度为 800px</div>
      </ProScaffold>
    </div>

    <div>
      <h3>数字宽度（自动添加px）</h3>
      <ProScaffold :width="600">
        <template #header>
          <h2>600px 宽度</h2>
        </template>
        <div class="bg-blue-100 p-4">内容区域宽度为 600px</div>
      </ProScaffold>
    </div>

    <div>
      <h3>百分比宽度</h3>
      <ProScaffold width="80%">
        <template #header>
          <h2>80% 宽度</h2>
        </template>
        <div class="bg-green-100 p-4">内容区域宽度为父容器的 80%</div>
      </ProScaffold>
    </div>
  </div>
</template>

<script setup>
// 无需额外代码
</script>
```

## 加载状态

使用 `loading` 属性显示加载状态。

<DemoBox title="加载状态" description="显示页面加载状态">
<div>
  <div class="mb-4">
    <TButton @click="toggleLoading">
      {{ loading2 ? '停止加载' : '开始加载' }}
    </TButton>
  </div>
  <div class="h-[280px] border border-[color:var(--vp-c-border)] overflow-hidden rounded-lg border-solid">
    <ProScaffold :loading="loading2" show-back-button>
      <template #header>
        <h1 class="text-lg m-0">数据加载页面</h1>
      </template>
      <div v-if="!loading2" class="p-4">
        <h3>数据已加载完成</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div v-for="item in data" :key="item.id" class="p-4 border rounded">
            {{ item.name }}
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <p>数据加载中...</p>
      </div>
      <template #footer>
        <TButton :disabled="loading2" @click="refreshData">
          刷新数据
        </TButton>
      </template>
    </ProScaffold>
  </div>
</div>
</DemoBox>

```vue
<template>
  <div>
    <div class="mb-4">
      <TButton @click="toggleLoading">
        {{ loading ? '停止加载' : '开始加载' }}
      </TButton>
    </div>

    <ProScaffold :loading="loading" show-back-button>
      <template #header>
        <h1>数据加载页面</h1>
      </template>

      <div v-if="!loading">
        <h3>数据已加载完成</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div v-for="item in data" :key="item.id" class="p-4 border rounded">
            {{ item.name }}
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <p>数据加载中...</p>
      </div>

      <template #footer>
        <TButton :disabled="loading" @click="refreshData"> 刷新数据 </TButton>
      </template>
    </ProScaffold>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)

const data = ref([
  { id: 1, name: '项目 A' },
  { id: 2, name: '项目 B' },
  { id: 3, name: '项目 C' }
])

const toggleLoading = () => {
  loading.value = !loading.value
}

const refreshData = async () => {
  loading.value = true
  try {
    // 模拟数据请求
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('数据刷新完成')
  } finally {
    loading.value = false
  }
}
</script>
```

## API

### Props

| 名称             | 类型               | 默认值   | 说明                                        |
| ---------------- | ------------------ | -------- | ------------------------------------------- |
| `loading`        | `boolean`          | `false`  | 是否显示加载状态，使用 `v-loading` 指令实现 |
| `showBackButton` | `boolean`          | `false`  | 是否显示返回按钮                            |
| `width`          | `string \| number` | `'100%'` | 内容区域的宽度，数字会自动添加 `px` 单位    |

### Events

| 名称   | 类型         | 说明                                                                                                                                                                                     |
| ------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `back` | `() => void` | 返回按钮点击时触发。如果 `showBackButton` 为 `true` 且未提供 `backButton` 插槽，则默认行为是调用 `router.back()`。如果提供了 `backButton` 插槽，则此事件不会触发，需要自行处理返回逻辑。 |

### Slots

| 名称         | 参数 | 说明                           |
| ------------ | ---- | ------------------------------ |
| `default`    | `-`  | 页面主要内容区域               |
| `header`     | `-`  | 页面头部内容                   |
| `footer`     | `-`  | 页面底部内容，通常放置操作按钮 |
| `backButton` | `-`  | 自定义返回按钮内容             |

### Methods

当前版本无暴露的方法。

## 样式类名

| 类名                              | 说明                           |
| --------------------------------- | ------------------------------ |
| `.pro-scaffold`                   | 脚手架根容器                   |
| `.pro-scaffold__back-button`      | 返回按钮容器                   |
| `.pro-scaffold__header`           | 头部区域容器                   |
| `.pro-scaffold__content__wrapper` | 内容区域包装器，提供滚动功能   |
| `.pro-scaffold__content`          | 内容区域，居中显示并可设置宽度 |
| `.pro-scaffold__footer`           | 底部区域容器，包含按钮样式     |
