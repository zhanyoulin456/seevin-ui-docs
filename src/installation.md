# 安装

## 包管理器

使用 npm 或 pnpm 安装 @seevin/ui 组件库和 @seevin/common 工具库。

### 组件库安装

```bash
# npm
npm install @seevin/ui

# pnpm
pnpm install @seevin/ui
```

### 工具库安装

```bash
# npm
npm install @seevin/common

# pnpm
pnpm install @seevin/common
```

## 依赖说明

### 组件库依赖

@seevin/ui 基于 TDesign Vue Next 构建，因此需要确保项目中已安装 Vue 3.3+：

```json
{
  "peerDependencies": {
    "tdesign-vue-next": "^1.2.0",
    "vue": "^3.4.0",
    "vue-router": "^4.5.1"
  },
  "dependencies": {
    "tdesign-icons-vue-next": "^0.3.6",
    "tdesign-vue-next": "^1.2.0"
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

## 浏览器兼容性

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge >=84                                                                                                                                                                                                       | Firefox >=83                                                                                                                                                                                                      | Chrome >=84                                                                                                                                                                                                   | Safari >=14.1                                                                                                                                                                                                 |

## 包结构说明

本项目提供两个独立的包：

### @seevin/ui

- **用途**：Vue 3 组件库
- **依赖**：基于 TDesign Vue Next
- **包含**： ProSearch、 ProFilter、ProTable、ProScaffold 等业务组件
- **适用**：Vue 3 项目的 UI 层开发

### @seevin/common

- **用途**：通用工具库
- **依赖**：仅依赖必要的第三方库（axios、qs）
- **包含**：HttpClient 等工具函数
- **适用**：任何 JavaScript/TypeScript 项目

两个包可以独立安装和使用，也可以在同一个项目中同时使用。
