<script setup>
import { ref, onMounted, computed, inject, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import Edit from "../icons/Edit.vue";
import OCModal from "../components/OCModal.vue";
import {
  formatDate,
  formatFixed,
  formatDateAbas,
  formatHour,
} from "../libs/utils";

const store = useStore();
const socket = inject("socket");

socket.on("OreControl", (data) => {
  store.commit("addDataListOreControl", data);
});

onMounted(async () => {
  await store.dispatch("get_list");
});

onBeforeUnmount(() => {
  // Desconectar el socket al desmontar el componente
  socket.off("OreControl");
});
const excludedFields = [
  "mining",
  "ubication",
  "date",
  "tag",
  "statusPila",
  "vagones",
  "tonh",
];

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
        const result = row.destiny.join(",");
        return result;
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
  </div>
  <div class="tableContainer" >
    <DataTable
      :value="data.data"
      tableStyle="width: 100%"
      paginator
      :rows="20"
      paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Página {currentPage} de {totalPages}"
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
      <template v-for="(header, index) in data.header || []">
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
              <template
                v-if="
                  slotProps.data[header.field] !== '' &&
                  slotProps.data[header.field] !== null &&
                  slotProps.data[header.field] !== undefined &&
                  (!Array.isArray(slotProps.data[header.field]) ||
                    slotProps.data[header.field].length > 0)
                "
              >
                <h4 :class="{ 't-turn': header.field === 'turn' }">
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

      <Column header="Tonelada" headerStyle="text-align: center;">
        <template #body="slotProps">
          <Skeleton v-if="store.state.loading" height="34px"></Skeleton>
          <div v-else class="t-name">
            <h4>
              {{ slotProps.data.tonh.toFixed(2) }}
            </h4>
            <h5>toneladas</h5>
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

<style lang="scss"></style>
