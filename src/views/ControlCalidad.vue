<script setup>
import { Subject } from "rxjs";
import { computed, inject, onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import CCModal from "../components/CCModal.vue";
import MuestraModal from "../components/MuestraModal.vue";
import Edit from "../icons/Edit.vue";
import { formatDate, formatFixed } from "../libs/utils";
import IList from "../icons/IList.vue";

const store = useStore();
const socket = inject("socket");
const pila$ = new Subject();
// const pilas = ref([])
const selectedStatus = ref("Acumulando");
const pilas = computed(() => store.state.dataListQControl);
const excludedFields = [
  "mining",
  "ubication",
  "travels",
  "pila",
  "ley_ag",
  "ley_fe",
  "ley_mn",
  "ley_pb",
  "ley_zn",
  "tonh",
  "stock",
];
const countPilasSocket = reactive({
  Analizando: { count: 0, animation: false },
});

const resetCount = (status) => {
  countPilasSocket[status].count = 0;
};

const updatePilasFromSocket = (data) => {
  data.forEach((item) => {
    if (item.statusPila === "Analizando") {
      // Incrementa el contador
      countPilasSocket.Analizando.count++;

      // Agrega una clase para la animación
      countPilasSocket.Analizando.animation = true;

      // Después de 300 ms, quita la clase de animación
      setTimeout(() => {
        countPilasSocket.Analizando.animation = false;
      }, 3500);
    }
  });
};

const updateCount = (status) => {
  if (selectedStatus.value === "Analizando") {
    resetCount("Analizando");
  }
  selectedStatus.value = status;
};

watch(selectedStatus, (newValue, oldValue) => {
  if (oldValue === "Analizando") {
    resetCount("Analizando");
  }
});

socket.on("pilas", (data) => {
  updatePilasFromSocket(data);
  const pilasFound = data.map((i) => {
    const pila = pilas.value.data.find((p) => p._id === i._id);
    return pila;
  });
  pilasFound.length > 0
    ? updatePilas(pilasFound, data)
    : console.log("No se encontraron pilas");
});

const updatePilas = (pilasFound, data) => {
  pilasFound.forEach((pila, index) => {
    if (data[index]) {
      pila.stock = data[index].stock;
      pila.tonh = data[index].tonh;
      pila.ton = data[index].tonh * 0.94;
      pila.travels = data[index].travels;
      pila.tajo = data[index].tajo;
      pila.cod_despacho = data[index].cod_despacho;
      pila.statusPila = data[index].statusPila;
      pila.history = data[index].history;
      pila.date_abastecimiento = data[index].date_abastecimiento;
      pila.ubication = data[index].ubication;
      pila$.next(pila);
    } else {
      console.error(
        `No se pudo encontrar el elemento correspondiente en data para el índice ${index}.`
      );
    }
  });
};

onMounted(async () => {
  await store.dispatch("get_listQControl");
});

const filteredData = computed(() => {
  if (pilas.value.data) {
    return pilas.value.data.filter(
      (item) => item.statusPila === selectedStatus.value
    );
  }
  return [];
});

const calculateQtyByStatus = computed(() => (status) => {
  return calcularCantidadPorEstado(status);
});

const calcularCantidadPorEstado = (estado) => {
  if (pilas.value.data) {
    return pilas.value.data.filter((item) => item.statusPila === estado).length;
  }
  return 0;
};

const showCCModal = ref(false);
const showMuestraModal = ref(false);
const modalData = ref(null);

const openMuestraModal = (data) => {
  modalData.value = data;
  showMuestraModal.value = true;
};

const openModal = (data) => {
  modalData.value = data;
  showCCModal.value = true;
};

const formatColumnValue = (value, fn) => {
  switch (fn) {
    case "date":
      return formatDate(value);
    case "fixed":
      return formatFixed(value);
    case "arr":
      if (Array.isArray(value)) {
        const uniqueArrValue = [...new Set(value)];
        return uniqueArrValue.join(", ");
      } else if (typeof value === "string") {
        return value;
      }
      return "";
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
        <h1>Viajes, Control de Calidad</h1>
        <span>{{ pilas.data ? pilas.data.length : 0 }}</span>
      </div>
      <span>| Dia terminado en Mina </span>
    </div>
    <div class="global-h-button">
      <div class="radio-inputs">
        <label
          class="radio"
          v-for="status in ['Acumulando', 'Analizando']"
          :key="status"
        >
          <input
            type="radio"
            name="radio"
            v-model="selectedStatus"
            :value="status"
            @change="updateCount(status)"
          />
          <div class="name">
            <span class="total-count">{{ calculateQtyByStatus(status) }}</span>
            <h5>{{ status }}</h5>
            <span
              v-if="
                status !== 'Acumulando' && countPilasSocket[status].count !== 0
              "
              :class="{
                'radio-Badge': true,
                'r-animation': countPilasSocket.Analizando.animation,
              }"
              >{{ countPilasSocket[status].count }}</span
            >
          </div>
        </label>
      </div>
    </div>
  </div>

  <div class="tableContainer">
    <DataTable
      :value="filteredData"
      tableStyle="width: 100%; border-collapse: collapse;"
      paginator
      :rows="20"
      paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Página {currentPage} de {totalPages}"
      :header="false"
      :loading="store.state.loading"
    >
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
          <div v-else class="t-mining">
            <img
              :src="
                slotProps.data.mining === 'YUMPAG'
                  ? 'src/assets/img/i-YUMPAG.svg'
                  : 'src/assets/img/i-UCHU.svg'
              "
              alt=""
            />
            <div class="t-name">
              <h4>
                {{ slotProps.data.mining ? slotProps.data.mining : "--" }}
              </h4>
              <h5>
                {{ slotProps.data.ubication }}
              </h5>
            </div>
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
              <strong>
                {{
                  slotProps.data.travels &&
                  Array.isArray(slotProps.data.travels)
                    ? slotProps.data.travels.length
                    : 0
                }} </strong
              >viajes
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
            <Skeleton v-if="store.state.loading"></Skeleton>
            <template v-else>
              <template
                v-if="
                  slotProps.data[header.field] !== '' &&
                  slotProps.data[header.field] !== null &&
                  slotProps.data[header.field] !== undefined &&
                  (!Array.isArray(slotProps.data[header.field]) ||
                    slotProps.data[header.field].length > 0)
                "
              >
                <h4
                  :class="{
                    't-textCort':
                      header.field === 'dominio' || header.field === 'tajo',
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
              </template>
              <template v-else>
                <h5 class="t-complet">
                  <img src="../assets/img/i-square.svg" alt="" />Comp..
                </h5>
              </template>
            </template>
          </template>
        </Column>
      </template>
      <Column header="Dominio" headerStyle="text-align: center;">
        <template #body="slotProps">
          <Skeleton v-if="store.state.loading" height="34px"></Skeleton>
          <div v-else class="t-vehiculo">
            <template v-if="slotProps.data.dominio && slotProps.data.dominio.length > 0">
              <template v-for="value in new Set(slotProps.data.dominio)">
                <img
                  v-if="value.includes('Polimetálico')"
                  :src="'src/assets/img/i-polimetalicoF.svg'"
                  alt=""
                />
                <img
                  v-else-if="value.includes('Carbonato')"
                  :src="'src/assets/img/i-carbonatoF.svg'"
                  alt=""
                />
                <img
                  v-else-if="value.includes('Alabandita')"
                  :src="'src/assets/img/i-alabanditaF.svg'"
                  alt=""
                />
              </template>
            </template>
            <template v-else>
                <h5 class="t-complet">
                  <img src="../assets/img/i-square.svg" alt="" />Comp..
                </h5>
              </template>
          </div>
        </template>
      </Column>
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
      <Column field="Acciones">
        <template #body="slotProps">
          <div className="btns">
            <Button
              v-if="slotProps.data.statusPila === 'Acumulando'"
              outlined
              class="item-btn table-btn-edit"
              @click.prevent="openMuestraModal(slotProps.data)"
              :userModal="store.state.userModal"
              v-tooltip.bottom="{
                value: 'Completar',
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
            <Button
              v-if="slotProps.data.statusPila === 'Analizando'"
              outlined
              class="item-btn table-btn-edit"
              @click.prevent="openModal(slotProps.data)"
              :userModal="store.state.userModal"
              v-tooltip.bottom="{
                value: 'Completar',
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
    <MuestraModal
      v-if="showMuestraModal"
      @cerrarModal="showMuestraModal = false"
      :data="modalData"
    />
  </Transition>
  <Transition :duration="550" name="nested">
    <CCModal
      v-if="showCCModal"
      @cerrarModal="showCCModal = false"
      :data="modalData"
    />
  </Transition>
</template>

<style lang="scss">
.radio-Badge {
  background-color: var(--primary);
  position: absolute;
  right: -8px;
  top: -8px;
  font-size: clamp(6px, 8vw, 11px);
  color: var(--white);
  border-radius: 10px;
  text-align: center;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  font-weight: 450;
  &::after {
    content: "";
    position: absolute;
    top: -1px;
    left: -1px;
    border: 1px solid var(--primary);
    opacity: 0;
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
}

.r-animation {
  animation: pulse 1.5s 1;
  &::after {
    animation: sonar 1.5s 1;
  }
}

@keyframes sonar {
  0% {
    transform: scale(0.9);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(1.4);
  }
  50% {
    transform: scale(0.9);
  }
  80% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
