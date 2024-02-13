import { createApp } from 'vue'
import './style.scss'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
// import 'primevue/resources/themes/tailwind-light/theme.css'
// import 'primeflex/primeflex.css'

// import 'primevue/resources/themes/saga-blue/theme.css'

import App from './App.vue'
import router from './router/router'
import PrimeVue from 'primevue/config'
import store from './store/store'
import io from 'socket.io-client'
import jsPDF from 'jspdf'
import Vue3Html2pdf from 'vue3-html2pdf'

import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import FileUpload from 'primevue/fileupload'
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'
import Tooltip from 'primevue/tooltip'
import Calendar from 'primevue/calendar'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import ColumnGroup from 'primevue/columngroup'   
import Toast from 'primevue/toast'
import Dock from 'primevue/dock';

import ToastService from 'primevue/toastservice'

const app = createApp(App)
const socket = io(import.meta.env.VITE_API_URL)
app.provide('socket', socket)
app.provide('jsPDF', jsPDF)

app.use(router)
app.use(store)
app.use(PrimeVue, {ripple: true})
app.use(ToastService)
app.use(Vue3Html2pdf, {
  margin: 20,
  filename: 'report.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {},
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
})

app.component('Dropdown', Dropdown)
app.component('MultiSelect', MultiSelect)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('FileUpload', FileUpload)
app.component('Skeleton', Skeleton)
app.component('Button', Button)
app.directive('tooltip', Tooltip)
app.component('Calendar', Calendar)
app.component('Checkbox', Checkbox)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.component('ColumnGroup', ColumnGroup)
app.component('Toast', Toast)
app.component('Dock', Dock)

app.mount('#app')
