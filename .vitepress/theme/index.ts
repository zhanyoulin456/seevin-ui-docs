import DefaultTheme from 'vitepress/theme'
import { App } from 'vue'
import DemoBox from '../components/DemoBox.vue'

// 导入组件库
import TDesignUI from '@seevin/ui'
import '@seevin/ui/style/index.css'

// 导入自定义样式
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    // 注册组件库
    app.use(TDesignUI)

    // 注册演示容器组件
    app.component('DemoBox', DemoBox)

    // 注册常用组件别名，方便在MDX中使用
    app.component('Demo', DemoBox)
  }
}
