import { createPinia } from 'pinia' //Pinia依赖包
import persist from 'pinia-plugin-persistedstate' //Pinia持久化

const pinia = createPinia() //创建Pinia实例
pinia.use(persist) //使用Pinia持久化

export default pinia //将index.js文件暴露出去
export * from './modules/user'
