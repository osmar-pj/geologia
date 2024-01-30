<script setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import SkeletonLoader from "../components/SkeletonLoader.vue";
import Filters from "../components/filters.vue";
const store = useStore();

const data = computed(() => store.state.dataFilterTable);
const selectedColumns = ref([]);

const onToggle = (val) => {
  if (data.value.columns && data.value.columns.length > 0) {
    selectedColumns.value = data.value.columns.filter((col) => val.includes(col));
  } else {
    console.error("data.columns no tiene elementos");
  }
};

watch(data, () => {
  selectedColumns.value = data.value.columns || [];
  console.log(selectedColumns.value); // Mueve el console.log aquí dentro
});

</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Análisis por filtros,tiempo real</h1>
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
          /> -->
        </div>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 2.5rem"> </Column>
      <Column header="#" headerStyle="width:3rem">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column
        v-for="(column, index) in data.header"
        :key="index"
        :field="column.field"
        :header="column.title"
        sortable
      >
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>
                {{
                  column && column.fn === "fixed"
                    ? slotProps.data[column.field].toFixed(2)
                    : slotProps.data[column.field]
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