# ProForm 表单组件

一个功能强大的表单组件，基于 TDesign Form 构建，支持多种表单项类型，提供灵活的配置方式和完整的表单验证功能。支持自定义渲染、响应式布局、数据回显等特性，适用于各种表单场景。

<script setup>
import { ref, reactive, h, computed } from 'vue'
import { Button as TButton, MessagePlugin, Input as TInput, Select as TSelect } from 'tdesign-vue-next'

// 基础示例数据
const basicFormItems = [
  {
    type: 'input',
    name: 'username',
    label: '用户名',
    value: '',
    required: true,
    placeholder: '请输入用户名'
  },
  {
    type: 'inputNumber',
    name: 'age',
    label: '年龄',
    value: null,
    componentProps: {
      min: 0,
      max: 120
    }
  },
  {
    type: 'select',
    name: 'gender',
    label: '性别',
    value: '',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' }
    ]
  },
  {
    type: 'textarea',
    name: 'description',
    label: '个人描述',
    value: '',
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
    value: '',
    required: true,
    rules: [
      { required: true, message: '请输入邮箱' },
      { email: true, message: '请输入正确的邮箱格式' }
    ]
  },
  {
    type: 'input',
    name: 'password',
    label: '密码',
    value: '',
    required: true,
    componentProps: {
      type: 'password'
    },
    rules: [
      { required: true, message: '请输入密码' },
      { min: 6, message: '密码长度不能少于6位' }
    ]
  },
  {
    type: 'input',
    name: 'confirmPassword',
    label: '确认密码',
    value: '',
    required: true,
    componentProps: {
      type: 'password'
    },
    rules: [
      { required: true, message: '请确认密码' },
      {
        validator: (val) => {
          const password = validationFormRef.value?.getFieldValue('password')
          return val === password
        },
        message: '两次密码输入不一致'
      }
    ]
  }
]

const validationFormRef = ref()

// 布局示例
const layoutFormItems = [
  {
    type: 'input',
    name: 'firstName',
    label: '名',
    value: '',
    col: 12
  },
  {
    type: 'input',
    name: 'lastName',
    label: '姓',
    value: '',
    col: 12
  },
  {
    type: 'input',
    name: 'phone',
    label: '手机号',
    value: '',
    col: 24
  },
  {
    type: 'textarea',
    name: 'address',
    label: '地址',
    value: '',
    col: 24,
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
    label: '标题',
    value: ''
  },
  {
    type: 'custom',
    name: 'customField',
    label: '自定义字段',
    value: '',
    render: () => h('div', { style: 'color: #0052d9; padding: 8px; border: 1px dashed #0052d9; border-radius: 4px;' }, '这是一个自定义渲染的字段')
  },
  {
    type: 'select',
    name: 'category',
    label: '分类',
    value: '',
    options: [
      { label: '技术', value: 'tech' },
      { label: '产品', value: 'product' }
    ]
  }
]

const customFormRef = ref()

// 动态表单数据
const dynamicFormRef = ref()
const dynamicFormData = reactive({
  contacts: [{ name: '', phone: '' }]
})

const dynamicFormItems = computed(() => {
  const items = []
  
  dynamicFormData.contacts.forEach((contact, index) => {
    items.push(
      {
        type: 'input',
        name: `contacts.${index}.name`,
        label: `联系人${index + 1}姓名`,
        col: { span: 8 },
        rules: [{ required: true, message: '请输入姓名' }]
      },
      {
        type: 'input',
        name: `contacts.${index}.phone`,
        label: `联系人${index + 1}电话`,
        col: { span: 8 },
        rules: [{ required: true, message: '请输入电话' }]
      },
      {
        type: 'custom',
        name: `remove_${index}`,
        label: '',
        col: { span: 8 },
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
  dynamicFormData.contacts.push({ name: '', phone: '' })
}

const removeDynamicItem = (index) => {
  if (dynamicFormData.contacts.length > 1) {
    dynamicFormData.contacts.splice(index, 1)
  } else {
    MessagePlugin.warning('至少保留一个联系人')
  }
}

// 联动表单数据
const linkageFormRef = ref()
const linkageFormData = reactive({
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
  if (linkageFormData.userType === 'company') {
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
  } else if (linkageFormData.userType === 'student') {
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

// 事件处理
const handleSubmit = async (formRef, formName) => {
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      const data = formRef.value?.getFieldsValue()
      MessagePlugin.success(`${formName}提交成功！数据：${JSON.stringify(data)}`)
      console.log(`${formName}数据:`, data)
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
    :form-items="basicFormItems"
  >
    <template #footer>
      <TButton theme="primary" type="submit">提交</TButton>
      <TButton theme="default" @click="() => handleReset(basicFormRef)">重置</TButton>
    </template>
  </ProForm>
</DemoBox>

```vue
<template>
  <ProForm ref="formRef" :form-items="formItems">
    <template #footer>
      <t-button theme="primary" type="submit">提交</t-button>
      <t-button theme="default" @click="handleReset">重置</t-button>
    </template>
  </ProForm>
</template>

<script setup>
import { ref } from 'vue'

const formRef = ref()
const formData = ref({})

const formItems = [
  {
    type: 'input',
    name: 'username',
    label: '用户名',
    value: '',
    required: true,
    placeholder: '请输入用户名'
  },
  {
    type: 'select',
    name: 'gender',
    label: '性别',
    value: '',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' }
    ]
  }
]

const handleSubmit = async () => {
  const result = await formRef.value?.validate()
  if (result === true) {
    const data = formRef.value?.getFieldsValue()
    console.log('表单数据:', data)
  }
}

const handleReset = () => {
  formRef.value?.reset()
}
</script>
```

## 表单验证

支持完整的表单验证功能，包括必填、格式验证、自定义验证等。

<DemoBox title="表单验证" description="集成完整的验证功能，支持多种验证规则">
  <ProForm
    ref="validationFormRef"
    :form-items="validationFormItems"
  >
    <template #footer>
      <TButton theme="primary" type="submit">提交</TButton>
      <TButton theme="default" @click="() => handleValidate(validationFormRef)">验证</TButton>
      <TButton theme="default" @click="() => handleReset(validationFormRef)">重置</TButton>
    </template>
  </ProForm>
</DemoBox>

```vue
<template>
  <ProForm ref="formRef" :items="formItems" v-model="formData" @submit="handleSubmit">
    <template #footer>
      <t-button theme="primary" type="submit">提交</t-button>
      <t-button theme="default" @click="handleValidate">验证</t-button>
    </template>
  </ProForm>
</template>

<script setup>
import { ref } from 'vue'

const formRef = ref()
const formData = ref({})

const formItems = [
  {
    type: 'input',
    name: 'email',
    label: '邮箱',
    value: '',
    required: true,
    rules: [
      { required: true, message: '请输入邮箱' },
      { email: true, message: '请输入正确的邮箱格式' }
    ]
  },
  {
    type: 'input',
    name: 'password',
    label: '密码',
    value: '',
    required: true,
    componentProps: {
      type: 'password'
    },
    rules: [
      { required: true, message: '请输入密码' },
      { min: 6, message: '密码长度不能少于6位' }
    ]
  }
]
</script>
```

## 响应式布局

支持响应式布局，可以通过 `col` 属性控制表单项的宽度。

<DemoBox title="响应式布局" description="使用栅格系统实现响应式布局">
  <ProForm
    ref="layoutFormRef"
    :form-items="layoutFormItems"
    :gutter="[16, 16]"
  >
    <template #footer>
      <TButton theme="primary" type="submit">提交</TButton>
      <TButton theme="default" @click="() => handleReset(layoutFormRef)">重置</TButton>
    </template>
  </ProForm>
</DemoBox>

```vue
<template>
  <ProForm ref="formRef" :items="formItems" v-model="formData" :gutter="[16, 16]" @submit="handleSubmit">
    <template #footer>
      <t-button theme="primary" type="submit">提交</t-button>
    </template>
  </ProForm>
</template>

<script setup>
const formItems = [
  {
    type: 'input',
    name: 'firstName',
    label: '名',
    value: '',
    col: 12 // 占据一半宽度
  },
  {
    type: 'input',
    name: 'lastName',
    label: '姓',
    value: '',
    col: 12 // 占据一半宽度
  },
  {
    type: 'input',
    name: 'phone',
    label: '手机号',
    value: '',
    col: 24 // 占据全宽
  }
]
</script>
```

## 自定义渲染

支持自定义渲染表单项，可以通过 `render` 函数或 `slot` 来实现复杂的表单项。

<DemoBox title="自定义渲染" description="使用 render 函数或插槽自定义表单项">
  <ProForm
    ref="customFormRef"
    :form-items="customFormItems"
  >
    <template #footer>
      <TButton theme="primary" type="submit">提交</TButton>
      <TButton theme="default" @click="() => handleReset(customFormRef)">重置</TButton>
    </template>
  </ProForm>
</DemoBox>

```vue
<template>
  <ProForm ref="formRef" :items="formItems" v-model="formData" @submit="handleSubmit">
    <template #footer>
      <t-button theme="primary" type="submit">提交</t-button>
    </template>
  </ProForm>
</template>

<script setup>
import { h } from 'vue'

const formItems = [
  {
    type: 'input',
    name: 'title',
    label: '标题',
    value: ''
  },
  {
    type: 'custom',
    name: 'customField',
    label: '自定义字段',
    value: '',
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
</script>
```

## 动态表单

支持动态添加和删除表单项，适用于不确定表单项数量的场景。

<DemoBox title="动态表单" description="支持动态添加和删除表单项">
  <ProForm
    ref="dynamicFormRef"
    :form-items="dynamicFormItems"
  >
    <template #footer>
      <TButton theme="primary" type="submit">提交</TButton>
      <TButton theme="default" @click="addDynamicItem">添加项目</TButton>
      <TButton theme="default" @click="() => handleReset(dynamicFormRef)">重置</TButton>
    </template>
  </ProForm>
</DemoBox>

```vue
<template>
  <ProForm ref="formRef" :items="formItems" v-model="formData" @submit="handleSubmit">
    <template #footer>
      <t-button theme="primary" type="submit">提交</t-button>
      <t-button theme="default" @click="addContact">添加联系人</t-button>
    </template>
  </ProForm>
</template>

<script setup>
import { ref, computed, reactive, h } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

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
        col: { span: 8 },
        rules: [{ required: true, message: '请输入姓名' }]
      },
      {
        type: 'input',
        name: `contacts.${index}.phone`,
        label: `联系人${index + 1}电话`,
        col: { span: 8 },
        rules: [{ required: true, message: '请输入电话' }]
      },
      {
        type: 'custom',
        name: `remove_${index}`,
        label: '',
        col: { span: 8 },
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

const addContact = () => {
  formData.contacts.push({ name: '', phone: '' })
}

const removeContact = index => {
  if (formData.contacts.length > 1) {
    formData.contacts.splice(index, 1)
  }
}
</script>
```

## 表单联动

支持表单项之间的联动效果，根据某个字段的值动态显示或隐藏其他字段。

<DemoBox title="表单联动" description="表单项之间的联动效果">
  <ProForm
    ref="linkageFormRef"
    :form-items="linkageFormItems"
  >
    <template #footer>
      <TButton theme="primary" type="submit">提交</TButton>
      <TButton theme="default" @click="() => handleReset(linkageFormRef)">重置</TButton>
    </template>
  </ProForm>
</DemoBox>

```vue
<template>
  <ProForm ref="formRef" :form-items="formItems">
    <template #footer>
      <t-button theme="primary" type="submit">提交</t-button>
    </template>
  </ProForm>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

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
      value: formData.value.userType,
      required: true,
      options: [
        { label: '企业用户', value: 'company' },
        { label: '学生用户', value: 'student' }
      ]
    }
  ]

  // 根据用户类型动态添加字段
  if (formData.value.userType === 'company') {
    baseItems.push(
      {
        type: 'input',
        name: 'companyName',
        label: '公司名称',
        value: formData.value.companyName,
        required: true
      },
      {
        type: 'input',
        name: 'position',
        label: '职位',
        value: formData.value.position
      }
    )
  } else if (formData.value.userType === 'student') {
    baseItems.push(
      {
        type: 'input',
        name: 'studentId',
        label: '学号',
        value: formData.value.studentId,
        required: true
      },
      {
        type: 'input',
        name: 'school',
        label: '学校',
        value: formData.value.school,
        required: true
      }
    )
  }

  return baseItems
})
</script>
```

## API

### Props

| 名称         | 类型                                                      | 默认值  | 说明                  |
| ------------ | --------------------------------------------------------- | ------- | --------------------- |
| `formItems`  | `ProFormItemConfig[]`                                     | `[]`    | 表单项配置数组，必需  |
| `gutter`     | `number \| GutterObject \| Array<GutterObject \| number>` | -       | 表单项间距配置        |
| `rowProps`   | `Omit<RowProps, 'gutter'>`                                | `{}`    | 透传给 Row 组件的属性 |
| `labelAlign` | `'left' \| 'right' \| 'top'`                              | `'top'` | 标签对齐方式          |

继承 TDesign Form 组件的所有属性，详见 [TDesign Form API](https://tdesign.tencent.com/vue-next/components/form)

### ProFormItemConfig 配置

| 名称              | 类型                                                                                | 默认值   | 说明                                     |
| ----------------- | ----------------------------------------------------------------------------------- | -------- | ---------------------------------------- |
| `type`            | `FormItemType`                                                                      | -        | **必需**。表单项类型                     |
| `value`           | `any`                                                                               | -        | 表单项双向绑定的值                       |
| `label`           | `string \| TNode`                                                                   | -        | 字段标签名称                             |
| `name`            | `string`                                                                            | -        | 表单字段名称                             |
| `labelAlign`      | `'left' \| 'right' \| 'top'`                                                        | -        | 表单字段标签对齐方式                     |
| `labelWidth`      | `string \| number`                                                                  | -        | 标签宽度，默认为100px                    |
| `width`           | `number \| string`                                                                  | `'100%'` | 表单项宽度                               |
| `col`             | `number \| Record<string, number>`                                                  | `12`     | 表单项占据的列数，基于24栅格系统         |
| `colProps`        | `ColProps`                                                                          | -        | Col 组件属性，透传给 t-col               |
| `rules`           | `FormRule[]`                                                                        | -        | 校验规则                                 |
| `required`        | `boolean`                                                                           | `false`  | 是否必填                                 |
| `trigger`         | `ValidateTriggerType`                                                               | `'all'`  | 校验触发方式                             |
| `validateMessage` | `string`                                                                            | -        | 自定义校验文案                           |
| `visible`         | `boolean`                                                                           | `true`   | 是否显示                                 |
| `disabled`        | `boolean`                                                                           | -        | 表单项组件是否禁用                       |
| `readonly`        | `boolean`                                                                           | -        | 表单项组件是否只读                       |
| `placeholder`     | `string`                                                                            | -        | 占位符文本                               |
| `options`         | `Array<{label: string, value: any}>`                                                | -        | select、radio、checkbox 等组件的选项数据 |
| `treeOptions`     | `any[]`                                                                             | -        | tree-select 组件的选项数据               |
| `componentProps`  | `any`                                                                               | -        | 表单项组件属性透传                       |
| `render`          | `(item: ProFormItemConfig, formModel: Record<string, any>) => VNode`                | -        | 自定义渲染函数                           |
| `formItemProps`   | `Omit<FormItemProps, 'label' \| 'name' \| 'labelAlign' \| 'labelWidth' \| 'rules'>` | -        | FormItem 组件属性透传                    |

### Events

无自定义事件，所有事件都通过 `formProps` 透传给底层 TDesign Form 组件。

### Slots

| 名称      | 参数 | 说明                                 |
| --------- | ---- | ------------------------------------ |
| `default` | -    | 默认插槽，用于放置表单内容           |
| `footer`  | -    | 表单底部区域，通常放置提交、重置按钮 |

### Methods

通过 `ref` 可以访问以下方法：

| 名称            | 类型                                                                 | 说明             |
| --------------- | -------------------------------------------------------------------- | ---------------- |
| `formRef`       | `Readonly<ShallowRef<FormInstanceFunctions<Data> \| null>>`          | 底层表单组件实例 |
| `formData`      | `Record<string, any>`                                                | 当前表单数据     |
| `setFormValues` | `(values: Record<string, any>) => void`                              | 设置表单数据     |
| `reset`         | `() => void`                                                         | 重置表单         |
| `clearValidate` | `(fields?: string[]) => void`                                        | 清除验证结果     |
| `validate`      | `(params?: FormValidateParams) => Promise<FormValidateResult<Data>>` | 验证表单         |

### 支持的表单项类型

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
| `custom`         | 自定义渲染   | 通过 render 函数自定义    |

## 样式类名

| 类名                        | 说明             |
| --------------------------- | ---------------- |
| `.pro-form`                 | 表单组件根容器   |
| `.pro-form__content`        | 表单内容区域     |
| `.pro-form__footer`         | 表单底部区域     |
| `.pro-form__item`           | 表单项容器       |
| `.pro-form__item--required` | 必填表单项       |
| `.pro-form__item--error`    | 验证失败的表单项 |

## 最佳实践

### 1. 基础表单

适用于简单的数据收集场景：

```vue
<ProForm :items="formItems" v-model="formData" @submit="handleSubmit" />
```

### 2. 复杂验证表单

适用于需要复杂验证逻辑的场景：

```vue
<ProForm
  :items="formItems"
  v-model="formData"
  :show-error-message="true"
  :scroll-to-first-error="true"
  @submit="handleSubmit"
/>
```

### 3. 动态表单

适用于表单项数量不确定的场景：

```vue
<ProForm :items="computedFormItems" v-model="formData" @submit="handleSubmit" />
```

### 4. 表单联动

适用于字段之间有依赖关系的场景：

```vue
<ProForm :items="linkageFormItems" v-model="formData" @change="handleFormChange" @submit="handleSubmit" />
```
