<script setup>
import { ref, defineProps } from "vue";
import { useStore } from "vuex";
import OCModal from "../components/OCModal.vue";
import CCModal from "../components/CCModal.vue";
import DeleteModal from "../components/DeleteModal.vue";
import Edit from "../icons/edit.vue";
import Delete from "../icons/Delete.vue";
import SkeletonLoader from "../components/SkeletonLoader.vue";

const props = defineProps([
  "showActionsColumn",
  "title",
  "data",
  "showColum",
  "showItem",
]);
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
}
const hour = (t)  => {
  const date = new Date(t)
  const hour = `${date.getHours()}:${date.getMinutes()}`
  return hour
}

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
      <Column selectionMode="multiple" headerStyle="width: 2.5rem"></Column>
      <Column header="#" headerStyle="width:3rem">
        <template #body="slotProps">
            {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column field="fecha" header="Fecha" sortable>
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.date }}</h4>
              <h5>{{ hour(slotProps.data.timestamp) }} hora</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="turno" header="Turno" sortable>
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.turn }}</h4>
              <h5>turno</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="mina" header="Mina" sortable>
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.mining }}</h4>
              <h5>mina</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="operador" header="Operador" sortable>
        <template #body="slotProps">
          <div v-if="slotProps.data.operador" class="td-user">
            <span class="t-siglas">
              {{
                slotProps.data.operador
                  ? slotProps.data.operador
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word.charAt(0))
                      .join("")
                  : ""
              }}
            </span>
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
          <div v-else class="td-user">
            <h4 :class="{ 'text-red': slotProps.data.operador === '' }">
              --
            </h4>
          </div>
        </template>
      </Column>
      <Column field="tag" header="Tag/Ubicacion" sortable>
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4 :class="{ 'text-red': slotProps.data.tag === '' }">
                {{
                  slotProps.data.tag !== ""
                    ? slotProps.data.tag
                    : "faltante"
                }}
              </h4>

              <h5> {{ slotProps.data.ubication }} </h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="vagones" header="Vehiculo">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4 :class="{ 'text-red': slotProps.data.vagones === '' }">
                {{
                  slotProps.data.vagones !== null
                    ? slotProps.data.vagones
                    : "faltante"
                }}
              </h4>
              <h5>
                {{ slotProps.data.vagones !== 0 ? "camion" : "No aplica" }}
              </h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="toneladas" header="Toneladas">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.tonh.toFixed(2) }} TMH</h4>
              <h5>{{ slotProps.data.dominio }}</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="tajo" header="Tajo">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.tajo || "faltante" }}</h4>
              <h5>{{ slotProps.data.type || "faltante" }}</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="ruma" header="Nro Ruma">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.ruma }}</h4>
              <h5>{{ slotProps.data.ruma ? "#ruma" : "" }}</h5>
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
            <Button
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
            <!-- <Button
              outlined
              @click="openDelete(slotProps.data)"
              :userModal="store.state.userModal"
              v-if="props.showItem"
              class="item-btn table-btn-delete"
              v-tooltip.bottom="{
                value: 'Eliminar',
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
              <Delete />
            </Button> -->
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <Transition :duration="550" name="nested">
    <OCModal
      v-if="showOCModal"
      @cerrarModal="showOCModal = false"
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
  <Transition :duration="550" name="nested">
    <DeleteModal
      v-if="showModalDelete"
      @cerrarModal="showModalDelete = false"
      :data="modalData"
    />
  </Transition>
</template>

<style lang="scss">
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


</style>
