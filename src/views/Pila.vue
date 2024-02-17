<script setup>
import { ref, onMounted, computed, inject } from "vue";
import { useStore } from "vuex";
import { Subject } from "rxjs";
import { formatDateAbas, formatFixed } from "../libs/utils";
import Edit from "../icons/Edit.vue";
import InfoPila from "../components/InfoPila.vue";
import { FilterMatchMode } from "primevue/api";

const store = useStore();
const socket = inject("socket");
// const pilas = ref([]);
const pilas = computed(() => store.state.pilaList);

onMounted(async () => {
  await store.dispatch("pila_list");
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const excludedFields = ["mining", "ubication","pila","travels"];

const modalData = ref(null);
const showOCModal = ref(false);
const openModal = (data) => {
  modalData.value = data;
  showOCModal.value = true;
};

socket.on("newPila", (data) => {
  store.commit("addDataPilaList", data);
});

const formatColumnValue = (value, fn) => {
  switch (fn) {
    case "date":
      return value ? formatDateAbas(value) : "--";
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
      v-model:filters="filters"
      :value="pilas.data"
      tableStyle="width: 100%; border-collapse: collapse;"
      paginator
      :rows="20"
      paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Página {currentPage} de {totalPages}"
      :header="false"
      :loading="store.state.loading"
      :globalFilterFields="['pila']"
      dataKey="id"
    >
      <template #header>
        <div>
          <!-- <InputIcon>
              <img src="../assets/img/i-search.svg" alt="" />
            </InputIcon> -->
          <InputText
            v-model="filters['global'].value"
            placeholder="Buscar por pila..."
          />
        </div>
        <div>
          <button class="btn-success">Exportar ahora</button>
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
      <Column header="Mina" headerStyle="text-align: center;">
        <template #body="slotProps">
          <Skeleton v-if="store.state.loading" height="34px"></Skeleton>
          <div v-else class="t-name">
            <h4>
              {{ slotProps.data.mining }}
            </h4>
            <h5>
              {{ slotProps.data.ubication }}
            </h5>
          </div>
        </template>
      </Column>
      <Column header="Pila" headerStyle="text-align: center;">
        <template #body="slotProps">
          <Skeleton v-if="store.state.loading" height="34px"></Skeleton>
          <div v-else class="t-name">
            <h4>
              {{ slotProps.data.pila }}
            </h4>
            <h5>
              {{
                slotProps.data.travels && Array.isArray(slotProps.data.travels)
                  ? slotProps.data.travels.length
                  : 0
              }} viajes
            </h5>
          </div>
        </template>
      </Column>
      <template v-for="(header, index) in pilas.header || []">
        <Column
          v-if="
            !header || (header.field && !excludedFields.includes(header.field))
          "
          :key="index"
          :field="header.field"
          :header="header.title"
        >
          <template #body="slotProps">
            <Skeleton v-if="store.state.loading" height="34px"></Skeleton>
            <h4 v-else :class="getStatusClass(slotProps.data[header.field])">
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
      <Column field="Acciones" header="Acciones">
        <template #body="slotProps">
          <div className="btns">
            <Button
              outlined
              class="item-btn table-btn-edit"
              @click.prevent="openModal(slotProps.data)"
              :userModal="store.state.userModal"
              v-tooltip.bottom="{
                value: 'Detalles',
                pt: {
                  arrow: {
                    style: {
                      borderBottomColor: 'var(--primary-color)',
                    },
                  },
                  text: 'bg-primary font-medium',
                },
              }"
            >
              <Edit />
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <Transition :duration="550" name="nested">
    <InfoPila
      v-if="showOCModal"
      @cerrarModal="showOCModal = false"
      :data="modalData"
    />
  </Transition>
</template>

<style lang="scss"></style>
