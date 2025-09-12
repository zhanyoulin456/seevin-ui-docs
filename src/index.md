---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: '@seevin/ui'
  text: '佳思德科技有限公司<br/>前端业务组件库'
  tagline: '开箱即用的 Vue 3 业务组件库，基于 TDesign，提供丰富的业务组件'
  image:
    src: /logo.svg
    alt: '@seevin/ui'
  actions:
    - theme: brand
      text: 快速开始
      link: /installation
    - theme: alt
      text: 组件文档
      link: /components/search
    - theme: alt
      text: 工具库文档
      link: /utils/
    - theme: alt
      text: 在 Gitlab 上查看
      link: http://code.seevin.com/project/fe-packages

features:
  - icon: 🎨
    title: 基于 TDesign
    details: 兼容 TDesign Vue Next 组件，继承优秀的设计语言和交互体验
  - icon: 🚀
    title: 开箱即用
    details: 提供丰富的业务组件，支持搜索、筛选、表格、页面脚手架等常用功能
  - icon: 🎯
    title: TypeScript 支持
    details: 完整的 TypeScript 类型定义，提供更好的开发体验和代码提示
  - icon: 🔧
    title: 按需加载
    details: 支持自动导入和按需引入，配合构建工具实现最小包体积
  - icon: 🛠️
    title: 现代化工具库
    details: 提供 HTTP 客户端、工具函数等常用工具，简化开发流程，提升开发效率
#  - icon: 🎪
#    title: 自定义主题
#    details: 基于 CSS 变量的主题系统，支持深色模式和自定义品牌色
---

## 快速体验

```bash
# 安装
pnpm install @seevin/ui

# 使用
import { ProSearch, ProFilter, ProTable } from '@seevin/ui'
import '@seevin/ui/style/base.css'
```

## 组件预览

### 搜索组件

```vue
<ProSearch v-model="keyword" @search="handleSearch" />
```

### 筛选组件

```vue
<ProFilter :items="conditions" @search="handleFilter" />
```

### 页面脚手架

```vue
<ProScaffold show-back-button>
  <template #header>
    <h1>页面标题</h1>
  </template>
  <div>页面内容</div>
</ProScaffold>
```

## 特色功能

- **🔍 智能搜索**：支持多种搜索模式和自定义样式
- **🎛️ 强大筛选**：支持输入框、下拉选择、日期选择、树形选择等多种筛选类型
- **📊 数据展示**：基于 TDesign 的表格组件，提供丰富的数据展示功能
- **🏗️ 页面布局**：标准化的页面布局脚手架，快速构建业务页面
- **🛠️ 实用工具**：提供 HTTP 客户端等现代化工具，支持请求拦截、错误处理、请求取消等功能

## 立即开始

选择你喜欢的方式开始使用 @seevin/ui：

- [安装指南](/installation) - 了解如何安装和配置
- [快速开始](/quick-start) - 5分钟上手使用
- [组件文档](/components/search) - 查看详细的组件API
- [工具库文档](/utils/) - 了解实用工具函数
- [更新日志](/changelog) - 了解版本更新内容
