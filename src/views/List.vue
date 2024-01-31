<script setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import SkeletonLoader from "../components/SkeletonLoader.vue";
import Filters from "../components/filters.vue";
import {formatDate, formatFixed, formatArrayField} from "../libs/utils";

const store = useStore();

const data = computed(() => store.state.dataFilterTable);
const selectedColumns = ref([]);

const onToggle = (val) => {
  if (data.value.columns && data.value.columns.length > 0) {
    selectedColumns.value = data.value.columns.filter((col) =>
      val.includes(col)
    );
  } else {
    console.error("data.columns no tiene elementos");
  }
};

watch(data, () => {
  selectedColumns.value = data.value.columns || [];
  console.log(selectedColumns.value); // Mueve el console.log aquí dentro
});

const formatColumnValue = (value, fn, field, row) => {
  switch (fn) {
    case "date":
      return formatDate(value);
    case "fixed":
      return formatFixed(value);
    case "arr":
      if (field === "ubication") {
        return formatArrayField(value, "destiny", row);
      } else if (field === "dominio") {
        return formatArrayField(value, "materials", row);
      }
      break;
    default:
      return value || "";
  }
};
</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Análisis por filtros, tiempo real</h1>
        <span>{{ data.data ? data.data.length : 0 }}</span>
      </div>
      <span>| Dia terminado en Mina </span>
    </div>
    <div class="global-h-button">
      <Filters />
    </div>
  </div>
  <div class="c-global-c-content">
    <DataTable
      :value="data.data"
      tableStyle="width: 100%"
      paginator
      :rows="20"
      paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Página {currentPage} de {totalPages}"
      rowGroupMode="rowspan"
      sortMode="single"
      sortField="year"
      :sortOrder="1"
    >
      <template #header>
        <div style="text-align: left">
          <!-- <MultiSelect
            :modelValue="selectedColumns"
            :options="data.columns"
            optionLabel="title"
            @update:modelValue="onToggle"
            display="chip"
            placeholder="Select Columns"
            :groupRowsBy="['year', 'month', 'date', 'status','ubication','turn','mining','level','type','veta','tajo','dominio','rango','date_abas']"
          /> -->
        </div>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 2.5rem"> </Column>
      <Column
        v-for="(header, index) in data.header"
        :key="index"
        :field="header.field"
        :header="header.title"
      >
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>
                {{
                  formatColumnValue(
                    slotProps.data[header.field],
                    header.fn,
                    header.field,
                    slotProps.data
                  )
                }}
              </h4>
            </div>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style lang="scss">
.c-global-c-content {
  display: flex;
  flex-direction: column;
  padding: 0 2.5rem;
  padding-bottom: 1rem;
  gap: 1rem;
  flex: 1 1;
  overflow: hidden;
}
.div-co-dash {
  display: flex;
  gap: 1rem;
}
.btn-graficar {
  background-color: var(--primary);
  max-width: 200px;
}
.container-t- {
  width: 100%;
  color: var(--black);
  font-size: clamp(6px, 8vw, 14px);
  line-height: 0.7rem;
  font-weight: 500;
  border-collapse: collapse;
  white-space: nowrap;
  overflow: hidden;
  padding-top: 1rem;
  background-color: var(--white);
  border-radius: var(--br-xxl);
  border: 1px solid var(--grey-light-22);
  padding: 2rem;
}
</style>
