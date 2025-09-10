# ProForm 表单组件

一个功能强大的表单组件，基于 TDesign Vue Next 构建，支持多种表单项类型，提供灵活的配置方式和完整的表单验证功能。支持自定义渲染、响应式布局、智能数据合并、动态表单项显隐等特性，适用于各种表单场景。

<script setup>
import { ref, reactive, h, computed } from 'vue'
import { Button as TButton, MessagePlugin, Input as TInput, Select as TSelect } from 'tdesign-vue-next'

// 基础示例数据
const basicFormItems = [
  {
    type: 'input',
    name: 'username',
    label: '用户名',
    required: true,
    placeholder: '请输入用户名'
  },
  {
    type: 'inputNumber',
    name: 'age',
    label: '年龄',
    componentProps: {
      min: 0,
      max: 120
    }
  },
  {
    type: 'select',
    name: 'gender',
    label: '性别',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' }
    ]
  },
  {
    type: 'textarea',
    name: 'description',
    label: '个人描述',
    componentProps: {
      rows: 3
    }
  }
]

const basicFormRef = ref()

// 验证规则示例
const validationFormItems = [
  {
    type: 'input',
    name: 'email',
    label: '邮箱',
    required: true
  },
  {
    type: 'input',
    name: 'password',
    label: '密码',
    required: true,
    componentProps: {
      type: 'password'
    }
  },
  {
    type: 'input',
    name: 'confirmPassword',
    label: '确认密码',
    required: true,
    componentProps: {
      type: 'password'
    }
  }
]

const validationFormRef = ref()

// 布局示例
const layoutFormItems = [
  {
    type: 'input',
    name: 'firstName',
    label: '名',
    col: 6
  },
  {
    type: 'input',
    name: 'lastName',
    label: '姓',
    col: 6
  },
  {
    type: 'input',
    name: 'phone',
    label: '手机号',
    col: 12
  },
  {
    type: 'textarea',
    name: 'address',
    label: '地址',
    col: 12,
    componentProps: {
      rows: 3
    }
  }
]

const layoutFormRef = ref()

// 自定义渲染示例
const customFormItems = [
  {
    type: 'input',
    name: 'title',
    label: '标题'
  },
  {
    type: 'layout',
    name: 'customField',
    label: '自定义字段',
    render: () => h('div', { style: 'color: #0052d9; padding: 8px; border: 1px dashed #0052d9; border-radius: 4px;' }, '这是一个自定义渲染的字段')
  },
  {
    type: 'select',
    name: 'category',
    label: '分类',
    options: [
      { label: '技术', value: 'tech' },
      { label: '产品', value: 'product' }
    ]
  }
]

const customFormRef = ref()

// 动态表单数据
const dynamicFormRef = ref()
const dynamicFormData = ref({
  contacts: [{ name: '', phone: '' }]
})

const dynamicFormItems = computed(() => {
  const items = []
  
  dynamicFormData.value.contacts.forEach((contact, index) => {
    items.push(
      {
        type: 'input',
        name: `contacts.${index}.name`,
        label: `联系人${index + 1}姓名`,
        col: 4,
        required: true
      },
      {
        type: 'input',
        name: `contacts.${index}.phone`,
        label: `联系人${index + 1}电话`,
        col: 4,
        required: true
      },
      {
        type: 'layout',
        name: `remove_${index}`,
        label: '',
        col: 4,
        render: () => h(TButton, {
          theme: 'danger',
          variant: 'text',
          onClick: () => removeDynamicItem(index)
        }, () => '删除')
      }
    )
  })
  
  return items
})

const addDynamicItem = () => {
  dynamicFormData.value.contacts.push({ name: '', phone: '' })
}

const removeDynamicItem = (index) => {
  if (dynamicFormData.value.contacts.length > 1) {
    dynamicFormData.value.contacts.splice(index, 1)
  } else {
    MessagePlugin.warning('至少保留一个联系人')
  }
}

// 联动表单数据
const linkageFormRef = ref()
const linkageFormData = ref({
  userType: '',
  companyName: '',
  position: '',
  studentId: '',
  school: ''
})

const linkageFormItems = computed(() => {
  const baseItems = [
    {
      type: 'select',
      name: 'userType',
      label: '用户类型',
      required: true,
      options: [
        { label: '企业用户', value: 'company' },
        { label: '学生用户', value: 'student' }
      ]
    }
  ]
  
  // 根据用户类型动态添加字段
  if (linkageFormData.value.userType === 'company') {
    baseItems.push(
      {
        type: 'input',
        name: 'companyName',
        label: '公司名称',
        required: true,
        placeholder: '请输入公司名称'
      },
      {
        type: 'input',
        name: 'position',
        label: '职位',
        placeholder: '请输入职位'
      }
    )
  } else if (linkageFormData.value.userType === 'student') {
    baseItems.push(
      {
        type: 'input',
        name: 'studentId',
        label: '学号',
        required: true,
        placeholder: '请输入学号'
      },
      {
        type: 'input',
        name: 'school',
        label: '学校',
        required: true,
        placeholder: '请输入学校名称'
      }
    )
  }
  
  return baseItems
})

// 表单数据 - 使用 v-model 双向绑定
const basicFormData = ref({})
const validationFormData = ref({})
const layoutFormData = ref({})
const customFormData = ref({})

// 事件处理
const handleSubmit = async (formRef, formData, formName) => {
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      MessagePlugin.success(`${formName}提交成功！数据：${JSON.stringify(formData.value)}`)
      console.log(`${formName}数据:`, formData.value)
    }
  } catch (error) {
    MessagePlugin.error('表单验证失败，请检查输入')
    console.error('验证失败:', error)
  }
}

const handleReset = (formRef) => {
  formRef.value?.reset()
  MessagePlugin.info('表单已重置')
}

const handleValidate = async (formRef) => {
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      MessagePlugin.success('表单验证通过')
    }
  } catch (error) {
    MessagePlugin.error('表单验证失败')
  }
}
</script>

## 基础用法

最简单的表单使用方式，支持多种表单项类型。

<DemoBox title="基础用法" description="展示基础的表单功能">
  <ProForm
    ref="basicFormRef"
    :items="basicFormItems"
    v-model="basicFormData"
  />
  <div style="margin-top: 16px; display: flex; gap: 12px;">
    <TButton theme="primary" @click="() => handleSubmit(basicFormRef, basicFormData, '基础表单')">提交</TButton>
    <TButton theme="default" @click="() => handleReset(basicFormRef)">重置</TButton>
  </div>
</DemoBox>

```vue
<template>
  <ProForm ref="formRef" :items="formItems" v-model="formData" />
  <div class="mt-4">
    <t-button theme="primary" @click="handleSubmit">提交</t-button>
    <t-button theme="default" @click="handleReset">重置</t-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const formRef = ref()
const formData = ref({})

const formItems = [
  {
    type: 'input',
    name: 'username',
    label: '用户名',
    required: true,
    placeholder: '请输入用户名'
  },
  {
    type: 'select',
    name: 'gender',
    label: '性别',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' }
    ]
  }
]

const handleSubmit = async () => {
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      MessagePlugin.success(`提交成功！数据：${JSON.stringify(formData.value)}`)
      console.log('表单数据:', formData.value)
    }
  } catch (error) {
    MessagePlugin.error('表单验证失败，请检查输入')
    console.error('验证失败:', error)
  }
}

const handleReset = () => {
  formRef.value?.reset()
  MessagePlugin.info('表单已重置')
}
</script>
```

## 表单验证

支持完整的表单验证功能，包括必填、格式验证、自定义验证等。

<DemoBox title="表单验证" description="集成完整的验证功能，支持多种验证规则">
  <ProForm
    ref="validationFormRef"
    :items="validationFormItems"
    v-model="validationFormData"
  />
  <div style="margin-top: 16px; display: flex; gap: 12px;">
    <TButton theme="primary" @click="() => handleSubmit(validationFormRef, validationFormData, '验证表单')">提交</TButton>
    <TButton theme="default" @click="() => handleValidate(validationFormRef)">验证</TButton>
    <TButton theme="default" @click="() => handleReset(validationFormRef)">重置</TButton>
  </div>
</DemoBox>

```vue
<template>
  <ProForm ref="formRef" :items="formItems" v-model="formData" />
  <div class="mt-4">
    <t-button theme="primary" @click="handleSubmit">提交</t-button>
    <t-button theme="default" @click="handleValidate">验证</t-button>
    <t-button theme="default" @click="handleReset">重置</t-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const formRef = ref()
const formData = ref({})

const formItems = [
  {
    type: 'input',
    name: 'email',
    label: '邮箱',
    required: true
  },
  {
    type: 'input',
    name: 'password',
    label: '密码',
    required: true,
    componentProps: {
      type: 'password'
    }
  }
]

const handleSubmit = async () => {
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      MessagePlugin.success(`提交成功！数据：${JSON.stringify(formData.value)}`)
      console.log('表单数据:', formData.value)
    }
  } catch (error) {
    MessagePlugin.error('表单验证失败，请检查输入')
    console.error('验证失败:', error)
  }
}

const handleValidate = async () => {
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      MessagePlugin.success('表单验证通过')
    }
  } catch (error) {
    MessagePlugin.error('表单验证失败，请检查输入')
    console.error('验证失败:', error)
  }
}

const handleReset = () => {
  formRef.value?.reset()
  MessagePlugin.info('表单已重置')
}
</script>
```

## 响应式布局

支持响应式布局，可以通过 `col` 属性控制表单项的宽度。

<DemoBox title="响应式布局" description="使用栅格系统实现响应式布局">
  <ProForm
    ref="layoutFormRef"
    :items="layoutFormItems"
    v-model="layoutFormData"
    :gutter="[16, 16]"
  />
  <div style="margin-top: 16px; display: flex; gap: 12px;">
    <TButton theme="primary" @click="() => handleSubmit(layoutFormRef, layoutFormData, '布局表单')">提交</TButton>
    <TButton theme="default" @click="() => handleReset(layoutFormRef)">重置</TButton>
  </div>
</DemoBox>

```vue
<template>
  <ProForm ref="formRef" :items="formItems" v-model="formData" :gutter="[16, 16]" />
  <div class="mt-4">
    <t-button theme="primary" @click="handleSubmit">提交</t-button>
    <t-button theme="default" @click="handleReset">重置</t-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const formRef = ref()
const formData = ref({})

const formItems = [
  {
    type: 'input',
    name: 'firstName',
    label: '名',
    col: 6 // 占据一半宽度
  },
  {
    type: 'input',
    name: 'lastName',
    label: '姓',
    col: 6 // 占据一半宽度
  },
  {
    type: 'input',
    name: 'phone',
    label: '手机号',
    col: 12 // 占据全宽
  }
]

const handleSubmit = async () => {
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      MessagePlugin.success(`提交成功！数据：${JSON.stringify(formData.value)}`)
      console.log('表单数据:', formData.value)
    }
  } catch (error) {
    MessagePlugin.error('表单验证失败，请检查输入')
    console.error('验证失败:', error)
  }
}

const handleReset = () => {
  formRef.value?.reset()
  MessagePlugin.info('表单已重置')
}
</script>
</script>
```

## 自定义渲染

支持自定义渲染表单项，可以通过 `render` 函数或 `slot` 来实现复杂的表单项。

<DemoBox title="自定义渲染" description="使用 render 函数或插槽自定义表单项">
  <ProForm
    ref="customFormRef"
    :items="customFormItems"
    v-model="customFormData"
  />
  <div style="margin-top: 16px; display: flex; gap: 12px;">
    <TButton theme="primary" @click="() => handleSubmit(customFormRef, customFormData, '自定义表单')">提交</TButton>
    <TButton theme="default" @click="() => handleReset(customFormRef)">重置</TButton>
  </div>
</DemoBox>

```vue
<template>
  <ProForm ref="formRef" :items="formItems" v-model="formData" />
  <div class="mt-4">
    <t-button theme="primary" @click="handleSubmit">提交</t-button>
    <t-button theme="default" @click="handleReset">重置</t-button>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const formRef = ref()
const formData = ref({})

const formItems = [
  {
    type: 'input',
    name: 'title',
    label: '标题'
  },
  {
    type: 'layout',
    name: 'customField',
    label: '自定义字段',
    render: () =>
      h(
        'div',
        {
          style: 'color: #0052d9; padding: 8px; border: 1px dashed #0052d9; border-radius: 4px;'
        },
        '这是一个自定义渲染的字段'
      )
  }
]

const handleSubmit = async () => {
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      MessagePlugin.success(`提交成功！数据：${JSON.stringify(formData.value)}`)
      console.log('表单数据:', formData.value)
    }
  } catch (error) {
    MessagePlugin.error('表单验证失败，请检查输入')
    console.error('验证失败:', error)
  }
}

const handleReset = () => {
  formRef.value?.reset()
  MessagePlugin.info('表单已重置')
}
</script>
```

## 动态表单

支持动态添加和删除表单项，适用于不确定表单项数量的场景。

<DemoBox title="动态表单" description="支持动态添加和删除表单项">
  <ProForm
    ref="dynamicFormRef"
    :items="dynamicFormItems"
    v-model="dynamicFormData"
  />
  <div style="margin-top: 16px; display: flex; gap: 12px;">
    <TButton theme="primary" @click="() => handleSubmit(dynamicFormRef, dynamicFormData, '动态表单')">提交</TButton>
    <TButton theme="default" @click="addDynamicItem">添加项目</TButton>
    <TButton theme="default" @click="() => handleReset(dynamicFormRef)">重置</TButton>
  </div>
</DemoBox>

```vue
<template>
  <ProForm ref="formRef" :items="formItems" v-model="formData" />
  <div class="mt-4">
    <t-button theme="primary" @click="handleSubmit">提交</t-button>
    <t-button theme="default" @click="addContact">添加联系人</t-button>
    <t-button theme="default" @click="handleReset">重置</t-button>
  </div>
</template>

<script setup>
import { ref, computed, reactive, h } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const formRef = ref()
const formData = reactive({
  contacts: [{ name: '', phone: '' }]
})

const formItems = computed(() => {
  const items = []

  formData.contacts.forEach((contact, index) => {
    items.push(
      {
        type: 'input',
        name: `contacts.${index}.name`,
        label: `联系人${index + 1}姓名`,
        col: 4,
        required: true
      },
      {
        type: 'input',
        name: `contacts.${index}.phone`,
        label: `联系人${index + 1}电话`,
        col: 4,
        required: true
      },
      {
        type: 'layout',
        name: `remove_${index}`,
        label: '',
        col: 4,
        render: () =>
          h(
            't-button',
            {
              theme: 'danger',
              variant: 'text',
              onClick: () => removeContact(index)
            },
            '删除'
          )
      }
    )
  })

  return items
})

const handleSubmit = async () => {
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      MessagePlugin.success(`提交成功！数据：${JSON.stringify(formData.value)}`)
      console.log('表单数据:', formData.value)
    }
  } catch (error) {
    MessagePlugin.error('表单验证失败，请检查输入')
    console.error('验证失败:', error)
  }
}

const addContact = () => {
  formData.contacts.push({ name: '', phone: '' })
}

const removeContact = index => {
  if (formData.contacts.length > 1) {
    formData.contacts.splice(index, 1)
  } else {
    MessagePlugin.warning('至少保留一个联系人')
  }
}

const handleReset = () => {
  formRef.value?.reset()
  formData.contacts = [{ name: '', phone: '' }] // 重置动态数据
  MessagePlugin.info('表单已重置')
}
</script>
```

## 表单联动

支持表单项之间的联动效果，根据某个字段的值动态显示或隐藏其他字段。

<DemoBox title="表单联动" description="表单项之间的联动效果">
  <ProForm
    ref="linkageFormRef"
    :items="linkageFormItems"
    v-model="linkageFormData"
  />
  <div style="margin-top: 16px; display: flex; gap: 12px;">
    <TButton theme="primary" @click="() => handleSubmit(linkageFormRef, linkageFormData, '联动表单')">提交</TButton>
    <TButton theme="default" @click="() => handleReset(linkageFormRef)">重置</TButton>
  </div>
</DemoBox>

```vue
<template>
  <ProForm ref="formRef" :items="formItems" v-model="formData" />
  <div class="mt-4">
    <t-button theme="primary" @click="handleSubmit">提交</t-button>
    <t-button theme="default" @click="handleReset">重置</t-button>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const formRef = ref()
const formData = reactive({
  userType: '',
  companyName: '',
  position: '',
  studentId: '',
  school: ''
})

const formItems = computed(() => {
  const baseItems = [
    {
      type: 'select',
      name: 'userType',
      label: '用户类型',
      required: true,
      options: [
        { label: '企业用户', value: 'company' },
        { label: '学生用户', value: 'student' }
      ]
    }
  ]

  // 根据用户类型动态添加字段
  if (formData.userType === 'company') {
    baseItems.push(
      {
        type: 'input',
        name: 'companyName',
        label: '公司名称',
        required: true,
        placeholder: '请输入公司名称'
      },
      {
        type: 'input',
        name: 'position',
        label: '职位',
        placeholder: '请输入职位'
      }
    )
  } else if (formData.userType === 'student') {
    baseItems.push(
      {
        type: 'input',
        name: 'studentId',
        label: '学号',
        required: true,
        placeholder: '请输入学号'
      },
      {
        type: 'input',
        name: 'school',
        label: '学校',
        required: true,
        placeholder: '请输入学校名称'
      }
    )
  }

  return baseItems
})

const handleSubmit = async () => {
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      MessagePlugin.success(`提交成功！数据：${JSON.stringify(formData)}`)
      console.log('表单数据:', formData)
    }
  } catch (error) {
    MessagePlugin.error('表单验证失败，请检查输入')
    console.error('验证失败:', error)
  }
}

const handleReset = () => {
  formRef.value?.reset()
  Object.keys(formData).forEach(key => {
    if (typeof formData[key] === 'string') {
      formData[key] = ''
    } else if (Array.isArray(formData[key])) {
      formData[key] = []
    }
  })
  MessagePlugin.info('表单已重置')
}
</script>
</script>
```

## API

### Props

| 名称         | 类型                                                      | 默认值     | 说明                            |
| ------------ | --------------------------------------------------------- | ---------- | ------------------------------- |
| `items`      | `ProFormItemConfig[]`                                     | `[]`       | 表单项配置数组（必传）          |
| `modelValue` | `Record<string, any>`                                     | -          | 表单数据，支持 v-model 双向绑定 |
| `gutter`     | `number \| GutterObject \| Array<GutterObject \| number>` | `[16, 24]` | 栅格间隔配置                    |
| `rowProps`   | `Omit<RowProps, 'gutter'>`                                | `{}`       | 透传给 Row 组件的属性           |
| `labelAlign` | `'left' \| 'right' \| 'top'`                              | `'top'`    | 标签对齐方式                    |
| `layout`     | `'vertical' \| 'inline'`                                  | `vertical` | 表单布局方式                    |
| `disabled`   | `boolean`                                                 | `false`    | 是否禁用整个表单                |
| `readonly`   | `boolean`                                                 | `false`    | 是否只读整个表单                |

_继承 TDesign Form 组件的所有属性（除了 `data`），详见 [TDesign Form API](https://tdesign.tencent.com/vue-next/components/form)_

### ProFormItemConfig 配置

| 名称              | 类型                                                                                | 默认值   | 说明                                     |
| ----------------- | ----------------------------------------------------------------------------------- | -------- | ---------------------------------------- |
| `type`            | `FormItemType`                                                                      | -        | 表单项类型（必传）                       |
| `name`            | `string`                                                                            | -        | 表单字段名称（必传）                     |
| `label`           | `string \| TNode`                                                                   | -        | 字段标签名称                             |
| `labelAlign`      | `'left' \| 'right' \| 'top'`                                                        | -        | 表单字段标签对齐方式                     |
| `labelWidth`      | `string \| number`                                                                  | `100px`  | 标签宽度                                 |
| `width`           | `number \| string`                                                                  | `'100%'` | 表单项宽度                               |
| `style`           | `CSSProperties`                                                                     | -        | 表单项样式                               |
| `col`             | `number \| Record<string, number>`                                                  | `12`     | 表单项占据的列数，基于12栅格系统         |
| `colProps`        | `ColProps`                                                                          | -        | Col 组件属性，透传给 t-col               |
| `rules`           | `FormRule[]`                                                                        | -        | 校验规则                                 |
| `required`        | `boolean`                                                                           | `false`  | 是否必填                                 |
| `trigger`         | `ValidateTriggerType`                                                               | `'all'`  | 校验触发方式                             |
| `validateMessage` | `string`                                                                            | -        | 自定义校验文案                           |
| `visible`         | `boolean \| function`                                                               | `true`   | 是否显示，支持函数动态控制               |
| `disabled`        | `boolean \| function`                                                               | `false`  | 表单项组件是否禁用，支持函数动态控制     |
| `readonly`        | `boolean \| function`                                                               | `false`  | 表单项组件是否只读，支持函数动态控制     |
| `placeholder`     | `string`                                                                            | -        | 占位符文本                               |
| `options`         | `Array<{label: string, value: any}>`                                                | -        | select、radio、checkbox 等组件的选项数据 |
| `treeOptions`     | `any[]`                                                                             | -        | tree-select 组件的选项数据               |
| `componentProps`  | `any`                                                                               | -        | 表单项组件属性透传                       |
| `render`          | `(formData: Record<string, any>, item: ProFormItemConfig) => VNode`                 | -        | 自定义渲染函数                           |
| `formItemProps`   | `Omit<FormItemProps, 'label' \| 'name' \| 'labelAlign' \| 'labelWidth' \| 'rules'>` | -        | FormItem 组件属性透传                    |

### Events

| 名称                | 类型                                            | 说明               |
| ------------------- | ----------------------------------------------- | ------------------ |
| `update:modelValue` | `(value: Record<string, any>) => void`          | 表单数据更新时触发 |
| `validate`          | `(result: ValidateResultContext<Data>) => void` | 表单验证时触发     |
| `reset`             | `(context: { e?: FormResetEvent }) => void`     | 表单重置时触发     |
| `submit`            | `(context: SubmitContext<Data>) => void`        | 表单提交时触发     |

_继承 TDesign Form 组件的所有事件_

### 插槽（Slots）

_ProForm 组件本身不提供插槽，所有内容都通过 `items` 配置生成。如需自定义内容，请使用 `render` 函数或 `layout` 类型的表单项。_

### Methods

通过 `ref` 可以访问以下方法：

| 名称            | 类型                                                                 | 说明                       |
| --------------- | -------------------------------------------------------------------- | -------------------------- |
| `formRef`       | `Readonly<ShallowRef<FormInstanceFunctions<Data> \| null>>`          | 底层表单组件实例           |
| `formData`      | `Record<string, any>`                                                | 当前表单数据（响应式引用） |
| `setFormValues` | `(values: Record<string, any>) => void`                              | 设置表单数据               |
| `reset`         | `() => void`                                                         | 重置表单                   |
| `clearValidate` | `(fields?: string[]) => void`                                        | 清除验证结果               |
| `validate`      | `(params?: FormValidateParams) => Promise<FormValidateResult<Data>>` | 验证表单                   |

### FormItemType 表单项类型

| 类型             | 说明         | 对应组件                  |
| ---------------- | ------------ | ------------------------- |
| `input`          | 输入框       | TDesign Input             |
| `inputNumber`    | 数字输入框   | TDesign InputNumber       |
| `textarea`       | 多行文本框   | TDesign Textarea          |
| `select`         | 下拉选择     | TDesign Select            |
| `multipleSelect` | 多选下拉     | TDesign Select (multiple) |
| `radio`          | 单选框       | TDesign RadioGroup        |
| `checkbox`       | 复选框       | TDesign CheckboxGroup     |
| `date`           | 日期选择     | TDesign DatePicker        |
| `dateRange`      | 日期范围选择 | TDesign DateRangePicker   |
| `treeSelect`     | 树形选择     | TDesign TreeSelect        |
| `upload`         | 文件上传     | ProUpload                 |
| `layout`         | 布局占位     | 通过 render 函数自定义    |

## 样式类名

| 类名        | 说明           |
| ----------- | -------------- |
| `.pro-form` | 表单组件根容器 |

_其他样式类名继承自 TDesign Form、Row、Col 等组件_

## 特性说明

- **响应式设计**：支持全局配置（ProConfigProvider）和局部配置
- **智能数据合并**：自动处理 modelValue 与默认值的合并逻辑
- **类型安全**：完整的 TypeScript 类型定义
- **组件透传**：支持透传属性到底层 TDesign 组件
- **自定义渲染**：支持自定义表单项渲染函数
- **动态控制**：支持动态控制表单项的显示、禁用、只读状态
- **自动验证**：根据 `required` 属性自动生成验证规则和消息
- **栅格布局**：基于 12 栅格系统的响应式布局
- **数据同步**：支持双向数据绑定和手动数据设置

## 使用注意事项

1. **必传属性**：`items` 是必传属性，且每个表单项必须包含 `type` 和 `name`
2. **数据管理**：如果传递了 `modelValue`，组件会进行智能数据合并和同步
3. **验证规则**：设置 `required: true` 会自动生成基础验证规则
4. **动态表单**：使用计算属性 `computed` 来创建动态表单项
5. **自定义渲染**：`render` 函数的参数顺序是 `(formData, item)`
6. **布局控制**：使用 `col` 属性控制表单项宽度，支持响应式配置
