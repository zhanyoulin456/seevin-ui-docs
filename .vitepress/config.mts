import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '@seevin/ui',
  description: '佳思德科技有限公司前端业务组件库',
  lang: 'zh-CN',
  cleanUrls: true,
  srcDir: './src',
  head: [['link', { rel: 'icon', href: '/logo.svg' }]],

  vue: {
    template: {
      compilerOptions: {
        isCustomElement: tag => tag.includes('-')
      }
    }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    outline: {
      level: 'deep',
      label: '页面导航'
    },

    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/installation' },
      { text: '组件', link: '/components/search' },
      { text: '工具库', link: '/utils/' },
      { text: '更新日志', link: '/changelog' },
      {
        text: '相关链接',
        items: [
          { text: 'TDesign Vue Next', link: 'https://tdesign.tencent.com/vue-next/overview' },
          { text: 'Gitlab', link: 'http://code.seevin.com/zhanyoulin/seevin' }
        ]
      }
    ],

    sidebar: [
      {
        text: '开始使用',
        items: [
          { text: '安装', link: '/installation' },
          { text: '快速开始', link: '/quick-start' }
        ]
      },
      {
        text: '组件',
        items: [
          { text: 'ProSearch 搜索', link: '/components/search' },
          { text: 'ProFilter 筛选', link: '/components/filter' },
          { text: 'ProForm 表单', link: '/components/form' },
          { text: 'ProTable 表格', link: '/components/table' },
          { text: 'ProUpload 文件上传', link: '/components/upload' },
          { text: 'ProScaffold 脚手架', link: '/components/scaffold' },
          { text: 'ProConfigProvider 全局配置', link: '/components/config-provider' }
        ]
      },
      {
        text: '工具库',
        items: [
          { text: '概览', link: '/utils/' },
          { text: 'HttpClient HTTP客户端', link: '/utils/http-client' },
          { text: '通用工具', link: '/utils/common-utils' },
          { text: 'EventBus 事件总线', link: '/utils/eventbus' }
        ]
      },
      {
        text: '其他',
        items: [{ text: '更新日志', link: '/changelog' }]
      }
    ],

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    socialLinks: [{ icon: 'github', link: 'http://code.seevin.com/zhanyoulin/seevin' }],

    footer: {
      message: '基于 TDesign Vue Next 构建',
      copyright: 'Copyright © 2025 Seevin'
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
    config: () => {
      // 支持 MDX 语法
    }
  },

  vite: {
    resolve: {
      alias: {
        '@': './src'
      }
    },
    optimizeDeps: {
      include: ['@seevin/ui']
    }
  }
})
