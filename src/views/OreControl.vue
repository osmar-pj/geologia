<script setup>
import { ref, onMounted, computed, inject } from "vue";
import { useStore } from "vuex";
import Edit from "../icons/Edit.vue";
import OCModal from "../components/OCModal.vue";
import {formatDate, formatFixed, formatArrayField} from "../libs/utils";

const store = useStore()
const socket = inject("socket")
socket.on("OreControl", (data) => {
  store.commit("addDataListOreControl", data)
});

onMounted(async () => {
  await store.dispatch("get_list")
});

const data = computed(() => {
  return store.state.dataList;
});

const modalData = ref(null);
const showOCModal = ref(false);
const openModal = (data) => {
  modalData.value = data;
  showOCModal.value = true;
};

const formatColumnValue = (value, fn, field, row) => {
  switch (fn) {
    case "date":
      return formatDate(value);
    case "fixed":
      return formatFixed(value);
    case "arr":
      if (field === "destiny") {        
        const result = row.destiny.join(',');
        return result;

      } else if (field === "dominio") {       
        if (row.materials && row.materials.length > 0) {
          return row.materials.map(i => i.material).join(', ');
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


</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Viajes, Ore Control</h1>
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
      :loading="store.state.loading"

    >
      <Column selectionMode="multiple" headerStyle="width: 2.5rem"> </Column>     
      <Column
        v-for="(header, index) in data.header"
        :key="index"
        :field="header.field"
        :header="header.title"       
      >
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>
                <Skeleton v-if="store.state.loading" height="100px"></Skeleton>
                <span v-else>
                {{
                  formatColumnValue(
                    slotProps.data[header.field],
                    header.fn,
                    header.field,
                    slotProps.data
                  )
                }}
                </span>
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
    <OCModal
      v-if="showOCModal"
      @cerrarModal="showOCModal = false"
      :data="modalData"
    />
  </Transition>
</template>

<style lang="scss">

</style>
