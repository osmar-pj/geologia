<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { Subject } from "rxjs";
import { formatDate, formatFixed } from "../libs/utils";

const store = useStore();
const pilas = ref([]);

onMounted(async () => {
  await store.dispatch("pila_list");
  pilas.value = store.state.pilaList;
});

const formatColumnValue = (value, fn, field, row) => {
  switch (fn) {
    case "date":
      return formatDate(value);
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

    case "count":
      return value.length;
    default:
      return value || "";
  }
};

const statusClassMapping = {
  Finalizado: "Finalizado",
  Acumulando: "Acumulando",
  Analizando: "Analizando",
  waitDateAbastecimiento: "waitDateAbastecimiento",
  waitBeginDespacho: "waitBeginDespacho",
};
const getStatusClass = (status) => statusClassMapping[status] || "";
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
          <div class="td-user">
            <div class="t-name">
              <h4 :class="getStatusClass(slotProps.data[header.field])">
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
          <!-- <Skeleton></Skeleton> -->
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style lang="scss">
.Finalizado {
  padding: 8px 10px;
  border-radius: 15px;
  background-color: #ebf7e9;
  font-size: clamp(6px, 8vw, 13px) !important;
  color: #06a705;
  display: flex;
  align-items: center;
  gap: 8px;
  &::before {
    content: "";
    width: 6px;
    height: 6px;
    background-color: #06a705;
    border-radius: 50%;
    box-shadow: #c4e8bf 0px 1px 4px, #c4e8bf 0px 0px 0px 3px;
  }
}
.Acumulando {
  padding: 8px 10px;
  border-radius: 15px;
  background-color: #fff6e7;
  font-size: clamp(6px, 8vw, 13px) !important;
  color: #e69416;
  display: flex;
  align-items: center;
  gap: 8px;
  &::before {
    content: "";
    width: 6px;
    height: 6px;
    background-color: #e69416;
    border-radius: 50%;
    box-shadow: #fce1ad 0px 1px 4px, #fce1ad 0px 0px 0px 3px;
  }
}

.Analizando {
  padding: 8px 10px;
  border-radius: 15px;
  background-color: #f7eaff;
  font-size: clamp(6px, 8vw, 13px) !important;
  color: #a93ffe;
  display: flex;
  align-items: center;
  gap: 8px;
  &::before {
    content: "";
    width: 6px;
    height: 6px;
    background-color: #a93ffe;
    border-radius: 50%;
    box-shadow: #e5c6fe 0px 1px 4px, #e5c6fe 0px 0px 0px 3px;
  }
}

.waitDateAbastecimiento {
  padding: 8px 10px;
  border-radius: 15px;
  background-color: #eaf2fe;
  font-size: clamp(6px, 8vw, 13px) !important;
  color: #528ffe;
  display: flex;
  align-items: center;
  gap: 8px;
  &::before {
    content: "";
    width: 6px;
    height: 6px;
    background-color: #528ffe;
    border-radius: 50%;
    box-shadow: #c6dafe 0px 1px 4px, #c6dafe 0px 0px 0px 3px;
  }
}

.waitBeginDespacho {
  padding: 8px 10px;
  border-radius: 15px;
  background-color: #f7eaff;
  font-size: clamp(6px, 8vw, 13px) !important;
  color: #a93ffe;
  display: flex;
  align-items: center;
  gap: 8px;
  &::before {
    content: "";
    width: 6px;
    height: 6px;
    background-color: #a93ffe;
    border-radius: 50%;
    box-shadow: #e5c6fe 0px 1px 4px, #e5c6fe 0px 0px 0px 3px;
  }
}
</style>
