<script setup>
import { computed, inject, ref, onMounted } from "vue";
import { useStore } from "vuex";
import FiltersPlanta from "../components/filtersPlanta.vue";
import { formatDate, formatFixed } from "../libs/utils";
import { FilterMatchMode } from "primevue/api";
import IExport from "../icons/IExport.vue";

const store = useStore();

const trips = computed(() => store.state.dataFilterPlanta);

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
const excludedFields = ["year", "month"];
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
  <div class="c-global-c-content">
    <DataTable
      v-model:filters="filters"
      :value="trips.data"
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
      :globalFilterFields="['pila','ubication','mining','tajo', 'dominio','turn']"
      dataKey="id"
    >
      <template #header>
        <div>
          <!-- <InputIcon>
              <img src="../assets/img/i-search.svg" alt="" />
            </InputIcon> -->
          <!-- <InputText
           
          /> -->
          <input type="text"  v-model="filters['global'].value"
            placeholder="Buscar por nombre...">
        </div>
        <div>
          <button class="btn-success"><IExport/> Exportar </button>
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
      <Column header="Año y Mes" headerStyle="text-align: center;">
        <template #body="slotProps">
          <div class="td-user">
            <Skeleton v-if="store.state.loading" height="34px"></Skeleton>
          <div v-else class="t-name">
              <h4>
                {{
                 slotProps.data.month
                }}
              </h4>
              <h5>
                {{
                  slotProps.data.year
                }}
              </h5>
            </div>
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
                <h4 v-else :class="{ 't-textCort': header.field === 'dominio' || header.field === 'tajo' }">
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
      <template #empty> Sin resultados </template>
    </DataTable>
  </div>
</template>

<style lang="scss">

</style>
