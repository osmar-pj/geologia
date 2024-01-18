<script setup>
import { ref, defineProps } from "vue";
const { loading } = defineProps(["loading"]);

const products = ref(new Array(18));
</script>

<template>
  <div class="c-global-c-content" v-if="loading">
    <DataTable
    :value="products"
      paginator
      :rows="20"
      scrollable
      tableStyle="width: 100%"
      paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Página {currentPage} de {totalPages}"
    >
      <Column selectionMode="multiple" headerStyle="width: 2.5rem"></Column>

      <Column header="Fecha">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column header="Turno">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column header="Mina">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column header="Operador">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column header="Vehículo">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column header="Vagones">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column header="Toneladas">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column header="Tajo">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column header="Nro Ruma">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column header="Ley Ag">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column header="Ley Fe">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column header="Ley Mn">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column header="Ley Pb">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column header="Ley Zn">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column header="Status">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style lan="scss">
.p-skeleton {
    background-color: #e5e7eb;
    border-radius: 6px;
}

.p-skeleton::after {
    content: '';
    animation: p-skeleton-animation 1.2s infinite;
    height: 100%;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateX(-100%);
    z-index: 1;
}

.p-skeleton:after {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0));
}
</style>
