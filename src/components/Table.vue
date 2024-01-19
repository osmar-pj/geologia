<script setup>
import { ref, defineProps} from "vue";
import { useStore } from "vuex";
import OCModal from "../components/OCModal.vue";
import CCModal from "../components/CCModal.vue";
import Delete from "../components/Delete.vue";
import SkeletonLoader from "../components/SkeletonLoader.vue";

const props = defineProps(["showActionsColumn", "title", "data", "showColum", "showItem"]);
const store = useStore();
const showModalDelete = ref(false);
const showOCModal = ref(false);
const showCCModal = ref(false);
const modalData = ref(null);

const openModal = (data) => {
  modalData.value = data;

  if (data.statusGeology === "QualityControl") {
    showCCModal.value = true;
    showOCModal.value = false;
  } else if (data.statusGeology === "OreControl") {
    showCCModal.value = false;
    showOCModal.value = true;
  }
};
const openDelete = (data) => {
  modalData.value = data;
  showModalDelete.value = true;
};

</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>
          {{ props.title || "Viajes realizados, Completos" }}
        </h1>
        <span>{{ data.length }}</span>
      </div>
      <span>Hoy| Dia terminado en Mina </span>
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
  <SkeletonLoader :loading="store.state.loading" />
  <div class="c-global-c-content" v-if="!store.state.loading">
    <DataTable
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
              <h5>{{ slotProps.data.hora }} hora</h5>
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
      <Column field="operador" header="Operador" sortable>
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
      <Column field="vagones" header="Vagones">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>
                {{
                  slotProps.data.vagones !== 0 ? slotProps.data.vagones : "-"
                }}
              </h4>
              <h5>
                {{ slotProps.data.vagones !== 0 ? "vagones" : "No aplica" }}
              </h5>
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
              <h4>{{ slotProps.data.tajo || "faltante" }}</h4>
              <h5>{{ slotProps.data.tipo || "faltante" }}</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="ruma" header="Nro Ruma" >
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.ruma }}</h4>
              <h5>{{ slotProps.data.ruma ? "#ruma" : "" }}</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="ley_ag" header="Ley Ag" v-if="props.showColum">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.ley_ag }}</h4>
              <h5>valor</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="ley_fe" header="Ley Fe" v-if="props.showColum">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.ley_fe }}</h4>
              <h5>valor</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="ley_mn" header="Ley Mn" v-if="props.showColum">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.ley_mn }}</h4>
              <h5>valor</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="ley_pb" header="Ley Pb" v-if="props.showColum">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.ley_pb }}</h4>
              <h5>valor</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="ley_zn" header="Ley Zn" v-if="props.showColum">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.ley_zn }}</h4>
              <h5>valor</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="statusMina" header="Status" sortable>
        <template #body="slotProps">
          <h4
            :class="{
              'td-status': true,
              't-completo': slotProps.data.statusMina === 'completo',
              't-incompleto': slotProps.data.statusMina === 'incompleto',
            }"
          >
            {{ slotProps.data.statusMina }}
          </h4>
        </template>
      </Column>
      <Column field="Acciones" header="Acciones" v-if="props.showActionsColumn">
        <template #body="slotProps">
          <div className="btns">
            <button @click="openModal(slotProps.data)" :userModal="store.state.userModal">Completar ></button>
            <button @click="openDelete(slotProps.data)" :userModal="store.state.userModal" v-if="props.showItem"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="/icons/delete-02-stroke-rounded.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#000000">
<path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path>
<path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path>
<path d="M9.5 16.5L9.5 10.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path>
<path d="M14.5 16.5L14.5 10.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path>
</svg></button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <Transition :duration="550" name="nested">
  <OCModal v-if="showOCModal" @cerrarModal="showOCModal = false" :data="modalData" />
</Transition>
<Transition :duration="550" name="nested">
  <CCModal v-if="showCCModal" @cerrarModal="showCCModal = false" :data="modalData"/>
</Transition>
  <Transition :duration="550" name="nested">
  <Delete v-if="showModalDelete" @cerrarModal="showModalDelete = false" :data="modalData"/>
</Transition>
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
    .g-h-t-primary {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      span {
        color: var(--grey-2);
        font-size: clamp(6px, 8vw, 14px);
        font-weight: 600;
        line-height: 1.1rem;
        background-color: var(--grey-light-1);
        padding: 2px 5px;
        border-radius: 8px;
      }
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
    display: grid;
    place-items: center;
    background-color: var(--white);
    color: var(--primary);
    border: 1px solid var(--primary);
    font-weight: 500;
    height: 40px;
    img {
      width: 1rem;
    }
    &:hover {
      background-color: var(--primary);
      color: var(--white);
    }
  }
}

.td-status {
    font-size: clamp(7px, 8vw, 13px);
    text-transform: capitalize;
    text-align: center;
    border-radius: 8px;
    padding: 5px 8px;
}
.t-completo {
  color: #45a452;
  background-color: #ebf9ea;
}
.t-incompleto {
  color: #ecb11a;
  background-color: #fdf7e9;
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
