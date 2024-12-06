import App from './App'
import { createSSRApp } from 'vue'
import store from './stores/index.js'

export function createApp() {
    const app = createSSRApp(App)
    
    // 挂载 store
    app.use(store)
    
    return {
        app,
        store // 导出 store 给 uni-app 使用
    }
}