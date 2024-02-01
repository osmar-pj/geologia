<script setup>
import { ref, onMounted, computed, inject} from "vue";
import { useStore } from "vuex";
import Edit from "../icons/Edit.vue";
import CCModal from "../components/CCModal.vue";
import {formatDate, formatFixed, formatArrayField} from "../libs/utils";

const store = useStore()
const socket = inject("socket")
socket.on('pilas', (data) => {
    console.log(data)
})
onMounted(async () => {
    await store.dispatch('get_listControl')
    console.log(data.value)
})

const data = computed(() => {return store.state.dataListControl})
const showCCModal = ref(false);
const modalData = ref(null);

const openDelete = (data) => {
  modalData.value = data;
  showModalDelete.value = true;
}
const openModal = (data) => {
  modalData.value = data;
    showCCModal.value = true;
};

const formatColumnValue = (value, fn, field, row) => {
  switch (fn) {
    case "date":
      return formatDate(value);
    case "fixed":
      return formatFixed(value);
    case "arr":
      if (field === "ubication") {
        return formatArrayField(value, "destiny", row);
      } else if (field === "dominio") {       
        if (row.materials && row.materials.length > 0) {
          return row.materials.map(material => material.material).join(', ');
        } else if (row.dominio) {
          return row.dominio;
        }
        
        return ""; 
      }
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
        <span>{{ data.data ? data.data.length : 0 }}</span>
      </div>
      <span>| Dia terminado en Mina </span>
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
  <div class="tableContainer">
    <DataTable
      :value="data.data"
      tableStyle="width: 100%"
      paginator
      :rows="20"
      paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Página {currentPage} de {totalPages}"
    >
      <Column selectionMode="multiple" headerStyle="width: 2.5rem"> </Column>
      <!-- <Column header="#" headerStyle="width:3rem">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column> -->
      <Column
        v-for="(header, index) in data.header"
        :key="index"
        :field="header.field"
        :header="header.title"
        sortable
      >
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>
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
        </template>
      </Column>
      <Column field="Acciones" header="Acciones">
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
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <Transition :duration="550" name="nested">
    <CCModal
      v-if="showCCModal"
      @cerrarModal="showCCModal = false"
      :data="modalData"
    />
  </Transition>
  <!-- <Transition :duration="550" name="nested">
    <DeleteModal
      v-if="showModalDelete"
      @cerrarModal="showModalDelete = false"
      :data="modalData"
    />
  </Transition> -->
</template>

<style lang="scss">
</style>
