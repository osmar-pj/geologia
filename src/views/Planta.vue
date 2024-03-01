<script setup>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import { FilterMatchMode } from "primevue/api";
import FiltersPlanta from "../components/filtersPlanta.vue";
import IExport from "../icons/IExport.vue";
import Head from "../components/Head.vue";
import {
  formatDate,
  formatDateAbas,
  formatFixed,
  formatHour,
} from "../libs/utils";

const store = useStore();
const trips = ref([]);
const dt = ref();
const exportCSV = () => {
  dt.value.exportCSV();
};
onMounted(async () => {
  store.commit("filtroAplicadoPlanta", false);
  await store.dispatch("get_listPlanta");
  trips.value = store.state.dataListPlanta;
});

const filtroAplicadoPlanta = computed(() => store.state.filtroAplicadoPlanta);
const tripsFiltered = computed(() => store.state.dataFilterPlanta);

const excludedFields = [
  "year",
  "month",
  "date",
  "turn",
  "ley_ag",
  "ley_pb",
  "ley_fe",
  "ley_mn",
  "ley_zn",
  "tonh",
];

const formatColumnValue = (value, fn) => {
  switch (fn) {
    case "date":
      return value ? formatDate(value) : "--";
    case "fixed":
      return formatFixed(value);
    case "arr":
      if (Array.isArray(value)) {
        const uniqueArrValue = [...new Set(value)];
        return uniqueArrValue.join(" - ");
      } else if (typeof value === "string") {
        return value;
      }
      return "";
    default:
      return value || "";
  }
};
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const columns = ref([
  { header: "Ley Ag", field: "ley_ag" },
  { header: "Ley Fe", field: "ley_fe" },
  { header: "Ley Mn", field: "ley_mn" },
  { header: "Ley Pb", field: "ley_pb" },
  { header: "Ley Zn", field: "ley_zn" },
]);
</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Viajes a Planta, tiempo real</h1>
        <span>{{ trips.data ? trips.data.length : 0 }}</span>
      </div>
      <span>| Dia terminado en Mina </span>
    </div>
    <div class="global-h-button"><FiltersPlanta /> <Head /></div>
  </div>
  <div class="c-global-c-content" v-show="!filtroAplicadoPlanta">
    <DataTable
      v-model:filters="filters"
      :value="trips.data"
      ref="dt"
      tableStyle="width: 100%"
      paginator
      :rows="20"
      paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Página {currentPage} de {totalPages}"
      rowGroupMode="rowspan"
      sortMode="single"
      sortField="year"
      :sortOrder="1"
      :loading="store.state.loading"
      :globalFilterFields="[
        'pila',
        'ubication',
        'mining',
        'tajo',
        'dominio',
        'turn',
      ]"
      dataKey="id"
    >
      <template #header>
        <div>
          <input
            type="text"
            v-model="filters['global'].value"
            placeholder="Buscar por nombre..."
          />
        </div>
        <div>
          <button class="btn-success" @click="exportCSV($event)">
            <IExport /> Exportar
          </button>
        </div>
      </template>
      <Column header="#" headerStyle="width: 2.5rem">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h5>#{{ slotProps.index + 1 }}</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column header="Fecha" headerStyle="text-align: center;">
        <template #body="slotProps">
          <Skeleton v-if="store.state.loading" height="34px"></Skeleton>
          <div v-else class="t-name">
            <h4>
              {{ formatDateAbas(slotProps.data.date) }}
            </h4>
            <div class="t-hour">
              <img src="../assets/img/i-time.svg" alt="" />
              <h5 class="text-hour">
                {{ formatHour(slotProps.data.date) }}
              </h5>
            </div>
          </div>
        </template>
      </Column>
      <Column header="Turno" headerStyle="text-align: center;">
        <template #body="slotProps">
          <Skeleton v-if="store.state.loading" height="34px"></Skeleton>
          <div v-else class="t-vehiculo">
            <img
              :src="
                slotProps.data.turn === 'DIA'
                  ? 'src/assets/img/i-day.svg'
                  : 'src/assets/img/i-night.svg'
              "
              alt=""
            />
          </div>
        </template>
      </Column>

      <template v-for="(header, index) in trips.header || []">
        <Column
          v-if="
            !header || (header.field && !excludedFields.includes(header.field))
          "
          :key="index"
          :field="header.field"
          :header="header.title"
        >
          <template #body="slotProps">
            <Skeleton v-if="store.state.loading" height="38px"></Skeleton>
            <h4
              v-else
              :class="{
                't-textCort':
                  header.field === 'dominio' || header.field === 'tajo',
              }"
            >
              {{
                formatColumnValue(
                  slotProps.data[header.field],
                  header.fn,
                  header.field,
                  slotProps.data
                )
              }}
            </h4>
          </template>
        </Column>
      </template>
      <Column header="Ton. Total" headerStyle="text-align: center;">
        <template #body="slotProps">
          <Skeleton v-if="store.state.loading" height="34px"></Skeleton>
          <div v-else class="t-name">
            <h4>
              {{ formatFixed(slotProps.data.tonh) }}
            </h4>
            <h5>TMH</h5>
          </div>
        </template>
      </Column>
      <Column
        v-for="(column, index) in columns"
        :key="index"
        :header="column.header"
        headerStyle="text-align: center;"
      >
        <template #body="slotProps">
          <Skeleton v-if="store.state.loading" height="34px"></Skeleton>
          <template v-else>
            <template
              v-if="
                slotProps.data[column.field] !== '' &&
                slotProps.data[column.field] !== null &&
                slotProps.data[column.field] !== undefined &&
                (!Array.isArray(slotProps.data[column.field]) ||
                  slotProps.data[column.field].length > 0)
              "
            >
              <h4
                class="t-ley"
                :style="{
                  color: ((value) =>
                    value < 3
                      ? '#00B050'
                      : value >= 3 && value < 10
                      ? '#FF9900'
                      : '#FF0000')(slotProps.data[column.field]),
                }"
              >
                {{ formatFixed(slotProps.data[column.field]) }}
              </h4>
            </template>
            <template v-else>
              <h5 class="t-complet">
                <img src="../assets/img/i-square.svg" alt="" />Comp..
              </h5>
            </template>
          </template>
        </template>
      </Column>
    </DataTable>
  </div>

  <div class="config-content-table N-datatable" v-show="filtroAplicadoPlanta">
    <!-- <DataTable
      v-model:filters="filters"
      :value="tripsFiltered.content"
      ref="dt"
      tableStyle="width: 100%"
      paginator
      :rows="20"
      paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Página {currentPage} de {totalPages}"
      rowGroupMode="rowspan"
      sortMode="single"
      sortField="year"
      :sortOrder="1"
      :loading="store.state.loading"
      :globalFilterFields="[
       
        'turn',
      ]"
      dataKey="id"
    >
      <template #header>
        <div>
          <input
            type="text"
            v-model="filters['global'].value"
            placeholder="Buscar por nombre..."
          />
        </div>
        <div>
          <button class="btn-success" @click="exportCSV($event)"><IExport /> Exportar</button>
        </div>
      </template>
      <Column header="#" headerStyle="width: 2.5rem">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h5>#{{ slotProps.index + 1 }}</h5>
            </div>
          </div>
        </template>
      </Column>
     
      
      <template v-for="(header, index) in tripsFiltered.header || []">
        <Column
          v-if="
            !header || (header.field && !excludedFields.includes(header.field))
          "
          :key="index"
          :field="header.field"
          :header="header.title"
        >
          <template #body="slotProps">
            <Skeleton v-if="store.state.loading" height="38px"></Skeleton>
            <h4
              v-else
              :class="{
                't-textCort':
                  header.field === 'dominio' || header.field === 'tajo',
              }"
            >
              {{
                formatColumnValue(
                  slotProps.data[header.field],
                  header.fn,
                  header.field,
                  slotProps.data
                )
              }}
            </h4>
          </template>
        </Column>
      </template>
    </DataTable> -->
    <table
      v-if="
        tripsFiltered && tripsFiltered.data && tripsFiltered.data.length > 0
      "
    >
      <thead>
        <tr>
          <th>#</th>
          <th v-for="column in tripsFiltered.header" :key="column.field">
            {{ column.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in tripsFiltered.data.slice(0, -1)"
          :key="index"
        >
          <td>
            <div class="td-user">
              <div class="t-name">
                <h5>#{{ index + 1 }}</h5>
              </div>
            </div>
          </td>
          <td v-for="column in tripsFiltered.header" :key="column.field">
            <h4
              :style="{
                color: (() => {
                  const value = row[column.field];
                  if (
                    typeof value === 'number' &&
                    column.field.startsWith('ley_')
                  ) {
                    return value < 3
                      ? '#00B050'
                      : value < 10
                      ? '#FF9900'
                      : '#FF0000';
                  }
                  return '';
                })(),
              }"
            >
              {{
                typeof row[column.field] === "number"
                  ? formatFixed(row[column.field])
                  : row[column.field]
              }}
            </h4>
          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td colspan="">TOTAL</td>
          <td v-for="column in tripsFiltered.header" :key="column.field">
            {{
              tripsFiltered.data.length > 0 &&
              typeof tripsFiltered.data[tripsFiltered.data.length - 1][
                column.field
              ] === "number"
                ? tripsFiltered.data[tripsFiltered.data.length - 1][
                    column.field
                  ].toFixed(2)
                : tripsFiltered.data[tripsFiltered.data.length - 1][
                    column.field
                  ]
            }}
          </td>
        </tr>
      </tfoot>
    </table>
    <div v-else>No hay datos disponibles.</div>
  </div>
</template>

<style lang="scss"></style>
