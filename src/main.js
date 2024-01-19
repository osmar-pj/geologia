import { createApp } from 'vue'
import './style.scss'
import 'primevue/resources/primevue.min.css'
import App from './App.vue'
import router from './router/router'
import PrimeVue from 'primevue/config'
import store from './store/store'

import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import FileUpload from 'primevue/fileupload';
import Skeleton from 'primevue/skeleton';

const app = createApp(App)

app.use(router)
app.use(store)
app.use(PrimeVue, {ripple: true})

app.component('Dropdown', Dropdown)
app.component('MultiSelect', MultiSelect)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('FileUpload', FileUpload)
app.component('Skeleton', Skeleton)
app.mount('#app')
