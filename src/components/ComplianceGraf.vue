<script setup>
import { onMounted, ref, watchEffect } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useStore } from "vuex";
import ICalendar from "../icons/ICalendar.vue";
import { formatFixed } from "../libs/utils";

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

onMounted(async () => {
  await handleGraphic();
});

const handleGraphic = async () => {
 
  try {
    buttonClicked.value = true;
    const response = await fetch(
      `${url}/analysis?ts=${selectedEstado.value.getTime()}&mining=${
        props.mining
      }&stage=${props.stage}`,
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
            y: item.ley_ag,
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
        type: "line",
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
    fontFamily: "Sora",
    margin: 0,
    padding: 0,
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [0, 1, 3],
    formatter: (val) => {
      if (val === null) {
        return "";
      } else {
        return val.toFixed(2);
      }
    },
  },
  colors: [
    "rgb(255, 69, 96)",
    "#00B050",
    "rgb(0, 143, 251)",
    "rgba(254, 176, 25, 0.85)",
  ],

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
</script>

<template>
  <div class="graphic-dash">
    <!-- {{ series }} -->
    <div class="g-dash-header">
      <div class="g-d-header-title">
        <h3>
          <strong> Stock {{ props.mining }} </strong>
          (Análisis)
        </h3>
      </div>
      <div class="g-d-header-btns">
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
    </div>
    <div class="g-dash-body">
      <div class="g-d-body-bar">
        <template v-if="buttonClicked">
          <Skeleton height="270px"></Skeleton>
        </template>
        <template v-else>
          <div id="chart">
            <VueApexCharts
              height="100%"
              :options="chartOptions"
              :series="graficData"
            />
          </div>
        </template>
      </div>
      <div class="g-d-body-totales">
        <div class="g-b-totals-item">
          <div class="circular-graf">
            <!-- <span class="donut-title"></span> -->
            <span class="donut-total">
              {{
                analysisData && analysisData.percent_ejec
                  ? analysisData.percent_ejec.toFixed(1)
                  : 0
              }}
              <small>%</small>
            </span>
            <div
              class="semi-donut margin semi-tonelada"
              :style="{
                '--percentage':
                  analysisData && analysisData.percent_ejec
                    ? analysisData.percent_ejec.toFixed(2)
                    : 0,
                '--fill': '#FF3D00',
              }"
            ></div>
            <div
              class="needle"
              :style="{
                transform:
                  'rotate(calc(((' +
                  (analysisData && analysisData.percent_prog
                    ? analysisData.percent_prog.toFixed(2)
                    : 0) +
                  ' - 50) * 1.8deg))',
              }"
            ></div>
          </div>
          <div class="values-donut">
            <span class="hour-left">0,00</span>
            <span class="hour-right">
              {{
                formatFixed(
                  analysisData && analysisData.total_ton_prog
                    ? analysisData.total_ton_prog
                    : 0
                )
              }}
            </span>
          </div>
          <div class="ton-total">
            <span
              >{{
                formatFixed(
                  analysisData && analysisData.total_ton_ejec_cumm
                    ? analysisData.total_ton_ejec_cumm
                    : 0
                )
              }}
            </span>
            <small> ton</small>
          </div>
        </div>
        <div class="g-totals-item-bar">
          <div class="bar-container">
            <span class="bar-title">Zn %</span>
            <div
              class="bar-ley L-ag"
              :style="{
                '--percentage-total': 89,
                '--percentage-prog': 97,
                '--fill': '#FF3D00',
              }"
            >
              <span class="b-value">5.69</span>
            </div>
          </div>
          <div class="bar-container">
            <span class="bar-title">Ag %</span>
            <div
              class="bar-ley L-ag"
              :style="{
                '--percentage-total': 76,
                '--percentage-prog': 95,
                '--fill': '#FF3D00',
              }"
            >
              <span class="b-value">5.69</span>
            </div>
          </div>
          <div class="bar-container">
            <span class="bar-title">Pb %</span>
            <div
              class="bar-ley L-ag"
              :style="{
                '--percentage-total': 34,
                '--percentage-prog': 98,
                '--fill': '#FF3D00',
              }"
            >
              <span class="b-value">5.69</span>
            </div>
          </div>
          <div class="bar-container">
            <span class="bar-title">Cu %</span>
            <div
              class="bar-ley L-ag"
              :style="{
                '--percentage-total': 20,
                '--percentage-prog': 98,
                '--fill': '#FF3D00',
              }"
            >
              <span class="b-value">5.69</span>
            </div>
          </div>
        </div>
      </div>
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
  padding: 2rem 2rem 2rem 2rem;
  background-color: var(--white);
  flex: 1 1;
  display: flex;
  flex-direction: column;
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
        text-transform: capitalize;
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
    flex: 1 1;
    display: flex;
    align-items: stretch;
    .g-d-body-bar{
      flex: 1 1;
      display: flex;
    
    }
  }
  .g-d-body-totales{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    .g-totals-item-bar{
      display: flex;
      flex-direction: column;
      gap: .5rem;
    }
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
    z-index: 3;
    bottom: 0;
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
.ton-total {
  text-align: center;
  padding-top: 1rem;
  span {
    font-size: clamp(6px, 8vw, 14px);
    line-height: 0.6rem;
    font-weight: 550;
    color: var(--black);
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
    border: 25px solid;
    position: absolute;
    border-radius: 50%;
    left: 0;
    top: 0;
    box-sizing: border-box;
    transform: rotate(calc(1deg * (-45 + var(--percentage) * 1.8)));
    animation: fillAnimation 1s ease-in;
    z-index: 3;
  }
}

.needle {
  width: 2px;
  height: 65px; /* Ajusta la longitud de la línea según sea necesario */
  background-color: #ff3d00; /* Ajusta el color según sea necesario */
  position: absolute;
  bottom: 0;
  left: 50%;
  transform-origin: bottom;
  z-index: 2;
  background-color: white;
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

#chart {
  flex: 1 1;
}

.bar-container {
  display: flex;
  flex-direction: column;

  .bar-title {
    padding-bottom: 0.3rem;
    text-align: center;
    font-size: clamp(6px, 8vw, 11px);
    line-height: 0.6rem;
    font-weight: 550;
    width: 100%;
  }
}
.bar-ley {
  --percentage-total: 0;
  --percentage-prog: 0;
  position: relative;
  margin: 0 auto;
  width: 130px;
  height: 20px;
  border-radius: 5px;
  background-color: var(--grey-light-22);
  &::after {
    content: "";
    animation: porc3 1.5s ease-in-out forwards;
    position: absolute;
    height: 100%;
    border-radius: 5px;
    width: calc(var(--percentage-total) * 1%);
    background: #5d95ff;
  }
  &::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 2px;
    height: 25px;
    z-index: 4;
    left: calc(var(--percentage-prog) * 1%);
    top: 50%;
    transform: translateY(-50%);
    background: var(--black);
  }
  .b-value {
    position: absolute;
    top: 50%;
    left: 10%;
    z-index: 3;
    transform: translateY(-50%);
    font-size: clamp(6px, 8vw, 11px);
    line-height: 0.8rem;
    font-weight: 550;
  }
}

// .L-ag::after {

//   --porcentaje-finalizado: 80%;
// }
// .L-ag::before {

//   --porcentaje-finalizado: 80%;
// }

// @keyframes porc3 {
//   0% {
//     width: 0%;
//   }
//   55% {
//     width: 75%;
//   }
//   100% {
//     width: var(--porcentaje-finalizado);
//   }
// }
</style>
