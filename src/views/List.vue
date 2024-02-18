<script setup>
import { computed, ref, watch, inject } from "vue";
import { useStore } from "vuex";
import SkeletonLoader from "../components/SkeletonLoader.vue";
import Filters from "../components/filters.vue";
import { formatDate, formatFixed, formatArrayField } from "../libs/utils";
import { Subject } from "rxjs";

const store = useStore();
const socket = inject("socket");
const trip$ = new Subject();

socket.on("OreControl", (data) => {
  store.commit("addDataGeneralList", data);
});

socket.on("trips", (data) => {
  console.log("socket Data", data);

  if (trips.value && trips.value.data) {
    const tripsFound = data.map((i) => {
      const trip = trips.value.data.find((p) => p._id === i._id);
      return trip;
    });

    tripsFound.length > 0
      ? updateTrips(tripsFound, data)
      : console.log("No se encontraron pilas");
  } else {
    console.error("La propiedad 'data' de trips.value no está definida.");
  }
});

socket.on("RemoveTrip", (data) => {
  // trips.value = store.state.dataFilterTable
  const trip = trips.value.data.find((p) => p._id === data._id);
  trips.value.data.splice(trips.value.data.indexOf(trip), 1);
});

const trips = computed(() => store.state.dataFilterTable);

const updateTrips = (tripsFound, data) => {
  tripsFound.forEach((trip, index) => {
    trip.statusTrip = data[index].statusTrip;
    trip.history = data[index].history;
    trip.level = data[index].level;
    trip.type = data[index].type;
    trip.veta = data[index].veta;
    trip.tajo = data[index].tajo;
    trip.cod_tableta = data[index].cod_tableta;
    trip.dominio = data[index].dominio;
    trip.pila = data[index].pila;
    trip.rango = data[index].rango;
    trip$.next(trip);
  });
};

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
      "T-Analizando": data[header.field] === "Analizando",
      "T-waitBeginAnalysis": data[header.field] === "waitBeginAnalysis",
      "T-waitComplete": data[header.field] === "waitComplete",
      "T-waitSplit": data[header.field] === "waitSplit",
      "T-waitDateAbastecimiento": data[header.field] === "waitDateAbastecimiento",
    };
  }
};
</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Análisis por filtros, tiempo real</h1>
        <span>{{ trips.data ? trips.data.length : 0 }}</span>
      </div>
      <span>| Dia terminado en Mina </span>
    </div>
    <div class="global-h-button">
      <Filters />
    </div>
  </div>
  <div class="c-global-c-content">
    <DataTable
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
        v-for="(header, index) in trips.header"
        :key="index"
        :field="header.field"
        :header="header.title"
      >
        <template #body="slotProps">
          <Skeleton v-if="store.state.loading"></Skeleton>
          <h4 v-else :class="getStatusClass(header, slotProps.data)">
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
      </Column>
    </DataTable>
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


.T-Analizando::after{
  background-color: #ff694f;
  --porcentaje-finalizado: 20%; 
}

.T-waitBeginAnalysis::after{
  background-color: #ffbc58;
  --porcentaje-finalizado: 40%; 
}
.T-waitComplete::after{
  background-color: #5d95ff;
  --porcentaje-finalizado: 60%; 
}

.T-waitSplit::after{
  background-color: #b964ff;
  --porcentaje-finalizado: 80%; 
}
.T-waitDateAbastecimiento::after {
  background-color: #fff064;
  --porcentaje-finalizado: 90%; 
}
.T-Muestreado::after {
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

// .analizando {
//   padding: 8px 10px;
//   border-radius: 15px;
//   background-color: #ffeeeb;
//   font-size: clamp(6px, 8vw, 13px) !important;
//   color: #fb4f31;
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   &::before {
//     content: "";
//     width: 6px;
//     height: 6px;
//     background-color: #fb4f31;
//     border-radius: 50%;
//     box-shadow: #ffd1c6 0px 1px 4px, #ffd1c6 0px 0px 0px 3px;
//   }
// }
// .waitBeginAnalysis {
//   padding: 8px 10px;
//   border-radius: 15px;
//   background-color: #eaf2fe;
//   font-size: clamp(6px, 8vw, 13px) !important;
//   color: #528ffe;
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   &::before {
//     content: "";
//     width: 6px;
//     height: 6px;
//     background-color: #528ffe;
//     border-radius: 50%;
//     box-shadow: #c6dafe 0px 1px 4px, #c6dafe 0px 0px 0px 3px;
//   }
// }
// .waitComplete {
//   padding: 8px 10px;
//   border-radius: 15px;
//   background-color: #fff6e7;
//   font-size: clamp(6px, 8vw, 13px) !important;
//   color: #e69416;
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   &::before {
//     content: "";
//     width: 6px;
//     height: 6px;
//     background-color: #e69416;
//     border-radius: 50%;
//     box-shadow: #fce1ad 0px 1px 4px, #fce1ad 0px 0px 0px 3px;
//   }
// }
// .waitSplit {
//   padding: 8px 10px;
//   border-radius: 15px;
//   background-color: #f7eaff;
//   font-size: clamp(6px, 8vw, 13px) !important;
//   color: #a93ffe;
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   &::before {
//     content: "";
//     width: 6px;
//     height: 6px;
//     background-color: #a93ffe;
//     border-radius: 50%;
//     box-shadow: #e5c6fe 0px 1px 4px, #e5c6fe 0px 0px 0px 3px;
//   }
// }
// .Muestreado {
//   padding: 8px 10px;
//   border-radius: 15px;
//   background-color: #ebf7e9;
//   font-size: clamp(6px, 8vw, 13px) !important;
//   color: #06a705;
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   &::before {
//     content: "";
//     width: 6px;
//     height: 6px;
//     background-color: #06a705;
//     border-radius: 50%;
//     box-shadow: #c4e8bf 0px 1px 4px, #c4e8bf 0px 0px 0px 3px;
//   }
// }
</style>
