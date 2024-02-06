<script setup>
import { ref, defineProps } from "vue";
const { loading } = defineProps(["loading"]);

const products = ref(new Array(12));
</script>

<template>
  <div class="tableContainer" v-if="loading">
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
          <Skeleton height="40px"  ></Skeleton>
        </template>
      </Column>
      <Column header="Turno">
        <template #body>
          <Skeleton height="40px"></Skeleton>
        </template>
      </Column>
      <Column header="Mina">
        <template #body>
          <Skeleton height="40px"></Skeleton>
        </template>
      </Column>
      <Column header="Operador">
        <template #body>
          <Skeleton height="40px"></Skeleton>
        </template>
      </Column>
      <Column header="Vehículo">
        <template #body>
          <Skeleton height="40px"></Skeleton>
        </template>
      </Column>
      <Column header="Vagones">
        <template #body>
          <Skeleton height="40px"></Skeleton>
        </template>
      </Column>
      <Column header="Toneladas">
        <template #body>
          <Skeleton height="40px"></Skeleton>
        </template>
      </Column>
      <Column header="Tajo">
        <template #body>
          <Skeleton height="40px"></Skeleton>
        </template>
      </Column>
      <Column header="Nro Ruma">
        <template #body>
          <Skeleton height="40px"></Skeleton>
        </template>
      </Column>
      <Column header="Ley Ag">
        <template #body>
          <Skeleton height="40px"></Skeleton>
        </template>
      </Column>
      <Column header="Ley Fe">
        <template #body>
          <Skeleton height="40px"></Skeleton>
        </template>
      </Column>
      <Column header="Ley Mn">
        <template #body>
          <Skeleton height="40px"></Skeleton>
        </template>
      </Column>
      <Column header="Ley Pb">
        <template #body>
          <Skeleton height="40px"></Skeleton>
        </template>
      </Column>
      <Column header="Ley Zn">
        <template #body>
          <Skeleton height="40px"></Skeleton>
        </template>
      </Column>
      <Column header="Status">
        <template #body>
          <Skeleton height="40px"></Skeleton>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body>
          <Skeleton height="40px"></Skeleton>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style lan="scss">

</style>
