# 安装

## 包管理器

使用 pnpm 或 npm 安装 @seevin/ui 组件库和 @seevin/common 工具库。

### 组件库安装

```bash
# pnpm
pnpm install @seevin/ui@latest

# npm
npm install @seevin/ui@latest

```

### 工具库安装

```bash
# pnpm
pnpm install @seevin/common@latest

# npm
npm install @seevin/common@latest

```

## 依赖说明

### 组件库依赖

@seevin/ui 基于 TDesign Vue Next 构建，因此需要确保项目中已安装 Vue 3.4.0+：

```json
{
  "peerDependencies": {
    "tdesign-vue-next": "^1.16.1",
    "vue": "^3.4.0",
    "vue-router": "^4.5.1"
  },
  "dependencies": {
    "tdesign-icons-vue-next": "^0.3.7",
    "tdesign-vue-next": "^1.16.1"
  }
}
```

### 工具库依赖

@seevin/common 是一个独立的工具库，主要依赖：

```json
{
  "dependencies": {
    "axios": "^1.11.0",
    "qs": "^6.14.0"
  }
}
```

工具库中 useEventBus 函数依赖 Vue， 请在 vue 项目使用。

## 包结构说明

本项目提供两个独立的包：

### @seevin/ui

- **用途**：Vue 3 组件库
- **依赖**：基于 TDesign Vue Next
- **包含**： ProSearch、 ProFilter、ProTable、ProForm、ProScaffold 等业务组件
- **适用**：Vue 3 项目的 UI 层开发

### @seevin/common

- **用途**：通用工具库
- **依赖**：仅依赖必要的第三方库（axios、qs）
- **包含**：HttpClient、EventBus 等工具函数
- **适用**：Vue 3 项目

两个包可以独立安装和使用，也可以在同一个项目中同时使用。
