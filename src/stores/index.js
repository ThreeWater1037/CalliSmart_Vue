//此页面用于仓库的集中导出
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
const pinia=createPinia()
pinia.use(persist)

export default pinia
//集中式导出
export * from './modules/user'