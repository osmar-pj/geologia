import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import PrimeVue from 'primevue/config'
import store from './store/store'
import './style.scss'
import 'primevue/resources/primevue.min.css'

import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const app = createApp(App)

app.use(router)
app.use(store)
app.use(PrimeVue, {ripple: true})

app.component('Dropdown', Dropdown)
app.component('MultiSelect', MultiSelect)
app.component('DataTable', DataTable)
app.component('Column', Column)

app.mount('#app')
