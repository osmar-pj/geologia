<script setup>
import { computed, ref, onMounted, inject } from "vue";
import { useStore } from "vuex";
import SkeletonLoader from "../components/SkeletonLoader.vue";
import Filters from "../components/filters.vue";
import { FilterMatchMode } from "primevue/api";
import {
  formatDate,
  formatFixed,
  formatArrayField,
  formatHour,
  formatDateAbas,
} from "../libs/utils";
import { Subject } from "rxjs";

const url = import.meta.env.VITE_API_URL;
const store = useStore();
const socket = inject("socket");
const trip$ = new Subject();
const trips = ref([]);

onMounted(async () => {
  await store.dispatch("get_listCancha");
  trips.value = store.state.dataListCancha;
  console.log(trips.value);
});

socket.on("OreControl", (data) => {
  store.commit("addDataGeneralList", data);
});
const filtroAplicado = computed(()=> store.state.filtroAplicado);


const excludedFields = [
  "year",
  "month",
  "date",
  "mining",
  "ubication",
  "status",
];
socket.on("trips", (data) => {
  console.log("socket Data", data);
  const tripsFound = data.map((trip) => {
    return trips.value.data.find((p) => p._id === trip._id);
  });
  tripsFound.length > 0 ?
    updateTrips(tripsFound, data) :
    console.log("No se encontraron viajes");
});

const updateTrips = (tripsFound, data) => {
  tripsFound.forEach((trip, index) => {
    trip.ley_ag = data[index].ley_ag;
    trip_ley_fe = data[index].ley_fe;
    trip.ley_mn = data[index].ley_mn;
    trip.ley_pb = data[index].ley_pb;
    trip.ley_zn = data[index].ley_zn;
    trip.tmh_ag = data[index].tmh_ag;
    trip.tmh_fe = data[index].tmh_fe;
    trip.tmh_mn = data[index].tmh_mn;
    trip.tmh_pb = data[index].tmh_pb;
    trip.tmh_zn = data[index].tmh_zn;
    trip.rango = data[index].rango;
    trip$.next(trip);
  });
};

const tripsFiltered = computed(() => store.state.dataFilterTable);
console.log("tripsFiltered", tripsFiltered.value);

const formatColumnValue = (value, fn, field, row) => {
  switch (fn) {
    case "date":
      return value ? formatDate(value) : "--";
    case "fixed":
      return formatFixed(value);
    case "arr":
      if (value === "ubication") {
        return formatArrayField(value, "destiny", row);
      } else if (field === "dominio") {
        if (row.materials && row.materials.length > 0) {
          return row.materials.map((i) => i.material).join(", ");
        } else if (row.dominio) {
          return row.dominio;
        }
        return "";
      }
      break;
    default:
      return value || "";
  }
};

const getStatusClass = (header, data) => {
  if (header.field === "statusTrip") {
    return {
      "travel-status": true,
      "T-waitComplete": data[header.field] === "waitComplete",
      "T-waitSplit": data[header.field] === "waitSplit",
      "T-Analizando": data[header.field] === "Analizando",
      "T-waitCodeTableta": data[header.field] === "waitCodeTableta",
      "T-waitDateAbastecimiento":
        data[header.field] === "waitDateAbastecimiento",
      "T-waitBeginAbastecimiento": data[header.field] === "waitBeginAbastecimiento",
      "T-waitBeginDespacho": data[header.field] === "waitBeginDespacho",
      "T-Finalizado": data[header.field] === "Finalizado",
    };
  }
};
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Viajes de Cancha, tiempo real</h1>
        <span>{{ trips.data ? trips.data.length : 0 }}</span>
      </div>
      <span>| Dia terminado en Mina </span>
    </div>
    <div class="global-h-button">
      <Filters />
    </div>
  </div>
  <div class="c-global-c-content" v-show="!filtroAplicado">
    <DataTable
      v-model:filters="filters"
      :value="trips.data"
      tableStyle="width: 100%"
      paginator
      :rows="20"
      paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Página {currentPage} de {totalPages}"
      rowGroupMode="rowspan"
      sortMode="single"
      sortField="year"
      :sortOrder="1"
      :loading="store.state.loading"
      :globalFilterFields="['tajo']"
      dataKey="id"
    >
    <template #header>
        <div>
          <!-- <InputIcon>
              <img src="../assets/img/i-search.svg" alt="" />
            </InputIcon> -->
          <InputText
            v-model="filters['global'].value"
            placeholder="Buscar por nombre..."
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
      <Column header="Fecha" headerStyle="text-align: center;">
        <template #body="slotProps">
          <Skeleton v-if="store.state.loading" height="34px"></Skeleton>
          <div v-else class="t-name">
            <h4>
              {{ formatDateAbas(slotProps.data.date) }}
            </h4>
            <div class="t-hour">
              <img src="../assets/img/i-time.svg" alt="" />
              <h5 class="text-hour">
                {{ formatHour(slotProps.data.date) }}
              </h5>
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
      <Column header="Vehículo" headerStyle="text-align: center;">
        <template #body="slotProps">
          <Skeleton v-if="store.state.loading" height="34px"></Skeleton>
          <div v-else class="t-vehiculo">
            <img
              :src="
                slotProps.data.carriage === 'Vagones'
                  ? 'src/assets/img/i-wagon.svg'
                  : 'src/assets/img/i-truck.svg'
              "
              alt=""
            />
            <div class="t-name">
              <h4>
                {{ slotProps.data.tag }}
              </h4>
              <h5 v-if="slotProps.data.vagones">
                {{ slotProps.data.vagones }} vagones
              </h5>
              <h5 class="t-2" v-else>---</h5>
            </div>
          </div>
        </template>
      </Column>
      <template v-for="(header, index) in trips.header || []">
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
                  slotProps.data[header.field] !== undefined
                "
              >
                <h4 :class="getStatusClass(header, slotProps.data)">
                  <template v-if="header.field !== 'statusTrip'">
                    {{
                      formatColumnValue(
                        slotProps.data[header.field],
                        header.fn,
                        header.field,
                        slotProps.data
                      )
                    }}
                  </template>
                </h4>
              </template>
              <template v-else>
                <h5 class="t-complet">
                  <img src="../assets/img/i-square.svg" alt="" />Compl..
                </h5>
              </template>
            </template>
          </template>
        </Column>
      </template>
    </DataTable>
  </div>
  <div class="c-global-c-filtered" v-show="filtroAplicado" >
    <div class="c-item-filtered" v-for="tripFiltered in tripsFiltered.data" :key="tripFiltered.index">
      <DataTable
        :value="tripFiltered.body"
        tableStyle="width: 100%"
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
        <Column
          v-for="(header, index) in tripsFiltered.header || []"
          :key="index"
          :field="header.field"
          :header="header.title"
        >
          <template #body="slotProps">
            <Skeleton v-if="store.state.loading"></Skeleton>
            <template v-else>
             
                <h4 :class="getStatusClass(header, slotProps.data)">
                  <template v-if="header.field !== 'statusTrip'">
                    {{
                      formatColumnValue(
                        slotProps.data[header.field],
                        header.fn,
                        header.field,
                        slotProps.data
                      )
                    }}
                  </template>
                </h4>
              
            </template>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style lang="scss">
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

.travel-status {
  position: relative;
  margin: 0 auto;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background-color: var(--grey-light-22);
  width: 100px;
  &::after {
    content: "";
    animation: porc2 1.5s ease-in-out forwards;
    position: absolute;
    height: 100%;
    border-radius: 5px;
  }
}

.T-waitComplete::after, .T-waitSplit::after {
  --porcentaje-finalizado: 0%;
}
.T-Analizando::after {
  background-color: #ff694f;
  --porcentaje-finalizado: 20%;
}
.T-waitCodeTableta::after {
  background-color: #b964ff;
  --porcentaje-finalizado: 40%;
}
.T-waitDateAbastecimiento::after {
  background-color: #64e0ff;
  --porcentaje-finalizado: 60%;
}

.T-waitBeginAbastecimiento::after {
  background-color: #5d95ff;
  --porcentaje-finalizado: 80%;
}

.T-waitBeginDespacho::after {
  background-color: #ffbc58;
  --porcentaje-finalizado: 40%;
}

.T-Finalizado::after {
  background-color: #6cff67;
  --porcentaje-finalizado: 100%;
}

@keyframes porc2 {
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

.c-global-c-filtered {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1 1;
  overflow: hidden;
  .c-item-filtered {
    display: flex;
    height: 50%;
  }
}
</style>
