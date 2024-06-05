import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/stores/index'
import '@/assets/main.scss'
// import mitt from 'mitt' //这是事件总线，组件传参用的

const app = createApp(App)
// app.config.globalProperties.$mitt = mitt //全局配置



app.use(router)
app.use(pinia)
app.mount('#app')

