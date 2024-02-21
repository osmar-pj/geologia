<script setup>
import { onMounted, ref, watchEffect } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useStore } from "vuex";
import ICalendar from "../icons/ICalendar.vue";

const url = import.meta.env.VITE_API_URL;
const props = defineProps(["stage", "mining"]);
const store = useStore();
const buttonClicked = ref(false);
const selectedEstado = ref(new Date());

const analysisData = ref(null);
const graficData = ref(null);

let today = new Date();
let month = today.getMonth();
let year = today.getFullYear();
let prevMonth = month < 6 ? 12 - (6 - month) : month - 6;
let prevYear = month < 6 ? year - 1 : year;
const minDate = ref(new Date());
const maxDate = ref(new Date());
minDate.value.setMonth(prevMonth);
minDate.value.setFullYear(prevYear);

const selectedDomain = ref(null);
const domains = ref([
  { name: "Ag/Alabandita" },
  { name: "Ag/Carbonatos" },
  { name: "Polimetálico" },
]);

const selectedCategorie = ref(null);
const categories = ref([
  { name: "Categoria1" },
  { name: "Categoria2" },
  { name: "Categoria3" },
]);

onMounted(async () => {
  await handleGraphic();
});

 const handleGraphic = async () => {

  console.log("Feeding",selectedEstado.value.getTime())
   try {  
     buttonClicked.value = true;
     const response = await fetch(
       `${url}/analysis?ts=${selectedEstado.value.getTime()}&mining=${
         props.mining
       }&stage=${props.stage}&now=${new Date().getTime()}`,
       {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
         },
       }
     );

     const result = await response.json();
    
     if (result.status === true) {
       buttonClicked.value = false;
     } else {
       buttonClicked.value = false;
     }

     analysisData.value = result.meta;
     graficData.value = [
       {
         name: "Ley Ag Ejec.",
         type: "line",
         data: result.data.map((item) => {
           return {
             x: new Date(item.timestamp * 1000),
             y: item.Ag,
           };
         }),
       },
       {
         name: "Ley Ag Prog.",
         type: "line",
         data: result.data.map((item) => {
           return {
             x: new Date(item.timestamp * 1000),
             y: item.ley_prog,
           };
         }),
       },
       {
         name: "Tonelaje Ejec.",
         type: "column",
         data: result.data.map((item) => {
           return {
             x: new Date(item.timestamp * 1000),
             y: item.tonh,
           };
         }),
       },
       {
         name: "Tonelaje Prog.",
         type: "column",
         data: result.data.map((item) => {
           return {
             x: new Date(item.timestamp * 1000),
             y: item.ton_prog,
           };
         }),
       },
     ];
     // store.dispatch("data_analysis", result.data);
   } catch (error) {
     console.error("Error al actualizar:", error);
   }
 };

 watchEffect(() => {
   handleGraphic();
 });

const chartOptions = {
  chart: {
    type: "line",
    id: "li",
    // stacked: false,
    fontFamily: "Rubik",
    margin: 0,
    padding: 0,
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [0, 1],
    formatter: (val) => {
      if (val === null) {
        return "";
      } else {
        return val.toFixed(2);
      }
    },
  },
  colors: ["rgb(255, 69, 96)", "#00B050", "rgb(0, 143, 251)", "#66C7F4"],

  stroke: {
    width: [1, 1, 1],
  },
  plotOptions: {
    bar: {
      borderRadius: 1.5,
      borderWidth: 1,
    },
  },

  xaxis: {
    lines: {
      show: false,
    },
    labels: {
      style: {
        colors: "#6e6d7a",
        fontSize: "12px",
      },
    },
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    type: "datetime",
  },
  yaxis: [
    {
      seriesName: "Ley de Ag",
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      title: {
        text: "Ley Ag",
      },
      labels: {
        formatter: (val) => {
          if (val === null) {
            return "";
          } else {
            return val.toFixed(0);
          }
        },
      },
    },
    {
      show: false,
    },
    {
      opposite: true,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      title: {
        text: "Tonelaje",
      },
      min: 0,
      max: 4000,
      labels: {
        formatter: (val) => {
          if (val === null) {
            return "";
          } else {
            return val.toFixed(0);
          }
        },
      },
    },
    {
      show: false,
      min: 0,
      max: 4000,
    },
  ],
  tooltip: {
    enabled: true, // Habilitar los tooltips
    shared: false, // Mostrar un tooltip por punto
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      // Obtener el nombre y el valor del punto de datos
      const seriesName = w.config.series[seriesIndex].name;
      const value = series[seriesIndex][dataPointIndex];

      // Construir el contenido del tooltip personalizado
      return (
        '<div class="custom-tooltip">' +
        '<span class="tooltip-name">' +
        seriesName +
        "</span>" +
        '<span class="tooltip-value">' +
        value.toFixed(2) +
        "</span>" +
        "</div>"
      );
    },
  },
  grid: {
    show: true,
    borderColor: "#e6e6e6",
    strokeWidth: 0.5,
    position: "back",
  },
  stroke: {
    width: 1.5,
  },
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "left",
  },
  markers: {
    size: 5,
    strokeWidth: 1,
  },
};

const DataToday = ref({
  NOCHE: {
    percent: 20, // Porcentaje de algo durante la noche
  },
  DIA: {
    percent: 40, // Porcentaje de algo durante el día
  },
});
</script>

<template>
  <div class="graphic-dash">
    <!-- {{ series }} -->
    <div class="g-dash-header">
      <div class="g-d-header-title">
        <h3>
          <strong> {{ props.ruta }} </strong>
          (Análisis)
        </h3>
      </div>
      <div class="g-d-header-btns">
        <div>
          <Dropdown
            class="p-dropdown"
            v-model="selectedCategorie"
            :options="categories"
            optionLabel="name"
            optionValue="name"
            placeholder="Seleccionar"
          />
        </div>
        <div>
          <Dropdown
            class="p-dropdown"
            v-model="selectedDomain"
            :options="domains"
            optionLabel="name"
            optionValue="name"
            placeholder="Seleccionar"
          />
        </div>
        <div>
          <Calendar
            v-model="selectedEstado"
            view="month"
            :minDate="minDate"
            :maxDate="maxDate"
            :manualInput="false"
            dateFormat="mm/yy"
            aria-placeholder="mm/yy"
            showIcon
            iconDisplay="input"
            :yearNavigator="true"
          >
            <template #inputicon="{ clickCallback }">
              <ICalendar />
            </template>
          </Calendar>
        </div>
      </div>
      <!-- <div class="g-d-header-totales">
        <div>
          <div class="circular-graf">
            <span class="donut-title">Tonelada</span>
            <span class="donut-total"
              >{{ analysisData ? analysisData.total_ton.toFixed(2) : 0 }}
            </span>
            <div
              class="semi-donut margin semi-tonelada"
              :style="{
                '--percentage':
                  DataToday && DataToday.NOCHE ? DataToday.NOCHE.percent : 0,
                '--fill': '#FF3D00',
              }"
            ></div>
          </div>
          <div class="values-donut">
            <span class="hour-left">0,00</span>
            <span class="hour-right">{{
              analysisData ? analysisData.total_ton_prog.toFixed(2) : 0
            }}</span>
          </div>
        </div>
        <div>
          <div class="circular-graf">
            <span class="donut-title"> Ley</span>
            <span class="donut-total"
              >{{ analysisData ? analysisData.aver_ley.toFixed(2) : 0 }}
            </span>
            <div
              class="semi-donut semi-ley"
              :style="{
                '--percentage':
                  DataToday && DataToday.NOCHE ? DataToday.NOCHE.percent : 0,
                '--fill': '#FF3D00',
              }"
            ></div>
          </div>
          <div class="values-donut">
            <span class="hour-left">0,00</span>
            <span class="hour-right">{{
              analysisData ? analysisData.aver_ley_prog.toFixed(2) : 0
            }}</span>
          </div>
        </div>
      </div> -->
    </div>
    <div class="g-dash-body">
      <template v-if="buttonClicked">
        <Skeleton height="270px"></Skeleton>
      </template>
      <template v-else>
        <div id="chart">
          <VueApexCharts
            height="250"
            :options="chartOptions"
            :series="graficData"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.custom-tooltip {
  background-color: var(--black) !important;
  border: 1px solid transparent !important;
  padding: 8px 10px !important;
  border-radius: 5px !important;
  margin: 0 !important;
}

.custom-tooltip span {
  display: block !important;
  margin-bottom: 5px !important;
  font-weight: normal !important;
  color: var(--white) !important;
  font-size: clamp(6px, 8vw, 12px);
}
.graphic-dash {
  width: 100%;
  color: var(--black);
  font-size: clamp(6px, 8vw, 14px);
  line-height: 0.7rem;
  font-weight: 300;
  border-collapse: collapse;
  white-space: nowrap;
  padding-top: 1rem;
  border-radius: var(--br-xxl);
  border: 1px solid var(--grey-light-22);
  padding: 2rem 2rem 0.5rem 2rem;
  background-color: var(--white);
  .g-dash-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding-bottom: 1rem;
    .g-d-header-title {
      display: flex;
      h3 {
        color: var(--grey-light-3);
        font-size: clamp(5px, 8vw, 12px);
        font-weight: 400;
        strong {
          color: var(--black);
          font-size: clamp(5px, 8vw, 16px);
          font-weight: 500;
        }
      }
    }
    .g-d-header-btns {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .g-d-header-totales {
      display: flex;

      gap: 1rem;
      .g-d-h-totales-item {
        span {
          font-size: clamp(6px, 8vw, 12px);
          line-height: 0.6rem;
          font-weight: 500;
          color: var(--grey-light-3);
        }
        h4 {
          padding-top: 0.5rem;
          font-size: clamp(6px, 8vw, 14px);
          line-height: 0.8rem;
          font-weight: 500;
        }
      }
    }
  }
  .g-dash-body {
  }
}

.apexcharts-toolbar {
  display: none !important;
}

// ===================Semi Donut Chart model-1========================

.circular-graf {
  height: 60px;
  width: 130px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  .donut-total {
    position: absolute;
    z-index: 9;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    font-size: clamp(6px, 8vw, 14px);
    line-height: 0.6rem;
    font-weight: 550;
    color: var(--black);
  }
  .donut-title {
    position: absolute;
    z-index: 9;
    top: 31px;
    left: 50%;
    transform: translateX(-50%);
    font-size: clamp(6px, 8vw, 10px);
    line-height: 0.6rem;
    font-weight: 400;
    color: var(--grey-1);
  }
}

.semi-donut {
  --percentage: 0;
  width: 130px;
  height: 60px;
  position: relative;
  font-size: 22px;
  font-weight: 600;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
  &:after {
    content: "";
    width: 130px;
    height: 130px;
    border: 17px solid;
    position: absolute;
    border-radius: 50%;
    left: 0;
    top: 0;
    box-sizing: border-box;
    transform: rotate(calc(1deg * (-45 + var(--percentage) * 1.8)));
    animation: fillAnimation 1s ease-in;
  }
}

.semi-ley {
  &:after {
    border-color: var(--grey-light-22) var(--grey-light-22) rgb(255, 69, 96)
      rgb(255, 69, 96);
  }
}

.semi-tonelada {
  &:after {
    border-color: var(--grey-light-22) var(--grey-light-22) rgb(0, 143, 251)
      rgb(0, 143, 251);
  }
}

.values-donut {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
}
.hour-left,
.hour-right {
  font-size: clamp(6px, 8vw, 10px);
  line-height: 0.6rem;
  font-weight: 500;
  color: var(--black);
}

.gaTwo {
  transform: rotate(180deg);

  &:after {
    border-color: rgba(0, 0, 0, 0.15) rgba(0, 0, 0, 0.15) #f3bd5a #f3bd5a !important;
  }
}
</style>
