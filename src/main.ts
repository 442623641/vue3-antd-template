import { createApp } from 'vue'
import App from './App.vue'
import { setupAntd } from './plugins'
import router from './router'
import IonModal from './plugins/modal'
import './permission'
import { setupStore } from './store'

const app = createApp(App)

setupAntd(app)
setupStore(app)

app.use(router)
    .use(IonModal)
    .mount('#app')