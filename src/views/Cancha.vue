<script setup>
import { FilterMatchMode } from "primevue/api";
import { Subject } from "rxjs";
import { computed, inject, onMounted, ref } from "vue";
import { useStore } from "vuex";
import FiltersCancha from "../components/FiltersCancha.vue";
import IExport from "../icons/IExport.vue";
import {
formatArrayField,
formatDate,
formatDateAbas,
formatFixed,
formatHour,
} from "../libs/utils";
import Head from "../components/Head.vue";

const store = useStore();
const socket = inject("socket");
const trip$ = new Subject();
const trips = ref([]);
const dt = ref();
const exportCSV = () => {
  dt.value.exportCSV();
};

onMounted(async () => {
  store.commit("filtroAplicado", false);
  await store.dispatch("get_listCancha");
  trips.value = store.state.dataListCancha;
  
});

socket.on("OreControl", (data) => {
  store.commit("addDataGeneralList", data);
});
const filtroAplicado = computed(() => store.state.filtroAplicado);

const excludedFields = [
  "year",
  "month",
  "date",
  "mining",
  "ubication",
  "status",
  "ley_ag",
  "ley_pb",
  "ley_fe",
  "ley_mn",
  "ley_zn",
  "tonh",
  "turn",
  "id_trip",
];
socket.on("trips", (data) => {
  console.log("socket Data", data);
  const tripsFound = data.map((trip) => {
    return trips.value.data.find((p) => p._id === trip._id);
  });
  tripsFound.length > 0
    ? updateTrips(tripsFound, data)
    : console.log("No se encontraron viajes");
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
      "T-waitBeginAbastecimiento":
        data[header.field] === "waitBeginAbastecimiento",
      "T-waitBeginDespacho": data[header.field] === "waitBeginDespacho",
      "T-Finalizado": data[header.field] === "Finalizado",
    };
  }
};
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
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
        <h1>Viajes a Cancha, tiempo real</h1>
        <span>{{ trips.data ? trips.data.length : 0 }}</span>
      </div>
      <span>| Dia terminado en Mina </span>
    </div>
    <div class="global-h-button">
      <FiltersCancha /> <Head/>
    </div>
  </div>
  <div class="c-global-c-content" v-show="!filtroAplicado">
    <DataTable
      v-model:filters="filters"
      :value="trips.data"
      ref="dt"
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
      :globalFilterFields="['pila','ubication','mining','tajo', 'dominio','turn']"
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
          <button class="btn-success" @click="exportCSV($event)">
            <IExport /> Exportar
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
      <Column header="Turno" headerStyle="text-align: center;">
        <template #body="slotProps">
          <Skeleton v-if="store.state.loading" height="34px"></Skeleton>
          <div v-else class="t-vehiculo">
            <img
              :src="
                slotProps.data.turn === 'DIA'
                  ? 'src/assets/img/i-day.svg'
                  : 'src/assets/img/i-night.svg'
              "
              alt=""
            />
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
                  <img src="../assets/img/i-square.svg" alt="" />Comp..
                </h5>
              </template>
            </template>
          </template>
        </Column>
      </template>
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
    </DataTable>
  </div>
  <div class="c-global-c-filtered" v-show="filtroAplicado">
    <div
      class="c-item-filtered"
      v-for="tripFiltered in tripsFiltered.data"
      :key="tripFiltered.index"
    >
      <DataTable
        :value="tripFiltered.body"
        tableStyle="width: 100%"
        :loading="store.state.loading"
      >
        <!-- <Column header="#" headerStyle="width: 2.5rem">
          <template #body="slotProps">
            <div class="td-user">
              <div class="t-name">
                <h5>#{{ slotProps.index + 1 }}</h5>
              </div>
            </div>
          </template>
        </Column> -->
        <Column
          v-for="(header, index) in tripsFiltered.header || []"
          :key="index"
          :field="header.field"
          :header="header.title"
        >
          <template #body="slotProps">
            <Skeleton v-if="store.state.loading"></Skeleton>
            <template v-else>
              <h4 class="t-ley"
                :style="{
                  color: (() => {
                    const fieldValue = slotProps.data[header.field];
                    if (
                      [
                        'ley_ag',
                        'ley_pb',
                        'ley_mn',
                        'ley_fe',
                        'ley_zn',
                      ].includes(header.field)
                    ) {
                      return fieldValue < 3
                        ? '#00B050'
                        : fieldValue >= 3 && fieldValue < 10
                        ? '#FF9900'
                        : '#FF0000';
                    } else {
                      return '';
                    }
                  })(),
                }"
                :class="getStatusClass(header, slotProps.data)"
              >
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

.travel-status {
  position: relative;
  margin: 0 auto;
  width: 100%;
  height: 20px;
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
  &::before {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    color: var(--white);
    font-size: 11px;
    line-height: 0.8rem;
  }
}

.T-waitComplete::after,
.T-waitSplit::after {
  --porcentaje-finalizado: 0%;
}
.T-Analizando::after {
  background: repeating-linear-gradient(
    -45deg,
    #f05b5b,
    #f05b5b 5px,
    #e25556 5px,
    #e25556 10px
  );
  --porcentaje-finalizado: 25%;
}
.T-Analizando::before {
  content: "20%";
  left: 5px;
  font-size: 8px;
}
.T-waitCodeTableta::after {
  background: repeating-linear-gradient(
    -45deg,
    #925fff,
    #925fff 5px,
    #8657ff 5px,
    #8657ff 10px
  );
  --porcentaje-finalizado: 40%;
}
.T-waitCodeTableta::before {
  content: "40%";
}
.T-waitDateAbastecimiento::after {
  background-color: #00d382;
  --porcentaje-finalizado: 60%;
}
.T-waitDateAbastecimiento::before {
  content: "60%";
}
.T-waitBeginAbastecimiento::after {
  background: repeating-linear-gradient(
    -45deg,
    #5d95ff,
    #5d95ff 5px,
    #578cff 5px,
    #578cff 10px
  );
  --porcentaje-finalizado: 80%;
}
.T-waitBeginAbastecimiento::before {
  content: "80%";
}
.T-waitBeginDespacho::after {
  background: repeating-linear-gradient(
    -45deg,
    #ffbc58,
    #ffbc58 5px,
    #f5b458 5px,
    #f5b458 10px
  );
  --porcentaje-finalizado: 90%;
}
.T-waitBeginDespacho::before {
  content: "90%";
}
.T-Finalizado::after {
  background: repeating-linear-gradient(
    -45deg,
    #1fd9ad,
    #1fd9ad 5px,
    #1dcfb9 5px,
    #1dcfb9 10px
  );
  --porcentaje-finalizado: 100%;
}
.T-Finalizado::before {
  content: "100%";
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
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
