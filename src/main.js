import { createApp } from 'vue'
import './style.scss'
import 'primevue/resources/primevue.min.css'



// import 'primevue/resources/themes/saga-blue/theme.css';


import App from './App.vue'
import router from './router/router'
import PrimeVue from 'primevue/config'
import store from './store/store'
import io from 'socket.io-client'

import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import FileUpload from 'primevue/fileupload';
import Skeleton from 'primevue/skeleton';
import Button from 'primevue/button';
import Tooltip from 'primevue/tooltip';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import ColumnGroup from 'primevue/columngroup';   
import Row from 'primevue/row';

const app = createApp(App)
const socket = io(import.meta.env.VITE_API_URL)
app.provide('socket', socket)

app.use(router)
app.use(store)
app.use(PrimeVue, {ripple: true})
// app.use(PrimeVue, {
//     locale: {
//         firstDayOfWeek: 1,
//         dayNames: [
//           "Domingo",
//           "Lunes",
//           "Martes",
//           "Miércoles",
//           "Jueves",
//           "Viernes",
//           "Sábado"
//         ],
//         dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
//         dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
//         monthNames: [
//           "Enero",
//           "Febrero",
//           "Marzo",
//           "Abril",
//           "Mayo",
//           "Junio",
//           "Julio",
//           "Agosto",
//           "Septiembre",
//           "Octubre",
//           "Noviembre",
//           "Diciembre"
//         ],
//         monthNamesShort: [
//           "Ene",
//           "Feb",
//           "Mar",
//           "Abr",
//           "May",
//           "Jun",
//           "Jul",
//           "Ago",
//           "Sep",
//           "Oct",
//           "Nov",
//           "Dic"
//         ],
//         today: "Hoy",
//         clear: "Borrar",
//         weekHeader: "Sm"
//       }
// });

app.component('Dropdown', Dropdown)
app.component('MultiSelect', MultiSelect)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('FileUpload', FileUpload)
app.component('Skeleton', Skeleton)
app.component('Button', Button)
app.directive('tooltip', Tooltip);
app.component('Calendar', Calendar);
app.component('Checkbox', Checkbox);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.mount('#app')
