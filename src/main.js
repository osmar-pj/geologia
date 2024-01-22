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
import Button from 'primevue/button';
import Tooltip from 'primevue/tooltip';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';

const app = createApp(App)

app.use(router)
app.use(store)
app.use(PrimeVue, {ripple: true})
app.use(PrimeVue, {
    locale: {
        firstDayOfWeek: 1,
        dayNames: [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado"
        ],
        dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
        monthNames: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre"
        ],
        monthNamesShort: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic"
        ],
        today: "Hoy",
        clear: "Borrar",
        weekHeader: "Sm"
      }
});

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
app.mount('#app')
