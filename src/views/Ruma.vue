<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import BindRuma from "../components/BindRuma.vue";
import DeactivateRuma from "../components/DeactivateRuma.vue";
import Bind from "../icons/Bind.vue";
import IRuma from "../icons/IRuma.vue";
import IOption from "../icons/IOption.vue";

const store = useStore();
const formattedDate = ref("");
const showBindRuma = ref(false);
const showDeactivateRuma = ref(false);

const openBindRuma = () => {
  showBindRuma.value = true;
};
const openDeactivateRuma = (ruma_Id) => {
  showDeactivateRuma.value = true;
  store.state.rumaIdToDeactivate = ruma_Id;
};

onMounted(async () => {
  const options = {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const today = new Date();

  const weekday =
    today
      .toLocaleDateString("es-ES", { weekday: "long" })
      .charAt(0)
      .toUpperCase() +
    today.toLocaleDateString("es-ES", { weekday: "long" }).slice(1);

  formattedDate.value = `${weekday}, ${today
    .toLocaleDateString("es-ES", options)
    .replace(/\//g, ".")}`;

  await store.dispatch("ruma_total");
});

const dataRuma = computed(() => {
  return store.state.rumaTotal;
});

const data = [
  {
    ubication: "Cancha 1",
    cod_tableta: "--",
    tonh: 983.0,
    ley_ag: 6.6,
    tajo: ["AVANCE"],
    dominio: ["Ag\/Alabandita"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 1",
    cod_tableta: "2",
    tonh: 384.0,
    ley_ag: 4.2205832849,
    tajo: ["TJ 6608"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 1",
    cod_tableta: "6",
    tonh: 3396.0,
    ley_ag: 4.5244410798,
    tajo: [
      "TJ 6432 NE",
      "TJ 6614",
      "SN 6431-2",
      "TJ 6431-1",
      "TJ 6432-2",
      "AVANCE (sn 6431-1",
    ],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "259",
    tonh: 304.0,
    ley_ag: 2.93753,
    tajo: ["TJ 6488"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "260",
    tonh: 128.0,
    ley_ag: 8.2216833333,
    tajo: ["SN 6639"],
    dominio: ["Ag\/Carbonatos"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "263",
    tonh: 672.0,
    ley_ag: 3.2076961944,
    tajo: ["AVANCE"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "273",
    tonh: 640.0,
    ley_ag: 4.0049819583,
    tajo: ["TJ 6431-1"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "274",
    tonh: 320.0,
    ley_ag: 7.7127005556,
    tajo: ["TJ 6790"],
    dominio: ["Ag\/Carbonatos"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "276",
    tonh: 240.0,
    ley_ag: 6.7996711111,
    tajo: ["TJ 6618"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "277",
    tonh: 160.0,
    ley_ag: 7.49122,
    tajo: ["TJ 6618"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "278",
    tonh: 416.0,
    ley_ag: 8.1164481481,
    tajo: ["TJ 6790", "TJ 6618"],
    dominio: ["Ag\/Carbonatos", "Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "279",
    tonh: 400.0,
    ley_ag: 8.6204775,
    tajo: ["TJ 6618"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "280",
    tonh: 240.0,
    ley_ag: 6.1677777778,
    tajo: ["TJ 6618"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "281",
    tonh: 144.0,
    ley_ag: 5.1961802778,
    tajo: ["TJ 6431-1"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "282",
    tonh: 480.0,
    ley_ag: 5.2975613333,
    tajo: ["TJ 6618"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "285",
    tonh: 256.0,
    ley_ag: 6.2580042857,
    tajo: ["TJ 6618"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "286",
    tonh: 224.0,
    ley_ag: 5.757106,
    tajo: ["SN 6431-2"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "288",
    tonh: 240.0,
    ley_ag: 6.954998,
    tajo: ["TJ 6431-1"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "290",
    tonh: 248.0,
    ley_ag: 7.8184577778,
    tajo: ["TJ 6618"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "291",
    tonh: 232.0,
    ley_ag: 6.6330977778,
    tajo: ["SN 6431-2"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "299",
    tonh: 400.0,
    ley_ag: 4.3487103333,
    tajo: ["TJ 6431-1"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "30",
    tonh: 632.0,
    ley_ag: 7.5867787037,
    tajo: ["TJ 6790"],
    dominio: ["Ag\/Carbonatos"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "307",
    tonh: 200.0,
    ley_ag: 7.7968441667,
    tajo: ["AVANCE"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "309",
    tonh: 240.0,
    ley_ag: 4.1108375,
    tajo: ["TJ 6431-1-S"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "313",
    tonh: 320.0,
    ley_ag: 3.4639325,
    tajo: ["TJ 6431-1-S"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "314",
    tonh: 152.0,
    ley_ag: 8.2493116667,
    tajo: ["SN 6608-3 NE"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "315",
    tonh: 135.0,
    ley_ag: 2.8561966667,
    tajo: ["TJ 6431-1-S"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "316",
    tonh: 99.0,
    ley_ag: 8.8072433333,
    tajo: ["Avance  ( SN6608-3 NE)"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "317",
    tonh: 80.0,
    ley_ag: 3.7702942857,
    tajo: ["SN 6431-2"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "4",
    tonh: 1728.0,
    ley_ag: 3.3003652159,
    tajo: ["TJ 6432 NE"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha 2",
    cod_tableta: "GIVA",
    tonh: 8.0,
    ley_ag: 2.92699,
    tajo: ["TJ 6431"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "106",
    tonh: 207.48,
    ley_ag: 16.6437511905,
    tajo: ["AVANCE"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "129",
    tonh: 321.75,
    ley_ag: 16.4780444444,
    tajo: ["AVANCE"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "136",
    tonh: 496.0,
    ley_ag: 3.3184491667,
    tajo: ["TJ 6608"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "143",
    tonh: 323.69,
    ley_ag: 12.9597395833,
    tajo: ["TJ 400-2P"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "146",
    tonh: 679.18,
    ley_ag: 15.13668,
    tajo: ["TJ 500-2P"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "147",
    tonh: 1488.0,
    ley_ag: 3.0828888889,
    tajo: ["TJ 6488", "TJ 6432 NE"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "149",
    tonh: 677.59,
    ley_ag: 16.7568866667,
    tajo: ["TJ 400-2P"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "155",
    tonh: 517.85,
    ley_ag: 19.95275,
    tajo: ["TJ 400-1P Baja ley"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "162",
    tonh: 638.79,
    ley_ag: 31.3269375,
    tajo: ["AVANCE"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "163",
    tonh: 617.99,
    ley_ag: 21.8369764706,
    tajo: ["TJ 400-2P"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "166",
    tonh: 258.45,
    ley_ag: 24.1091428571,
    tajo: ["TJ 400-1P"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "167",
    tonh: 1376.73,
    ley_ag: 29.6111454545,
    tajo: ["AVANCE"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "168",
    tonh: 1359.28,
    ley_ag: 28.8621038194,
    tajo: ["AVANCE"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "169",
    tonh: 0.0,
    ley_ag: 0.0,
    tajo: ["AVANCE"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "195",
    tonh: 96.0,
    ley_ag: 3.727065,
    tajo: ["TJ 6609"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "20",
    tonh: 1456.0,
    ley_ag: 2.7370041979,
    tajo: ["AVANCE"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "203",
    tonh: 288.0,
    ley_ag: 3.5813616667,
    tajo: ["TJ 6609"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "212",
    tonh: 2424.0,
    ley_ag: 3.95,
    tajo: ["TJ 6432-1"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "215",
    tonh: 96.0,
    ley_ag: 3.8026666667,
    tajo: ["TJ 6614"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "23",
    tonh: 1144.0,
    ley_ag: 3.8040187037,
    tajo: ["TJ 6488"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "250",
    tonh: 552.0,
    ley_ag: 3.1738490179,
    tajo: ["TJ 6488"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "251",
    tonh: 192.0,
    ley_ag: 4.6797774142,
    tajo: ["TJ 6432-1"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "254",
    tonh: 560.0,
    ley_ag: 3.0698344444,
    tajo: ["TJ 6431-1"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "287",
    tonh: 400.0,
    ley_ag: 8.051002381,
    tajo: ["SN 6431-2"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "298",
    tonh: 528.0,
    ley_ag: 5.2344553571,
    tajo: ["TJ 6431-1"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "303",
    tonh: 240.0,
    ley_ag: 4.5655172222,
    tajo: ["TJ 6431-1-S"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "306",
    tonh: 400.0,
    ley_ag: 4.674,
    tajo: ["TJ 6431-1-S"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "4",
    tonh: 5546.54,
    ley_ag: 28.190387046,
    tajo: ["TJ 400-2P", "AVANCE", "TJ 500-3P"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "5",
    tonh: 1963.16,
    ley_ag: 16.3805631973,
    tajo: ["TJ 400-1P", "TJ 500-7P"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "59",
    tonh: 665.0,
    ley_ag: 10.765792,
    tajo: ["TJ 500-2P"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "6",
    tonh: 1411.05,
    ley_ag: 32.0525985071,
    tajo: ["TJ 500-5P", "TJ 400-1P"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "8",
    tonh: 1856.0,
    ley_ag: 4.022161,
    tajo: ["TJ 6432 NE", "TJ 6432"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "85",
    tonh: 340.75,
    ley_ag: 17.2822111111,
    tajo: ["TJ 500-5P"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "9",
    tonh: 2584.0,
    ley_ag: 3.63,
    tajo: ["AVANCE"],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "C24-001",
    tonh: 11736.0,
    ley_ag: 3.5705707473,
    tajo: [
      "TJ 6432 SW",
      "TJ 6432 NE",
      "TJ 6488",
      "AVANCE",
      "TJ 6609",
      "TJ 6432",
      "TJ 6432-1",
      "TJ 6431-1",
      "AVANCE (6432-2",
      "AVANCE (sn 6431-1",
    ],
    dominio: ["Polimet\u00e1lico"],
    mining: ["UCHUCCHACUA"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "E1",
    tonh: 950.0,
    ley_ag: 61.5,
    tajo: ["AVANCE"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "E2",
    tonh: 862.0,
    ley_ag: 48.6,
    tajo: ["AVANCE"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
  {
    ubication: "Cancha Colquicocha",
    cod_tableta: "E3",
    tonh: 991.35,
    ley_ag: 47.0441238095,
    tajo: ["TJ 500-2P"],
    dominio: ["Ag\/Alabandita"],
    mining: ["YUMPAG"],
  },
];
</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Control de Rumas</h1>
        <span>{{ dataRuma.length }}</span>
      </div>
      <span>{{ formattedDate }} | Dia terminado en Mina </span>
    </div>
    <div class="global-h-button">
      <button class="btn-unirRuma" @click="openBindRuma()">
        <Bind /> Unir Rumas
      </button>
    </div>
  </div>
  <div class="c-global-container">
    <div class="c-g-container-mining">
      <div class="container-mining-header">
        <span>Llenado</span> <IOption />
      </div>
      <div class="container-mining-body">
        <div v-for="(ruma, index) in data" :key="index" class="card-ruma">
          <span class="c-ruma-status">
              Inicio
          </span>
          <div class="c-ruma-body">
            <div class="c-r-body-info">
              <IRuma />
              <div class="c-r-b-i-text">
                <h5
                  v-for="(rumaId, rumaIndex) in ruma.mining"
                  :key="rumaIndex"

                >
                  {{ rumaId }}
                </h5>
                <h3>{{ ruma.cod_tableta }}</h3>
                <span> {{ ruma.ubication }} </span>
              </div>
            </div>
            <div class="c-r-body-items">
              <span
                class="c-r-b-item"
                v-for="(rumaId, rumaIndex) in ruma.tajo"
                :key="rumaIndex"
              >
                {{ rumaId }}
              </span>
            </div>
          </div>
          <div class="c-ruma-footer">
            <div class="c-r-footer-ton">
              <h3>{{ ruma.tonh }}/tm</h3>
              <span
                v-for="(rumaId, rumaIndex) in ruma.dominio"
                :key="rumaIndex"
              >
                {{ rumaId }}
              </span>
            </div>
            <div class="c-r-footer-btn">
              <button @click="openDeactivateRuma(ruma.ruma_Id)">Details</button>
            </div>
          </div>
        </div>
      </div>
      <div class="footer"></div>
    </div>
    <div class="c-g-container-mining">
      <div class="container-mining-header">
        <span>Muestreo</span><IOption />
      </div>
      <div class="container-mining-body">
        <div v-for="(ruma, index) in data" :key="index" class="card-ruma">
          <span class="c-ruma-status">
              Inicio
          </span>
          <div class="c-ruma-body">
            <div class="c-r-body-info">
              <IRuma />
              <div class="c-r-b-i-text">
                <h5
                  v-for="(rumaId, rumaIndex) in ruma.mining"
                  :key="rumaIndex"

                >
                  {{ rumaId }}
                </h5>
                <h3>{{ ruma.cod_tableta }}</h3>
                <span> {{ ruma.ubication }} </span>
              </div>
            </div>
            <div class="c-r-body-items">
              <span
                class="c-r-b-item"
                v-for="(rumaId, rumaIndex) in ruma.tajo"
                :key="rumaIndex"
              >
                {{ rumaId }}
              </span>
            </div>
          </div>
          <div class="c-ruma-footer">
            <div class="c-r-footer-ton">
              <h3>{{ ruma.tonh }}/tm</h3>
              <span
                v-for="(rumaId, rumaIndex) in ruma.dominio"
                :key="rumaIndex"
              >
                {{ rumaId }}
              </span>
            </div>
            <div class="c-r-footer-btn">
              <button @click="openDeactivateRuma(ruma.ruma_Id)">Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="c-g-container-mining">
      <div class="container-mining-header"><span>Planta</span><IOption /></div>
      <div class="container-mining-body">
        <div v-for="(ruma, index) in data" :key="index" class="card-ruma">
          <span class="c-ruma-status">
              Inicio
          </span>
          <div class="c-ruma-body">
            <div class="c-r-body-info">
              <IRuma />
              <div class="c-r-b-i-text">
                <h5
                  v-for="(rumaId, rumaIndex) in ruma.mining"
                  :key="rumaIndex"

                >
                  {{ rumaId }}
                </h5>
                <h3>{{ ruma.cod_tableta }}</h3>
                <span> {{ ruma.ubication }} </span>
              </div>
            </div>
            <div class="c-r-body-items">
              <span
                class="c-r-b-item"
                v-for="(rumaId, rumaIndex) in ruma.tajo"
                :key="rumaIndex"
              >
                {{ rumaId }}
              </span>
            </div>
          </div>
          <div class="c-ruma-footer">
            <div class="c-r-footer-ton">
              <h3>{{ ruma.tonh }}/tm</h3>
              <span
                v-for="(rumaId, rumaIndex) in ruma.dominio"
                :key="rumaIndex"
              >
                {{ rumaId }}
              </span>
            </div>
            <div class="c-r-footer-btn">
              <button @click="openDeactivateRuma(ruma.ruma_Id)">Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Transition :duration="550" name="nested">
    <BindRuma v-if="showBindRuma" @cerrarModal="showBindRuma = false" />
  </Transition>
  <Transition :duration="550" name="nested">
    <DeactivateRuma
      v-if="showDeactivateRuma"
      @cerrarModal="showDeactivateRuma = false"
      :rumaIdToDeactivate="store.state.rumaIdToDeactivate"
    />
  </Transition>
</template>

<style lang="scss">
.g-h-t-primary {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  span {
    color: var(--grey-2);
    font-size: clamp(6px, 8vw, 14px);
    font-weight: 600;
    line-height: 1.1rem;
    background-color: var(--grey-light-1);
    padding: 2px 5px;
    border-radius: 8px;
  }
}

.c-global-container {
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  gap: 0.5rem;
  padding: 0 2.5rem 1.5rem 2.5rem;
  padding-bottom: 1rem;
  overflow: auto;
  flex: 1 1;
  .c-g-container-mining {
    background-color: var(--white);
    border: 1px solid var(--grey-light-22);
    border-radius: var(--br-xxl);
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: auto;
    flex-grow: 1;
    overflow-y: auto;
    .container-mining-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--grey-light-2);
      padding-bottom: 0.5rem;

      span {
        color: var(--grey-2);
        font-size: clamp(6px, 8vw, 14px);
        font-weight: 500;
        line-height: 0.8rem;
        position: relative;
        padding-left: 15px;
        &::before {
          content: "";
          background-color: var(--black);
          width: 7px;
          height: 7px;
          position: absolute;
          top: 50%;
          left: 0px;
          transform: translateY(-50%);
          border-radius: 50%;
          background-color: var(--primary);
        }
      }
      svg {
        fill: var(--grey-light-2);
        color: var(--grey-light-2);
        width: 1.5rem;
        height: 1.5rem;
        stroke-width: 1.5;
      }
    }
    .container-mining-body {
      width: 100%;
      flex: 1 1;
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      padding: 1rem 1rem 1rem 0;
    }
  }
}

.btns {
  display: flex;
  gap: 1rem;
  button {
    padding: 0;
    width: auto;
    display: grid;
    place-items: center;
    background-color: var(--white);
    padding: 8px 14px;
    border-radius: 10px;
    color: var(--primary);
    border: 1px solid var(--primary);
    font-weight: 500;
    img {
      width: 1rem;
    }
    &:hover {
      background-color: var(--primary);
      color: var(--white);
    }
  }
}

.btn-unirRuma {
  background-color: var(--primary);
  color: var(--white);
  font-weight: 500;
  min-width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  &:hover {
    background-color: var(--secondary);
  }
}

.card-ruma {
  flex: 1 1 200px;
  border-radius: 12px;
  background-color: var(--white);
  padding: 3px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--grey-light-22);
  cursor: pointer;
  transition: all 0.3s ease-out;
  display: flex;
  flex-direction: column;
  position: relative;
  .c-ruma-status {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 2px 8px;
    font-size: clamp(7px, 8vw, 11px);
    line-height: .6rem;
    font-weight: 600;
    color: var(--primary);
    border: 1px solid var(--primary);
    border-radius: 8px;    
  }

  .c-ruma-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    flex: 1 1;
    background-color: #c5e0b449;
    border-radius: 12px;
    .c-r-body-info {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 1rem;
      svg {
        width: 2rem;
        height: 2rem;
        stroke-width: 1.2;
        fill: transparent;
      }
      .c-r-b-i-text {
        flex: 1 1 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        h5 {
          font-weight: 500;
         line-height: .8rem;
         font-size: clamp(7px, 8vw, 11px);
        }
        h3 {
          font-weight: 600;
          font-size: clamp(7px, 8vw, 18px);
          padding: 2px 0 8px 0;
        }
        span {
          font-size: clamp(7px, 8vw, 10px);
          font-weight: normal;
          color: var(--grey-2);
          line-height: .6rem;
        }
      }
    }
    .c-r-body-items {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: 0.3rem;
      padding: 1rem 0 0 0;
      .c-r-b-item {
        font-size: clamp(7px, 8vw, 10px);
        line-height: 0.6rem;
        color: var(--black);
        border: 1px solid var(--grey-light-2);
        border-radius: 15px;
        padding: 6px 12px;
      }
    }
  }
  .c-ruma-footer {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    justify-content: space-between;
    .c-r-footer-ton {
      display: flex;
      flex-direction: column;

      span {
        font-size: clamp(7px, 8vw, 10px);
        font-weight: normal;
        color: var(--grey-2);
      }
      h3 {
        font-weight: 600;
        font-size: clamp(7px, 8vw, 15px);
      }
    }
    .c-r-footer-btn {
      button {
        background-color: var(--primary);
        color: var(--white);
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 30px;
        padding: 0 10px;
        font-size: clamp(7px, 8vw, 12px);
      }
    }
  }

  &:hover {
    z-index: 99;
    border: 1px solid var(--primary);
  }
}
</style>

<!-- <div v-for="(ruma, index) in dataRuma" :key="index" class="card-ruma">
  <div class="c-ruma-body">
   <IRuma/>
    <h3>{{ ruma.ruma_Id }}</h3>
    <span>
      <strong>{{
        ruma.rumas_united ? ruma.rumas_united.length : 0
      }}</strong>
      rumas unidas</span
    >
    <div class="c-r-body-items">
      <span
        class="c-r-b-item"
        v-for="(rumaId, rumaIndex) in ruma.rumas_united"
        :key="rumaIndex"
      >
        {{ rumaId }} /
      </span>
    </div>
    <div class="c-r-body-info">
      <div class="c-r-body-i-item">
        <span class="ton-total">{{
          ruma.tonh ? ruma.tonh.toFixed(1) : 0
        }}</span>
        <p>TMH</p>
      </div>
      <div class="c-r-body-i-item">
        <span class="ton-total">{{ ruma.travels || "0" }}</span>
        <p>viajes</p>
      </div>
      <div class="c-r-body-i-item">
        <button @click="openDeactivateRuma(ruma.ruma_Id)">Proceso</button>
      </div>
    </div>
  </div>
</div> -->
