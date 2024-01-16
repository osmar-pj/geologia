<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import Modal from "../components/Modal.vue";
const store = useStore();
const selectedCity = ref(null);
const showModal = ref(false);
const openModal = (e) => {
  store.state.userModal = e;
  showModal.value = true;
};

const cities = ref([
  { name: "City1", value: "city1" },
  { name: "City2", value: "city2" },
  { name: "City1", value: "city3" },
  { name: "City2", value: "city4" },
]);

const selectedProduct = ref();
const metaKey = ref(true);

const props = defineProps([
  "showActionsColumn",
  "title",
  "data",
  "showColum",
  "showItem",
]);
const formattedDate = ref("");

onMounted(() => {
  const options = {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const today = new Date();

  const weekday =
    today
      .toLocaleDateString("es-ES", { weekday: "long" })
      .charAt(0)
      .toUpperCase() +
    today.toLocaleDateString("es-ES", { weekday: "long" }).slice(1);

  formattedDate.value = `${weekday}, ${today
    .toLocaleDateString("es-ES", options)
    .replace(/\//g, ".")}`;
});

</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <h1>{{ props.title || "Viajes realizados, Listos" }}</h1>
      <span>{{ formattedDate }} | Dia terminado en Mina </span>
    </div>
    <div class="global-h-button">
      <div class="radio-inputs">
        <label class="radio">
          <input type="radio" name="radio" checked="" />
          <span class="name">Semana</span>
        </label>
        <label class="radio">
          <input type="radio" name="radio" />
          <span class="name">Mes</span>
        </label>

        <label class="radio">
          <input type="radio" name="radio" />
          <span class="name">Año</span>
        </label>
      </div>
    </div>
  </div>

  <div class="c-global-c-content">
    <DataTable
      v-model:selection="selectedProduct"
      :value="data"
      dataKey="travel_Id"
      paginator
      :rows="20"
      scrollable
      tableStyle="width: 100%"
      paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Página {currentPage} de {totalPages}"
    >
      <!-- <template #header>
        <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 class="m-0">Manage Products</h4>
            <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="filters['global'].value" placeholder="Search..." />
            </span>
        </div>
    </template> -->
      <Column selectionMode="multiple" headerStyle="width: 2.5rem"></Column>
      
      <Column field="fecha" header="Fecha" sortable>
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.fecha }}</h4>
              <h5>Fecha de llegada</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="turno" header="Turno" sortable>
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.turno }}</h4>
              <h5>turno</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="mina" header="Mina" sortable>
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.mina }}</h4>
              <h5>mina</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="user" header="Operador" sortable>
        <template #body="slotProps">
          <div class="td-user">
            <span class="t-siglas">{{
              slotProps.data.operador
                ? slotProps.data.operador
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word.charAt(0))
                    .join("")
                : ""
            }}</span>
            <div class="t-name">
              <h4>
                {{
                  slotProps.data.operador
                    ? slotProps.data.operador.split(" ").slice(0, 2).join(" ")
                    : ""
                }}
              </h4>
              <h5 class="t-2">
                {{
                  slotProps.data.operador
                    ? slotProps.data.operador.split(" ").slice(2).join(" ")
                    : ""
                }}
              </h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="vehiculo" header="Vehículo" sortable>
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.vehiculo }}</h4>
              <h5>vehiculo</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="vagones" header="vagones">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.vagones }}</h4>
              <h5>vagones</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="toneladas" header="Toneladas">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.ton }} TMH</h4>
              <h5>{{ slotProps.data.material }}</h5>
            </div>
          </div>
        </template>
      </Column>
      
      <Column field="tajo" header="Tajo">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.tajo }}</h4>
              <h5>{{ slotProps.data.tipo }}</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="tableta" header="Nro Ruma">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.tableta }}</h4>
              <h5>{{ slotProps.data.tableta ? "#tableta" : "" }}</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="codMuestra" header="Cod Muestra" v-if="props.showColum">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4></h4>
              <h5></h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="leyAg" header="Ley Ag" v-if="props.showColum">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4></h4>
              <h5></h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="leyFe" header="Ley Fe" v-if="props.showColum">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4></h4>
              <h5></h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="leyMn" header="Ley Mn" v-if="props.showColum">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4></h4>
              <h5></h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="leyPb" header="Ley Pb" v-if="props.showColum">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4></h4>
              <h5></h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="leyZn" header="Ley Zn" v-if="props.showColum">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4></h4>
              <h5></h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="abastecimiento" header="Fech Abast" v-if="props.showColum">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4></h4>
              <h5></h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="Acciones" header="Acciones" v-if="props.showActionsColumn">
        <template #body="slotProps">
          <div className="btns">
            <button @click="openModal(slotProps.data)">Completar ></button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <Modal
    v-if="showModal"
    @cerrarModal="showModal = false"
    :showItem="props.showItem"
    :selectedTravelId="selectedTravelId"
  />
</template>

<style lang="scss">
.c-global-header {
  width: 100%;
  padding: 1.5rem 2.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  .global-h-title {
    span {
      color: var(--grey-1);
      font-size: clamp(6px, 8vw, 14px);
      line-height: 1.1rem;
      font-weight: 400;
    }
  }
  .global-h-button {
    .radio-inputs {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      border-radius: 12px;
      background-color: var(--grey-light-1);
      box-sizing: border-box;
      padding: 6px;
      width: 300px;
      font-size: 14px;
    }

    .radio-inputs .radio {
      flex: 1 1 auto;
      text-align: center;
    }

    .radio-inputs .radio input {
      display: none;
    }

    .radio-inputs .radio .name {
      display: flex;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: none;
      padding: 0.5rem 0;
      color: var(--grey-1);
      transition: all 0.15s ease-in-out;
    }

    .radio-inputs .radio input:checked + .name {
      background-color: var(--primary);
      color: var(--white);
      font-weight: 500;
    }
  }
  //   @include md {
  //     padding: 1.5rem 5rem;
  //   }
}

.c-global-c-content {
  display: flex;
  flex-direction: column;
  padding: 0 2.5rem;
  padding-bottom: 1rem;
  gap: 1rem;
  flex: 1 1;
  overflow: hidden;
  .users-c-c-filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    .c-c-filters-search {
      display: flex;
      position: relative;
      max-width: 300px;
      width: 100%;
      img {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 15px;
        width: 1rem;
      }
    }
    .c-c-filters-type {
      flex: 1 1 250px;
      label {
        font-size: clamp(5px, 8vw, 10px);
        font-weight: 500;
        //   @include md {
        //     font-size: clamp(6px, 8vw, 12px);
        //   }
      }
      .imputs-i-input {
        position: relative;
        img {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 15px;
          width: 1rem;
        }
      }
    }
    .c-c-filters-items {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: clamp(6px, 8vw, 14px);
      // @include md {
      //   font-size: clamp(6px, 8vw, 13px);
      // }
    }
  }
  // .users-c-c-table {
  //   display: flex;
  //   flex-direction: column;
  //   align-items: flex-start;
  //   overflow: auto;

  //   table {
  //     width: 100%;
  //     color: var(--black);
  //     font-size: clamp(6px, 8vw, 14px);
  //     line-height: 0.7rem;
  //     font-weight: 500;
  //     border-collapse: collapse;
  //     white-space: nowrap;
  //     // @include md {
  //     //   font-size: clamp(6px, 8vw, 14px);
  //     //   line-height: 1.1rem;
  //     // }
  //   }

  //   thead {
  //     color: var(--grey-1);
  //     text-align: left;
  //     background-color: var(--grey-light-1);
  //     font-size: clamp(6px, 8vw, 11px);
  //     position: sticky;
  //     top: 0;
  //     z-index: 1;
  //     // @include md {
  //     //   font-size: clamp(6px, 8vw, 12px);
  //     // }
  //   }

  //   th {
  //     padding: 15px 12px;
  //     font-weight: normal !important;
  //     div {
  //       display: flex;
  //       align-items: center;
  //       gap: 0.4rem;
  //       img {
  //         width: 0.5rem;
  //         // @include md {
  //         //   width: 0.6rem;
  //         // }
  //       }
  //       //   @include md {
  //       //     gap: 0.5rem;
  //       //   }
  //     }
  //   }

  //   td {
  //     padding: 9px 12px;

  //     // @include md {
  //     //   padding: 15px;
  //     // }
  //   }

  //   tbody tr {
  //     z-index: 99;
  //     background-color: var(--white);
  //   }
  // }
  .users-c-c-footer {
    display: flex;
    justify-content: space-between;
    .c-c-footer-page {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      button {
        height: 30px;
        width: 30px;
        padding: 0;
        border: 0.5px solid var(--grey-light-2);
        display: grid;
        place-items: center;
        border-radius: 5px;
        img {
          width: 0.7rem;
        }
        &:nth-child(1) {
          img {
            transform: rotate(90deg);
          }
        }
        &:nth-child(3) {
          img {
            transform: rotate(270deg);
          }
        }
        &:hover {
          background-color: #f3f3f4;
        }
      }
      span {
        display: flex;
        gap: 0.5rem;
        font-size: clamp(6px, 8vw, 12px);
        //   @include md {
        //     font-size: clamp(6px, 8vw, 13px);
        //   }
      }
    }
  }
  // @include md {
  //   padding: 3rem;
  // }
}
//   @include md {
//     gap: 1.5rem;
//     padding: 1.5rem 5rem;
//   }

.btns {
  display: flex;
  gap: 1rem;
  button {
    padding: 0;
    width: auto;
    display: grid;
    place-items: center;
    background-color: var(--white);
    padding: 8px 14px;
    border-radius: 10px;
    color: var(--primary);
    border: 1px solid var(--primary);
    font-weight: 500;
    img {
      width: 1rem;
    }
    &:hover {
      background-color: var(--primary);
      color: var(--white);
    }
  }
}

.td-user {
  display: flex;
  align-items: center;
  gap: 1rem;
  .t-siglas {
    width: 35px;
    height: 35px;
    background-color: #00b47e;
    color: var(--white);
    text-transform: uppercase;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: clamp(7px, 8vw, 16px);
  }
  .t-name {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    h4 {
      text-transform: capitalize;
    }
    h5 {
      text-transform: lowercase;
      font-size: clamp(6px, 8vw, 12px);
      line-height: 0.8rem;
      color: var(--grey-1);
      //   @include md {
      //     font-size: clamp(6px, 8vw, 12px);
      //   }
    }
    h4 {
      font-weight: 500;
      font-size: clamp(6px, 8vw, 14px);
      //   @include md {
      //     font-size: clamp(6px, 8vw, 14px);
      //   }
    }
    .t-2 {
      text-transform: capitalize;
    }
  }
}

.td-cot {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  img {
    width: 1.1rem;
  }
  h4 {
    text-transform: uppercase;
    font-weight: 500;
    font-size: clamp(6px, 8vw, 12px);
    // @include md {
    //   font-size: clamp(6px, 8vw, 14px);
    // }
  }
}

.t-cort {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
  font-size: clamp(6px, 8vw, 14px);
}
</style>
