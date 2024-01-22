<script setup>
import VueApexCharts from "vue3-apexcharts";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import ICalendar from "../icons/ICalendar.vue";
const store = useStore();
const selectedEstado = ref(new Date());
const selectedColumns = ref([
  { title: "Ton", field: "ton" },
  { title: "Ley Ag", field: "ley_ag" },
]);
const data = computed(() => {
  return store.state.dataFilterTable;
});

const leyes = [
  { title: "Ton", field: "ton" },
  { title: "Tonh", field: "tonh" },
  { title: "Ley Ag", field: "ley_ag" },
  { title: "Ley Fe", field: "ley_fe" },
  { title: "Ley Mn", field: "ley_mn" },
  { title: "Ley Pb", field: "ley_pb" },
  { title: "Ley Zn", field: "ley_zn" },
];

const series = [
  {
    name: "Income",
    type: "column",
    data: [1093, 2500, 2500, 1500, 2500, 2800, 3800, 4600],
  },
  {
    name: "Cashflow",
    type: "column",
    data: [1021, 3000, 3100, 4000, 4100, 4900, 6500, 8500],
  },
  {
    name: "Revenue",
    type: "line",
    data: [3000, 2900, 6700, 6600, 7400, 8500, 9000, 8800],
  },
];

const chartOptions = {
  chart: {
    height: 350,
    type: "line",
    stacked: false,
    fontFamily: "Saira",
    margin: 0,
    padding: 0,
  },
  plotOptions: {
    bar: {
      borderRadius: 10, // Radio de esquina para las barras
      borderWidth: 1, // Ancho del borde de las barras
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: false,
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
  },
  yaxis: {
    labels: {
      style: {
        colors: "#6e6d7a",
        fontSize: "12px",
      },
    },
  },
  legend: {
    show: false, // Ocultar la leyenda
  },
  grid: {
    show: true,
    borderColor: "#d0d0d0",
    strokeWidth: 1,
    position: "back",
  },
};
</script>

<template>
  <div class="graphic-dash">
    <div class="g-dash-header">
      <div class="g-d-header-title">
        <h3><strong>Análisis</strong> (tiempo real)</h3>
      </div>
      <div class="g-d-header-btns">
        <div>
          <Calendar
            v-model="selectedEstado"
            view="month"
            dateFormat="mm/yy"
            aria-placeholder="mm/yy"
            showIcon
            iconDisplay="input"
          >
            <template #inputicon="{ clickCallback }">
              <ICalendar />
            </template>
          </Calendar>
        </div>
        <div>
          <MultiSelect
            v-model="selectedColumns"
            :options="leyes"
            :selectionLimit="2"
            optionLabel="title"
            display="chip"
          />
        </div>
        <div>
          <button class="btn-graficar">Graficar</button>
        </div>
      </div>
    </div>
    <div class="g-dash-body">
      <div id="chart">
        <VueApexCharts
          type="line"
          height="180"
          :options="chartOptions"
          :series="series"
        />
      </div>
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
  border: 1px solid var(--grey-light-2);
  padding: 2rem 2rem 0.5rem 2rem;

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
