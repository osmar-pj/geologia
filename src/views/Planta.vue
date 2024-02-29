<script setup>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import FiltersPlanta from "../components/filtersPlanta.vue";
import { FilterMatchMode } from "primevue/api";
import IExport from "../icons/IExport.vue";
import {
formatDate,
formatDateAbas,
formatFixed,
formatHour
} from "../libs/utils";


const store = useStore();
const trips = ref([]);
const dt = ref();
const exportCSV = () => {
  dt.value.exportCSV();
};
onMounted(async () => {
  await store.dispatch("get_listPlanta");
  trips.value = store.state.dataListPlanta;
  console.log(trips.value);
});

const filtroAplicado = computed(() => store.state.filtroAplicado);
const tripsFiltered = computed(() => store.state.dataFilterTable);

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
    <div class="global-h-button">
       <FiltersPlanta /> 
    </div>
  </div>
  <div class="c-global-c-content" v-show="!filtroAplicado">
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
          <!-- <InputIcon>
              <img src="../assets/img/i-search.svg" alt="" />
            </InputIcon> -->
          <!-- <InputText
           
          /> -->
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
  <div class="c-global-c-filtered" v-show="filtroAplicado">
 
    <DataTable
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
          <!-- <InputIcon>
              <img src="../assets/img/i-search.svg" alt="" />
            </InputIcon> -->
          <!-- <InputText
           
          /> -->
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
    
    
    </DataTable>
  
  </div>
</template>

<style lang="scss"></style>
