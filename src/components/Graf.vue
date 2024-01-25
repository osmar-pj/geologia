<script setup>
import VueApexCharts from "vue3-apexcharts";
import { ref, onMounted, watchEffect, computed } from "vue";
import { useStore } from "vuex";
import ICalendar from "../icons/ICalendar.vue";

const url = import.meta.env.VITE_API_URL;
const props = defineProps(["ruta"]);
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

const series = computed(() => {
  return store.getters.get_data_analysis;
});

graficData.value = (() => {
  if (graficData.value && graficData.value > 0) {
    const dataAg = graficData.value.map((i) => ({
      x: new Date(i.timestamp * 1000),
      y: i.Ag,
    }));
    const dataLey_prog = graficData.value.map((i) => ({
      x: new Date(i.timestamp * 1000),
      y: i.ley_prog,
    }));
    const tonh = graficData.value.map((i) => ({
      x: new Date(i.timestamp * 1000),
      y: i.tonh,
    }));
    const ton_prog = graficData.value.map((i) => ({
      x: new Date(i.timestamp * 1000),
      y: i.ton_prog,
    }));

    const series = [
      { name: "Ley de Ag", type: "line", data: dataAg },
      { name: "Ley de Ag Prog.", type: "line", data: dataLey_prog },
      { name: "Tonelada", type: "column", data: tonh },
      { name: "Tonelada Prog", type: "column", data: ton_prog },
    ];
    
    return series;
  } else {
    return [];
  }
})();

console.log(graficData.series)

onMounted(async () => {
  await handleGraphic();
});

const handleGraphic = async () => {
  try {
    buttonClicked.value = true;
    const response = await fetch(
      `${url}/analysis?ts=${selectedEstado.value.getTime()}&mining=${
        props.ruta
      }`,
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
      console.log("error");
      buttonClicked.value = false;
    }

    analysisData.value = result.meta;
    graficData.value = result.data;
    store.dispatch("data_analysis", result.data);
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
    fontFamily: "Saira",
    margin: 0,
    padding: 0,
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [0],
    formatter: (val) => {
      if (val === null) {
        return "";
      } else {
        return val.toFixed(2);
      }
    },
  },
  colors: ["rgb(255, 69, 96)", "#C5EDAC", "rgb(0, 143, 251)", "#66C7F4"],

  stroke: {
    width: [4, 4, 4],
  },
  plotOptions: {
    bar: {
      borderRadius: 5,
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
    {{ series }}
    <div class="g-dash-header">
      <div class="g-d-header-title">
        <h3>
          <strong>Cumplimiento de Producción {{ props.ruta }} </strong>
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
            manualInput="false"
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
      <div class="g-d-header-totales">
        <div class="g-d-h-totales-item">
          <span>Programado</span>
          <h4>
            Ley/ {{ analysisData ? analysisData.aver_ley_prog.toFixed(2) : 0 }}
          </h4>
          <h4>
            Tonelada/
            {{ analysisData ? analysisData.total_ton_prog.toFixed(2) : 0 }}
          </h4>
        </div>
        <div class="g-d-h-totales-item">
          <span>Ejecutado</span>
          <h4>
            Ley/ {{ analysisData ? analysisData.aver_ley.toFixed(2) : 0 }}
          </h4>
          <h4>
            Tonelada/ {{ analysisData ? analysisData.total_ton.toFixed(2) : 0 }}
          </h4>
        </div>
      </div>
    </div>
    <div class="g-dash-body">
      <template v-if="buttonClicked">
        <Skeleton height="270px"></Skeleton>
      </template>
      <template v-else>
        <div id="chart">
          <VueApexCharts
            height="270"
            :options="chartOptions"
            :series="series"
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
  padding: 5px !important;
  border-radius: 3px !important;
  margin: 0 !important;
}

.custom-tooltip span {
  display: block !important;
  margin-bottom: 5px !important;
  font-weight: 500 !important;
  color: var(--white) !important;
  font-size: clamp(6px, 8vw, 12px);
}
.graphic-dash {
  width: 100%;
  color: var(--black);
  font-size: clamp(6px, 8vw, 14px);
  line-height: 0.7rem;
  font-weight: 500;
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
        font-weight: 500;
        strong {
          color: var(--black);
          font-size: clamp(5px, 8vw, 18px);
          font-weight: 600;
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
</style>
