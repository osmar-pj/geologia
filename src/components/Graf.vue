<script setup>
import VueApexCharts from "vue3-apexcharts";
import { ref, onMounted, watchEffect, computed } from "vue";
import { useStore } from "vuex";
import ICalendar from "../icons/ICalendar.vue";

const url = import.meta.env.VITE_API_URL;

const store = useStore();
const buttonClicked = ref(false);
const selectedEstado = ref(new Date());
const selectedColumns = ref("YUMPAG");
const mining = ["YUMPAG", "UCHUCCHACUA"];

const series = computed(() => {
  return store.getters.get_data_analysis;
});

onMounted(async () => {
  await handleGraphic();
});

const handleGraphic = async () => {
  try {
    buttonClicked.value = true;
    const response = await fetch(
      `${url}/analysis?ts=${selectedEstado.value.getTime()}&mining=${
        selectedColumns.value
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
    console.log("result", result.data)
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
    height: 350,
    type: "line",
    id: "li",
    // stacked: false,
    fontFamily: "Saira",
    margin: 0,
    padding: 0,
  },
  dataLabels: {
    enabled: false,
  },
  colors: ['rgb(0, 143, 251);', '#C5EDAC', '#66C7F4'],

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
    },
    {
      show: false
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
      max: 4000
    },
    {
      show: false,
      min: 0,
      max: 4000
    }
  ],
  tooltip: {
    shared: false,
    intersect: true,
    x: {
      show: false,
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
    <div class="g-dash-header">
      <div class="g-d-header-title">
        <h3><strong>Análisis</strong> (tiempo real)</h3>
      </div>
      <div
        class="g-d-header-btns"
        :style="{
          userSelect: buttonClicked ? 'none' : 'auto',
          pointerEvents: buttonClicked ? 'none' : 'auto',
        }"
      >
        <div>
          <Calendar
            v-model="selectedEstado"
            id="spanish"
            :locale="es"
            view="month"
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
        <div>
          <Dropdown
            v-model="selectedColumns"
            :options="mining"
            display="chip"
          />
        </div>
      </div>
    </div>
    <div class="g-dash-body">
      <template v-if="buttonClicked">
        <Skeleton height="220px"  ></Skeleton>
      </template>
      <template v-else>
        <div id="chart">
          <VueApexCharts
            height="220"
            :options="chartOptions"
            :series="series"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
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
    flex-wrap: wrap;
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
  }
  .g-dash-body {
  }
}

.p-input-icon-left > i,
.p-input-icon-left > svg,
.p-input-icon-right > i,
.p-input-icon-right > svg {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  margin-top: 0;
  left: 17px;
  fill: transparent;
  width: 1.4rem;
  height: 1.4rem;
}

.p-calendar {
  position: relative;
}

.p-calendar .p-inputtext {
  padding: 10px 20px 10px 50px;
  width: 150px;
}
.apexcharts-toolbar {
  display: none !important;
}
</style>
