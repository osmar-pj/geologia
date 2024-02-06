<script setup>
import { ref, onMounted, computed, inject, watch } from "vue";
import { useStore } from "vuex";
import { Subject } from "rxjs";
import Edit from "../icons/Edit.vue";
import CCModal from "../components/CCModal.vue";
import MuestraModal from "../components/MuestraModal.vue";
import CanchaModal from "../components/CanchaModal.vue";
import { formatDate, formatFixed, formatArrayField } from "../libs/utils";
import SkeletonLoader from "../components/SkeletonLoader.vue";

const store = useStore();
const pilas = ref([]);
const selectedStatus = ref("Acumulando");


onMounted(async () => {
  await store.dispatch("pila_list");
  pilas.value = store.state.dataListControl;
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
        if (row.materials && row.materials.length > 0) {
          return row.materials.map((material) => material.material).join(", ");
        } else if (row.dominio) {
          return row.dominio;
        }
        return "";
      }
    case "count":
      return value.length;
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
        <h1>Lista de Pilas</h1>
        <span>{{ pilas.data ? pilas.data.length : 0 }}</span>
      </div>
      <span>| Dia terminado en Mina </span>
    </div>
    
  </div>

  <div class="tableContainer">
    <DataTable
      :value="pilas.data"
      tableStyle="width: 100%; border-collapse: collapse;"
      paginator
      :rows="20"
      paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Página {currentPage} de {totalPages}"
      :header="false"
      :loading="store.state.loading"
    >     
      <Column selectionMode="multiple" headerStyle="width: 2.5rem"></Column>
      <Column
        v-for="(header, index) in pilas.header"
        :key="index"
        :field="header.field"
        :header="header.title"
      >
        <template #body="slotProps">
          <div class="td-user"   >
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
          </div >
          <!-- <Skeleton></Skeleton> -->
        </template>
      </Column>
     
    </DataTable>
  </div>
</template>

<style lang="scss"></style>
