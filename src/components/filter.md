# ProFilter 筛选组件

一个功能强大的筛选组件，支持多种筛选类型，包括输入框、下拉选择、日期选择、树形选择等，
并提供筛选结果展示。

<script setup>
import { ref, h } from 'vue'
import { Button as TButton } from 'tdesign-vue-next'

// 基础示例数据
const searchResult = ref({})
const filterConditions1 = ref([
  {
    title: '姓名',
    colKey: 'name',
    type: 'input',
    value: ''
  },
  {
    title: '状态',
    colKey: 'status',
    type: 'select',
    value: '',
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ]
  }
])

// 输入框筛选
const inputConditions = ref([
  {
    title: '用户名',
    colKey: 'username',
    type: 'input',
    value: '',
    width: 200
  },
  {
    title: '邮箱',
    colKey: 'email',
    type: 'input',
    value: '',
    width: '300px',
    componentProps: {
      maxlength: 50
    }
  }
])

// 下拉选择筛选
const selectConditions = ref([
  {
    title: '部门',
    colKey: 'department',
    type: 'select',
    value: '',
    options: [
      { label: '技术部', value: 'tech' },
      { label: '产品部', value: 'product' },
      { label: '运营部', value: 'operation' }
    ]
  },
  {
    title: '技能',
    colKey: 'skills',
    type: 'multipleSelect',
    value: [],
    options: [
      { label: 'Vue.js', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Node.js', value: 'node' },
      { label: 'Python', value: 'python' }
    ]
  }
])

// 日期筛选
const dateConditions = ref([
  {
    title: '创建日期',
    colKey: 'createDate',
    type: 'date',
    value: '',
    componentProps: {
      format: 'YYYY-MM-DD'
    }
  },
  {
    title: '时间范围',
    colKey: 'dateRange',
    type: 'dateRange',
    value: [],
    width: 280,
    componentProps: {
      format: 'YYYY-MM-DD',
      separator: ' 至 '
    }
  }
])

// 树形选择筛选
const treeConditions = ref([
  {
    title: '组织架构',
    colKey: 'orgId',
    type: 'treeSelect',
    value: '',
    width: 250,
    treeOptions: [
      {
        label: '总公司',
        value: '1',
        children: [
          {
            label: '技术部',
            value: '11',
            children: [
              { label: '前端组', value: '111' },
              { label: '后端组', value: '112' }
            ]
          },
          {
            label: '产品部',
            value: '12',
            children: [
              { label: '产品组', value: '121' },

              { label: '设计组', value: '122' }
            ]
          }
        ]
      }
    ],
    componentProps: {
      keys: {
        label: 'label',
        value: 'value',
        children: 'children'
      }
    }
  }
])

// 筛选结果展示
const filterRef = ref()
const resultConditions = ref([
  {
    title: '姓名',
    colKey: 'name',
    type: 'input',
    value: 'John',
    resultTitle: '用户姓名'
  },
  {
    title: '状态',
    colKey: 'status',
    type: 'select',
    value: 1,
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ],
    closable: false
  },
  {
    title: '标签',
    colKey: 'tags',
    type: 'multipleSelect',
    value: ['vue', 'react'],
    options: [
      { label: 'Vue.js', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Angular', value: 'angular' }
    ]
  }
])

// 事件处理
const handleSearch = (params) => {
  searchResult.value = params
  console.log('筛选参数:', params)
}

const handleClear = () => {
  searchResult.value = {}
  console.log('清空筛选')
}

const handleInputSearch = (params) => {
  console.log('输入框搜索:', params)
}

const handleSelectSearch = (params) => {
  console.log('下拉选择搜索:', params)
}

const handleDateSearch = (params) => {
  console.log('日期搜索:', params)
}

const handleTreeSearch = (params) => {
  console.log('树形搜索:', params)
}

const handleResultSearch = (params) => {
  console.log('结果搜索:', params)
}

const getFilterData = () => {
  const result = filterRef.value?.getFilterResult()
  console.log('当前筛选数据:', result)
}

const clearAllFilter = () => {
  resultConditions.value.forEach(item => {
    item.value = Array.isArray(item.value) ? [] : ''
  })
}

const setFilterData = () => {
  filterRef.value?.setFilterValues({
    name: 'John',
    status: 1,
    tags: ['vue']
  })
}

// 添加设置筛选值的方法
const setPresetFilter1 = () => {
  filterRef.value?.setFilterValues({
    name: 'John',
    status: 1
  })
}

const setPresetFilter2 = () => {
  filterRef.value?.setFilterValues({
    name: 'Alice',
    status: 0,
    tags: ['vue', 'react']
  })
}

const clearFilter = () => {
  filterRef.value?.setFilterValues({})
}
</script>

## 基础用法

最简单的筛选组件用法。

<DemoBox title="基础用法" description="支持输入框和下拉选择筛选">
<div>
  <ProFilter
    :conditions="filterConditions1"
    @search="handleSearch"
    @clear="handleClear"
  />
  <div style="margin-top: 16px; padding: 12px; background: var(--vp-c-bg-alt); border-radius: 6px; font-size: 14px;">
    <strong>筛选结果：</strong>
    <pre style="margin-top: 8px; font-size: 13px;">{{ JSON.stringify(searchResult, null, 2) }}</pre>
  </div>
</div>
</DemoBox>

```vue
<template>
  <div>
    <ProFilter :conditions="filterConditions" @search="handleSearch" @clear="handleClear" />
    <pre>{{ JSON.stringify(searchResult, null, 2) }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchResult = ref({})

const filterConditions = ref([
  {
    title: '姓名',
    colKey: 'name',
    type: 'input',
    value: ''
  },
  {
    title: '状态',
    colKey: 'status',
    type: 'select',
    value: '',
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ]
  }
])

const handleSearch = params => {
  searchResult.value = params
  console.log('筛选参数:', params)
}

const handleClear = () => {
  searchResult.value = {}
  console.log('清空筛选')
}
</script>
```

## 输入框筛选

使用 `input` 类型创建文本输入框筛选。

<DemoBox title="输入框筛选" description="支持不同宽度和组件属性透传">
<ProFilter :conditions="inputConditions" @search="handleInputSearch" />
</DemoBox>

```vue
<template>
  <ProFilter :conditions="conditions" @search="handleSearch" />
</template>

<script setup>
import { ref } from 'vue'

const conditions = ref([
  {
    title: '用户名',
    colKey: 'username',
    type: 'input',
    value: '',
    width: 200
  },
  {
    title: '邮箱',
    colKey: 'email',
    type: 'input',
    value: '',
    width: '300px',
    componentProps: {
      maxlength: 50
    }
  }
])

const handleSearch = params => {
  console.log('搜索参数:', params)
}
</script>
```

## 下拉选择筛选

使用 `select` 和 `multipleSelect` 类型创建下拉选择筛选。

<DemoBox title="下拉选择筛选" description="支持单选和多选模式">
<ProFilter :conditions="selectConditions" @search="handleSelectSearch" />
</DemoBox>

```vue
<template>
  <ProFilter :conditions="conditions" @search="handleSearch" />
</template>

<script setup>
import { ref } from 'vue'

const conditions = ref([
  {
    title: '部门',
    colKey: 'department',
    type: 'select',
    value: '',
    options: [
      { label: '技术部', value: 'tech' },
      { label: '产品部', value: 'product' },
      { label: '运营部', value: 'operation' }
    ]
  },
  {
    title: '技能',
    colKey: 'skills',
    type: 'multipleSelect',
    value: [],
    options: [
      { label: 'Vue.js', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Node.js', value: 'node' },
      { label: 'Python', value: 'python' }
    ]
  }
])

const handleSearch = params => {
  console.log('搜索参数:', params)
}
</script>
```

## 日期筛选

使用 `date` 和 `dateRange` 类型创建日期筛选。

<DemoBox title="日期筛选" description="支持单日期和日期范围选择">
<ProFilter :conditions="dateConditions" @search="handleDateSearch" />
</DemoBox>

```vue
<template>
  <ProFilter :conditions="conditions" @search="handleSearch" />
</template>

<script setup>
import { ref } from 'vue'

const conditions = ref([
  {
    title: '创建日期',
    colKey: 'createDate',
    type: 'date',
    value: '',
    componentProps: {
      format: 'YYYY-MM-DD'
    }
  },
  {
    title: '时间范围',
    colKey: 'dateRange',
    type: 'dateRange',
    value: [],
    width: 280,
    componentProps: {
      format: 'YYYY-MM-DD',
      separator: ' 至 '
    }
  }
])

const handleSearch = params => {
  console.log('搜索参数:', params)
}
</script>
```

## 树形选择筛选

使用 `treeSelect` 类型创建树形选择筛选。

<DemoBox title="树形选择筛选" description="支持组织架构等层级数据筛选">
<ProFilter :conditions="treeConditions" @search="handleTreeSearch" />
</DemoBox>

```vue
<template>
  <ProFilter :conditions="conditions" @search="handleSearch" />
</template>

<script setup>
import { ref } from 'vue'

const conditions = ref([
  {
    title: '组织架构',
    colKey: 'orgId',
    type: 'treeSelect',
    value: '',
    width: 250,
    treeOptions: [
      {
        label: '总公司',
        value: '1',
        children: [
          {
            label: '技术部',
            value: '11',
            children: [
              { label: '前端组', value: '111' },
              { label: '后端组', value: '112' }
            ]
          },
          {
            label: '产品部',
            value: '12',
            children: [
              { label: '产品组', value: '121' },
              { label: '设计组', value: '122' }
            ]
          }
        ]
      }
    ],
    componentProps: {
      keys: {
        label: 'label',
        value: 'value',
        children: 'children'
      }
    }
  }
])

const handleSearch = params => {
  console.log('搜索参数:', params)
}
</script>
```

## 筛选结果展示

筛选组件会自动展示已选择的筛选条件，支持单独删除。

<DemoBox title="筛选结果展示" description="自动展示筛选条件，支持单独删除和批量操作">
<div>
  <ProFilter
    ref="filterRef"
    :conditions="resultConditions"
    @search="handleResultSearch"
    @clear="handleClear"
  />

  <div style="margin-top: 16px; display: flex; gap: 12px;">
    <TButton @click="getFilterData">获取筛选数据</TButton>
    <TButton @click="clearAllFilter">清空所有筛选</TButton>
    <TButton @click="setFilterData">设置筛选数据</TButton>
  </div>
</div>
</DemoBox>

```vue
<template>
  <div>
    <ProFilter ref="filterRef" :conditions="conditions" @search="handleSearch" @clear="handleClear" />

    <div class="mt-4">
      <TButton @click="getFilterData">获取筛选数据</TButton>
      <TButton @click="clearAllFilter">清空所有筛选</TButton>
      <TButton @click="setFilterData">设置筛选数据</TButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const filterRef = ref()

const conditions = ref([
  {
    title: '姓名',
    colKey: 'name',
    type: 'input',
    value: 'John',
    resultTitle: '用户姓名' // 自定义结果展示标题
  },
  {
    title: '状态',
    colKey: 'status',
    type: 'select',
    value: 1,
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ],
    closable: false // 不可删除
  },
  {
    title: '标签',
    colKey: 'tags',
    type: 'multipleSelect',
    value: ['vue', 'react'],
    options: [
      { label: 'Vue.js', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Angular', value: 'angular' }
    ]
  }
])

const handleSearch = params => {
  console.log('搜索参数:', params)
}

const handleClear = () => {
  console.log('清空筛选')
}

const getFilterData = () => {
  const result = filterRef.value?.getFilterResult()
  console.log('当前筛选数据:', result)
}

const clearAllFilter = () => {
  conditions.value.forEach(item => {
    item.value = Array.isArray(item.value) ? [] : ''
  })
}

const setFilterData = () => {
  filterRef.value?.setFilterValues({
    name: 'Alice',
    status: 1,
    tags: ['vue']
  })
}
</script>
```

## 设置筛选值

使用 `setFilterValues
` 方法可以程序化地设置筛选条件的值。

<DemoBox title="设置筛选值" description="程序化设置筛选条件">
<div>
  <ProFilter
    ref="filterRef"
    :conditions="resultConditions"
    @search="handleResultSearch"
    @clear="handleClear"
  />

  <div style="margin-top: 16px; display: flex; gap: 12px;">
    <TButton @click="setPresetFilter1">设置预设1</TButton>
    <TButton @click="setPresetFilter2">设置预设2</TButton>
    <TButton @click="clearFilter">清空筛选</TButton>
  </div>
</div>
</DemoBox>

```vue
<template>
  <div>
    <ProFilter ref="filterRef" :conditions="conditions" @search="handleSearch" @clear="handleClear" />

    <div class="mt-4">
      <TButton @click="setPresetFilter1">设置预设1</TButton>
      <TButton @click="setPresetFilter2">设置预设2</TButton>
      <TButton @click="clearFilter">清空筛选</TButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const filterRef = ref()

const conditions = ref([
  {
    title: '姓名',
    colKey: 'name',
    type: 'input',
    value: ''
  },
  {
    title: '状态',
    colKey: 'status',
    type: 'select',
    value: '',
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ]
  },
  {
    title: '标签',
    colKey: 'tags',
    type: 'multipleSelect',
    value: [],
    options: [
      { label: 'Vue.js', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Angular', value: 'angular' }
    ]
  }
])

const handleSearch = params => {
  console.log('搜索参数:', params)
}

const handleClear = () => {
  console.log('清空筛选')
}

const setPresetFilter1 = () => {
  filterRef.value?.setFilterValues({
    name: 'John',
    status: 1
  })
}

const setPresetFilter2 = () => {
  filterRef.value?.setFilterValues({
    name: 'Alice',
    status: 0,
    tags: ['vue', 'react']
  })
}

const clearFilter = () => {
  filterRef.value?.setFilterValues({})
}
</script>
```

## API

### Props

| 名称         | 类型           | 默认值  | 说明             |
| ------------ | -------------- | ------- | ---------------- |
| `conditions` | `FilterItem[]` | `[]`    | 筛选条件配置数组 |
| `showResult` | `boolean`      | `true`  | 是否展示筛选结果 |
| `loading`    | `boolean`      | `false` | 加载状态         |

### Events

| 名称     | 类型                                    | 说明                             |
| -------- | --------------------------------------- | -------------------------------- |
| `search` | `(params: Record<string, any>) => void` | 点击查询按钮时触发，返回筛选参数 |
| `clear`  | `() => void`                            | 点击清空按钮时触发               |

### Methods

| 名称              | 类型                                    | 说明             |
| ----------------- | --------------------------------------- | ---------------- |
| `getFilterResult` | `() => Record<string, any>`             | 获取当前筛选结果 |
| `setFilterValues` | `(values: Record<string, any>) => void` | 设置筛选条件的值 |

### FilterItem 配置

| 名称             | 类型                                       | 默认值  | 说明                              |
| ---------------- | ------------------------------------------ | ------- | --------------------------------- |
| `title`          | `string`                                   | -       | 筛选项标题，用于显示和placeholder |
| `colKey`         | `string`                                   | -       | 字段键名，用于筛选结果的key       |
| `type`           | `FilterComponentType`                      | -       | 筛选组件类型                      |
| `value`          | `string \| number \| (string \| number)[]` | -       | 筛选值，支持双向绑定              |
| `width`          | `string \| number`                         | -       | 组件宽度，数字会自动添加px单位    |
| `options`        | `SelectOption[]`                           | -       | 下拉选择的选项数据                |
| `treeOptions`    | `any[]`                                    | -       | 树形选择的数据                    |
| `closable`       | `boolean`                                  | `true`  | 筛选结果标签是否可关闭删除        |
| `resultTitle`    | `string`                                   | -       | 筛选结果展示标题，优先级高于title |
| `disabled`       | `boolean`                                  | `false` | 是否禁用                          |
| `componentProps` | `any`                                      | -       | 透传给筛选组件的属性              |
| `render`         | `(item: FilterItem) => VNode`              | -       | 自定义渲染函数                    |

### FilterComponentType

筛选组件类型枚举：

- `'input'` - 文本输入框
- `'select'` - 单选下拉框
- `'multipleSelect'` - 多选下拉框
- `'date'` - 日期选择器
- `'dateRange'` - 日期范围选择器
- `'treeSelect'` - 树形选择器
- `'inputNumber'` - 数字输入框

### SelectOption

下拉选项配置：

| 名称    | 类型               | 说明     |
| ------- | ------------------ | -------- |
| `value` | `string \| number` | 选项值   |
| `label` | `string`           | 选项文本 |

## 样式类名

| 类名                                       | 说明           |
| ------------------------------------------ | -------------- |
| `.pro-filter`                              | 筛选组件根容器 |
| `.pro-filter__content`                     | 内容区域       |
| `.pro-filter__content__condition`          | 筛选条件区域   |
| `.pro-filter__content__result`             | 筛选结果区域   |
| `.pro-filter__content__result__list`       | 结果列表容器   |
| `.pro-filter__content__result__list__item` | 结果项容器     |
| `.pro-filter__buttons`                     | 按钮区域       |
| `.pro-filter__buttons__search`             | 查询按钮       |
| `.pro-filter__buttons__clear`              | 清空按钮       |
