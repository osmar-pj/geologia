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
    console.log(analysisData.value);
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
            y: item.ley_ag_prog,
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

const SendValues = async () => {
  store.commit("getValuesPDF", {
    ts: selectedEstado.value.getTime(),
    mining: props.mining,
    stage: props.stage,
  });
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
    enabledOnSeries: [0, 1, 3, 4],
    formatter: (val) => {
      if (val === null) {
        return "";
      } else {
        return val.toFixed(2);
      }
    },
  },
  colors: ["#00a000", "#88db08", "#008f8f", "#11c7c6"],

  stroke: {
    width: [1, 1, 1],
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
        formatter: function (value) {
          // Comprueba si el valor es nulo o vacío
          if (value == null || value === "") {
            return null; // Devuelve null si el valor es nulo o vacío
          }

          let val = Math.abs(value); // Toma el valor absoluto del número
          val = (val / 1000).toFixed(0) + "k"; // Divide el valor por 1000 y añade "K" al final

          return val; // Devuelve el valor formateado como una cadena de texto
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
    curve: "straight",
    dashArray: [0, 8],
  },
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "bottom",
  },
  markers: {
    size: 1,
    strokeWidth: 5,
  },
};
</script>

<template>
  <div class="graphic-dash">
    <!-- {{ series }} -->

    <div class="g-d-body-bar">
      <div class="g-dash-header">
        <div class="g-d-header-title">
          <h3>
            <strong> {{ props.mining }} </strong>
            (Análisis)
          </h3>
          <!-- <button class="btn-success" @click.prevent="SendValues()">
              Guardar valores para PDF
            </button> -->
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
      <div class="g-b-totals-item item-semicircle">
        <div class="ton-total">
          <h5>Tonelaje</h5>
          <span
            >{{
              formatFixed(
                analysisData && analysisData.ton.total_ton_ejec_cumm
                  ? analysisData.ton.total_ton_ejec_cumm
                  : 0
              )
            }}
          </span>
        </div>
        <div class="circular-graf">
          <div class="values-donut">
            <h5>
              <strong>{{
                analysisData && analysisData.ton.percent_ejec
                  ? analysisData.ton.percent_ejec.toFixed(1)
                  : 0
              }}</strong>
              <small> %</small>
            </h5>
            <span class="hour-right">
              {{
                formatFixed(
                  analysisData && analysisData.ton.total_ton_prog
                    ? analysisData.ton.total_ton_prog
                    : 0
                )
              }}
            </span>
          </div>
          <div
            class="semi-donut semi-tonelada"
            :style="{
              '--percentage':
                analysisData && analysisData.ton.percent_ejec
                  ? analysisData.ton.percent_ejec.toFixed(2)
                  : 0,
              '--fill': '#00a000',
            }"
          ></div>
          <div
            class="needle"
            :style="{
              transform:
                'rotate(calc(((' +
                (analysisData && analysisData.ton.percent_prog
                  ? analysisData.ton.percent_prog.toFixed(2)
                  : 0) +
                ' - 50) * 1.8deg))',
            }"
          ></div>
        </div>
      </div>
      <div class="g-totals-item-bar">
        <div class="bar-container">
          <div class="bar-value">
            <span>Ag %</span>
            <h5>
              <strong>{{
                formatFixed(
                  analysisData && analysisData.ley_ag.total_ley_prog
                    ? analysisData.ley_ag.total_ley_prog
                    : 0
                )
              }}</strong>
            </h5>
          </div>
          <div
            class="bar-ley L-ag"
            :style="{
              '--percentage-total':
                analysisData && analysisData.ley_ag.percent_ejec
                  ? analysisData.ley_ag.percent_ejec.toFixed(2)
                  : 0,
              '--percentage-prog':
                analysisData && analysisData.ley_ag.percent_prog
                  ? analysisData.ley_ag.percent_prog.toFixed(2)
                  : 0,
              '--background': '#00a000',
            }"
          ></div>
        </div>

        <div class="bar-container">
          <div class="bar-value">
            <span>Fe %</span>
            <h5>
              <strong>{{
                formatFixed(
                  analysisData && analysisData.ley_fe.total_ley_prog
                    ? analysisData.ley_fe.total_ley_prog
                    : 0
                )
              }}</strong>
            </h5>
          </div>
          <div
            class="bar-ley L-ag"
            :style="{
              '--percentage-total':
                analysisData && analysisData.ley_fe.percent_ejec
                  ? analysisData.ley_fe.percent_ejec.toFixed(2)
                  : 0,
              '--percentage-prog':
                analysisData && analysisData.ley_fe.percent_prog
                  ? analysisData.ley_fe.percent_prog.toFixed(2)
                  : 0,
              '--background': '#018FFB',
            }"
          ></div>
        </div>
        <div class="bar-container">
          <div class="bar-value">
            <span>Mn %</span>
            <h5>
              <strong>{{
                formatFixed(
                  analysisData && analysisData.ley_mn.total_ley_prog
                    ? analysisData.ley_mn.total_ley_prog
                    : 0
                )
              }}</strong>
            </h5>
          </div>
          <div
            class="bar-ley L-ag"
            :style="{
              '--percentage-total':
                analysisData && analysisData.ley_mn.percent_ejec
                  ? analysisData.ley_mn.percent_ejec.toFixed(2)
                  : 0,
              '--percentage-prog':
                analysisData && analysisData.ley_mn.percent_prog
                  ? analysisData.ley_mn.percent_prog.toFixed(2)
                  : 0,
              '--background': '#FF4560',
            }"
          ></div>
        </div>
        <div class="bar-container">
          <div class="bar-value">
            <span>Pb %</span>
            <h5>
              <strong>{{
                formatFixed(
                  analysisData && analysisData.ley_pb.total_ley_prog
                    ? analysisData.ley_pb.total_ley_prog
                    : 0
                )
              }}</strong>
            </h5>
          </div>
          <div
            class="bar-ley L-ag"
            :style="{
              '--percentage-total':
                analysisData && analysisData.ley_pb.percent_ejec
                  ? analysisData.ley_pb.percent_ejec.toFixed(2)
                  : 0,
              '--percentage-prog':
                analysisData && analysisData.ley_pb.percent_prog
                  ? analysisData.ley_pb.percent_prog.toFixed(2)
                  : 0,
              '--background': '#785DD0',
            }"
          ></div>
        </div>
        <div class="bar-container">
          <div class="bar-value">
            <span>Zn %</span>
            <h5>
              <strong>{{
                formatFixed(
                  analysisData && analysisData.ley_zn.total_ley_prog
                    ? analysisData.ley_zn.total_ley_prog
                    : 0
                )
              }}</strong>
            </h5>
          </div>
          <div
            class="bar-ley L-ag"
            :style="{
              '--percentage-total':
                analysisData && analysisData.ley_zn.percent_ejec
                  ? analysisData.ley_zn.percent_ejec.toFixed(2)
                  : 0,
              '--percentage-prog':
                analysisData && analysisData.ley_zn.percent_prog
                  ? analysisData.ley_zn.percent_prog.toFixed(2)
                  : 0,
              '--background': '#FAC338',
            }"
          ></div>
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
  flex: 1 1;
  display: flex;
  gap: 1rem;
  .g-d-body-bar {
    flex: 1 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: var(--br-xxl);
    border: 1px solid var(--grey-light-22);
    padding: 1.5rem;
    background-color: var(--white);
    .g-dash-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      padding-bottom: 0;
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
  }
  .g-d-body-totales {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    .g-totals-item-bar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border-radius: var(--br-xxl);
      border: 1px solid var(--grey-light-22);
      padding: 1.5rem;
      background-color: var(--white);
    }

    .item-semicircle {
      width: 100%;
      border-radius: var(--br-xxl);
      border: 1px solid var(--grey-light-22);
      padding: 1.5rem 1rem 0rem 1rem;
      background-color: var(--white);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
}

.apexcharts-toolbar {
  display: none !important;
}

// ===================Semi Donut Chart model-1========================

.circular-graf {
  height: 90px;
  width: 185px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  .values-donut {
    position: absolute;
    z-index: 2;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 8px;
    padding: 5px 10px;
    background-color: #d8f5c4;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: .1rem;
    .hour-right {
      font-size: clamp(6px, 8vw, 9.5px);
      line-height: 0.6rem;
      font-weight: 500;
      color: var(--black);
    }
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
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  span {
    font-size: clamp(6px, 8vw, 16px);
    line-height: 1.3rem;
    font-weight: 550;
    color: var(--black);
  }
  h5 {
    font-size: clamp(6px, 8vw, 9px);
    line-height: 0.6rem;
    color: var(--grey-light-3);
  }
}

.semi-donut {
  --percentage: 0;
  width: 185px;
  height: 90px;
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
    width: 185px;
    height: 185px;
    border: 28px solid;
    position: absolute;
    border-radius: 50%;
    left: 0;
    top: 0;
    box-sizing: border-box;
    transform: rotate(calc(1deg * (-45 + var(--percentage) * 1.8)));
    animation: fillAnimation 1s ease-in;
    z-index: 1;
    border-color: var(--grey-light-1) var(--grey-light-1) #008f8f #008f8f;
  }
}

.needle {
  width: 0;
  height: 93px; /* Ajusta la longitud de la línea según sea necesario */
  position: absolute;
  bottom: 0;
  left: 50%;
  transform-origin: bottom;
  z-index: 3;
  background-color: transparent; /* Ajusta el color según sea necesario */
  &::after {
    content: "";
    width: 1px;
    height: 28px;
    background-color: black;
    position: absolute;
    right: 0;
    top: 0;
  }
}

#chart {
  flex: 1 1;
}

// ===================BAR CONTAINER========================

.bar-container {
  display: flex;
  align-items: center;
  gap: 10px;

  .bar-ley {
    --percentage-total: 0;
    --percentage-prog: 0;
    --background: var(--grey-light-1);
    position: relative;
    margin: 0 auto;
    width: 130px;
    height: 25px;
    border-radius: 5px;
    background-color: var(--grey-light-1);
    overflow: hidden;
    &::after {
      content: "";
      animation: porc3 1.5s ease-in-out forwards;
      position: absolute;
      height: 100%;
      border-radius: 5px;
      width: calc(var(--percentage-total) * 1%);
      background: var(--background);
    }
    &::before {
      content: "";
      position: absolute;
      height: 100%;
      width: 1px;
      height: 30px;
      z-index: 2;
      left: calc(var(--percentage-prog) * 1%);
      top: 50%;
      transform: translateY(-50%);
      background: var(--black);
    }
  }
  .bar-value {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.1rem;
    width: 40px;
    height: 25px;
    span {
      font-size: clamp(6px, 8vw, 9px);
      line-height: 0.6rem;
      color: var(--grey-2);
    }
    h5 {
    }
  }
}
</style>
