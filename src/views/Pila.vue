<script setup>
import { ref, onMounted, computed, inject } from "vue";
import { useStore } from "vuex";
import { Subject } from "rxjs";
import { formatDateAbas, formatFixed } from "../libs/utils";
import Edit from "../icons/Edit.vue";
import InfoPila from "../components/InfoPila.vue";
import { FilterMatchMode } from "primevue/api";
import IList from "../icons/IList.vue";

const store = useStore();
const socket = inject("socket");
// const pilas = ref([]);
const pilas = computed(() => store.state.pilaList);
console.log(pilas.value);
const dt = ref();
const exportCSV = () => {
  dt.value.exportCSV();
};
onMounted(async () => {
  await store.dispatch("pila_list");
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const excludedFields = [
  "mining",
  "ubication",
  "pila",
  "travels",
  "statusPila",
  "ley_ag",
  "ley_pb",
  "ley_fe",
  "ley_mn",
  "ley_zn",
  "tonh",
  "stock",
  "cod_despacho",
];

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
        <h1>Stock Piles de Cancha</h1>
        <span>{{ pilas.data ? pilas.data.length : 0 }}</span>
      </div>
      <span>| Dia terminado en Mina </span>
    </div>
  </div>

  <div class="tableContainer">
    <DataTable
      v-model:filters="filters"
      :value="pilas.data"
      ref="dt"
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
          <button class="btn-success" @click="exportCSV($event)">
            Exportar ahora
          </button>
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
      <Column header="Stock Piles" headerStyle="text-align: center;">
        <template #body="slotProps">
          <Skeleton v-if="store.state.loading" height="34px"></Skeleton>
          <div v-else class="t-name">
            <h4>
              {{ slotProps.data.pila }}
            </h4>
            <h5>
              <IList />
              <strong>{{
                slotProps.data.travels && Array.isArray(slotProps.data.travels)
                  ? slotProps.data.travels.length
                  : 0
              }}</strong>
              viajes
            </h5>
          </div>
        </template>
      </Column>
      <Column header="Status" headerStyle="text-align: center;">
        <template #body="slotProps">
          <Skeleton v-if="store.state.loading" height="34px"></Skeleton>
          <div class="t-container" v-else>
            <div
              :class="[
                'porcent-status',
                {
                  'P-Acumulando': slotProps.data.statusPila === 'Acumulando',
                  'P-Analizando': slotProps.data.statusPila === 'Analizando',
                  'P-waitCodeTableta':
                    slotProps.data.statusPila === 'waitCodeTableta',
                  'P-waitDateAbastecimiento':
                    slotProps.data.statusPila === 'waitDateAbastecimiento',
                  'P-waitBeginDespacho':
                    slotProps.data.statusPila === 'waitBeginDespacho',
                  'P-Despachando': slotProps.data.statusPila === 'Despachando',
                  'P-Finalizado': slotProps.data.statusPila === 'Finalizado',
                },
              ]"
            ></div>
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
            <template v-else>
              <h4
                v-if="
                  slotProps.data[header.field] !== '' &&
                  slotProps.data[header.field] !== null &&
                  slotProps.data[header.field] !== undefined &&
                  (!Array.isArray(slotProps.data[header.field]) ||
                    slotProps.data[header.field].length > 0)
                "
                :class="{
                  't-textCort':
                    header.field === 'dominio' ||
                    header.field === 'tajo' ||
                    header.field === 'cod_despacho',
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
              <template v-else>
                <h5 class="t-complet">
                  <img src="../assets/img/i-square.svg" alt="" />Comp..
                </h5>
              </template>
            </template>
          </template>
        </Column>
      </template>
      <Column header="Stock Mineral" headerStyle="text-align: center;">
        <template #body="slotProps">
          <Skeleton v-if="store.state.loading" height="34px"></Skeleton>
          <div v-else class="t-name">
            <h4>
              {{ formatFixed(slotProps.data.stock) }}
            </h4>
            <h5>TMH</h5>
          </div>
        </template>
      </Column>
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
      <Column field="Detalles" header="Detalles">
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

<style lang="scss">
.porcent-status {
  position: relative;
  margin: 0 auto;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background-color: var(--grey-light-22);
  // &::before{
  //   --porcentaje-finalizado: 10%;
  //   content: "10%";
  // }
  &::after {
    content: "";
    animation: porc1 1.5s ease-in-out forwards;
    position: absolute;
    height: 100%;
    border-radius: 5px;
  }
}

.P-Acumulando::after {
  background-color: #ff694f;
  --porcentaje-finalizado: 20%;
}

.P-Analizando::after {
  background-color: #ffbc58;
  --porcentaje-finalizado: 40%;
}
.P-waitCodeTableta::after {
  background-color: #64e0ff;
  --porcentaje-finalizado: 50%;
}

.P-waitDateAbastecimiento::after {
  background-color: #5d95ff;
  --porcentaje-finalizado: 60%;
}

.P-waitBeginDespacho::after {
  background-color: #b964ff;
  --porcentaje-finalizado: 80%;
}
.P-Despachando::after {
  background-color: #00b670;
  --porcentaje-finalizado: 90%;
}
.P-Finalizado::after {
  background-color: #6cff67;
  --porcentaje-finalizado: 100%;
}

@keyframes porc1 {
  0% {
    width: 0%;
  }
  55% {
    width: 75%;
  }
  100% {
    width: var(--porcentaje-finalizado);
  }
}
</style>
