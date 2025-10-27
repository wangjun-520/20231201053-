import { createApp } from 'vue'
import { createAppWithReact } from 'veaury'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './style.css'

// 创建 Pinia 实例
const pinia = createPinia()

// 创建 Veaury 混合应用
const app = createAppWithReact({
  rootComponent: App,
  // React 全局配置
  reactOptions: {
    // 可以在这里配置 React 的全局设置
  },
  // Vue 全局配置
  vueOptions: {
    // 可以在这里配置 Vue 的全局设置
  }
})

// 使用路由和状态管理
app.use(router)
app.use(pinia)

// 挂载应用
app.mount('#app')