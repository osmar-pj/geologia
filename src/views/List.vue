<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import SkeletonLoader from "../components/SkeletonLoader.vue";
import Filters from "../components/filters.vue";
const store = useStore();

const data = computed(() => {
  return store.state.dataFilterTable;
});
const lazyLoading = ref(false);
const loadLazyTimeout = ref();

const loadCarsLazy = (event) => {
  !lazyLoading.value && (lazyLoading.value = true);

  if (loadLazyTimeout.value) {
    clearTimeout(loadLazyTimeout.value);
  }

  //simulate remote connection with a timeout
  loadLazyTimeout.value = setTimeout(() => {
    let _virtualCars = [...virtualCars.value];
    let { first, last } = event;

    //load data of required page
    const loadedCars = cars.value.slice(first, last);

    //populate page of virtual cars
    Array.prototype.splice.apply(_virtualCars, [
      ...[first, last - first],
      ...loadedCars,
    ]);

    virtualCars.value = _virtualCars;
    lazyLoading.value = false;
  }, Math.random() * 1000 + 250);
};
</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Análisis por filtros,tiempo real</h1>
        <span>{{ data.data ?  data.data.length : 0 }}</span>
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
      :virtualScrollerOptions="{
        lazy: true,
        onLazyLoad: loadCarsLazy,
        itemSize: 46,
        delay: 200,
        showLoader: true,
        loading: lazyLoading,
        numToleratedItems: 10,
      }"
    >
      <Column selectionMode="multiple" headerStyle="width: 2.5rem"> </Column>
      <Column header="#" headerStyle="width:3rem">
        <template #body="slotProps">
            {{ slotProps.index + 1 }}
        </template>
    </Column>
      <Column
        v-for="(column, index) in data.columns"
        :key="index"
        :field="column.field"
        :header="column.title"
        sortable
      >
        <template #loading>
          
          <Skeleton height="40px"  ></Skeleton>          
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
