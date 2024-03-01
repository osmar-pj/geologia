<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import IFilter from "../icons/IFilter.vue";
import IDrag from "../icons/IDrag.vue";
import IStart from "../icons/IStart.vue";
import IClose from "../icons/IClose.vue";
import ICategory from "../icons/ICategory.vue";
import IItem from "../icons/IItem.vue";
import ICalendar from "../icons/ICalendar.vue";

const url = import.meta.env.VITE_API_URL;
const store = useStore();
const dataFilters = ref([]);
const selectedCategories = ref([]);
const draggableItem = ref([null]);
const showFilters = ref(false);
const showError = ref(false);
const buttonClicked = ref(false);
const selectedEstado = ref(new Date());

let today = new Date();
let month = today.getMonth();
let year = today.getFullYear();
let prevMonth = month < 6 ? 12 - (6 - month) : month - 6;
let prevYear = month < 6 ? year - 1 : year;
const minDate = ref(new Date());
const maxDate = ref(new Date());
minDate.value.setMonth(prevMonth);
minDate.value.setFullYear(prevYear);

const openModal = () => {
  showFilters.value = true;
};
const cerrarModal = () => {
  showFilters.value = false;
};

const cleanFilter = () => {
  selectedCategories.value = [];
  store.commit("filtroAplicado", false);
  cerrarModal();
};

onMounted(async () => {
  await store.dispatch("get_listCancha");
  dataFilters.value = store.state.dataListCancha.grouped;
});

const hideError = () => {
  showError.value = false;
};
const handleDragStart = (index) => {
  draggableItem.value = index;
};

const handleDragOver = (event) => {
  event.preventDefault();
};
const handleDragEnd = () => {
  draggableItem.value = null;
};
const handleDrop = (index) => {
  const droppedItem = selectedCategories.value.splice(
    draggableItem.value,
    1
  )[0];
  selectedCategories.value.splice(index, 0, droppedItem);
  draggableItem.value = null;
  console.log(selectedCategories.value);
};
const deselectItem = (index) => {
  selectedCategories.value.splice(index, 1);
};

const sendFilter = async () => {
  if (selectedCategories.value.length === 0) {
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
    }, 5000);
  } else {
    try {
      console.log("Ingresando");
      buttonClicked.value = true;

      const response = await fetch(`${url}/listGeneral`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": true,
        },
        body: JSON.stringify({
          ts: selectedEstado.value.getTime(),
          arr: selectedCategories.value,
          category: "trips",
        }),
      });

      const data = await response.json();
      if (data.status === true) {
      
        store.dispatch("filter_list", data.data);
        cerrarModal();
        buttonClicked.value = false;
        store.commit("filtroAplicado", true);
      } else {
        console.log("error");
        buttonClicked.value = false;
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      buttonClicked.value = false;
    }
  }
};

const SendValues = async () => {
  store.commit('getValuesPDF', {
    ts: selectedEstado.value.getTime(),
    arr: selectedCategories.value,
    category: "trips"
  });
};
</script>
<template>
  <button class="btn-filters" @click="openModal()">
    <IFilter />
    Filtrar <span>{{ selectedCategories.length }}</span>
  </button>
  <Transition :duration="550" name="filter">
    <div
      class="modalFilters-backg"
      v-if="showFilters"
      @cerrarModal="showFilters = false"
    >
      <form
        class="modalFilters-content inner"
        :style="{
          userSelect: buttonClicked ? 'none' : 'auto',
          pointerEvents: buttonClicked ? 'none' : 'auto',
        }"
      >
        <div class="mF-c-header">
          <div class="mF-h-title">
            <h2>Filtrar</h2>
          </div>
          <span @click="cerrarModal" class="mF-h-close" type="button">
            <img src="../assets/img/i-close.svg" alt="" />
          </span>
        </div>
        <div class="mF-c-body">
          <div>
            <button class="btn-success" @click.prevent="SendValues()">
          Guardar valores para PDF
        </button>
          </div>
          <div class="mF-b-categories">
            <div class="categories-title">
              <ICategory /><span> Fecha </span>
            </div>
            <div class="categories-contenedor">
              <Calendar
                v-model="selectedEstado"
                view="month"
                :minDate="minDate"
                :maxDate="maxDate"
                :manualInput="false"
                dateFormat="mm/yy"
                aria-placeholder="mm/yy"
                showIcon
                iconDisplay="input"
                :yearNavigator="true"
              >
                <template #inputicon="{ clickCallback }">
                  <ICalendar />
                </template>
              </Calendar>
            </div>
          </div>
          <div class="mF-b-categories">
            <div class="categories-title">
              <ICategory /><span>
                Categorias ({{ selectedCategories.length }})</span
              >
            </div>
            <div class="categories-contenedor">
              <div class="mF-imputs-item" v-if="store.state.loading">
                <div class="loader"></div>
              </div>
              <div
                v-for="category of dataFilters"
                :key="category.title"
                class="mF-imputs-item"
              >
                <Checkbox
                  v-model="selectedCategories"
                  :inputId="category.title"
                  name="category"
                  :value="category.field"
                />
                <label :for="category.title">{{ category.title }}</label>
              </div>
            </div>
          </div>
          <span class="label-error" v-if="showError"
            >*Selecciona al menos un item</span
          >
          <div class="mF-b-categories">
            <div class="categories-title">
              <IItem /><span>
                Items seleccionados ({{ selectedCategories.length }})</span
              >
            </div>
            <div class="categories-items">
              <TransitionGroup name="list" tag="ul">
                <li
                  v-for="(item, index) in selectedCategories"
                  :key="index"
                  :draggable="true"
                  @dragstart="handleDragStart(index)"
                  @dragover="handleDragOver"
                  @drop="handleDrop(index)"
                  @dragend="handleDragEnd"
                  :class="{ dragend: index, draggableItem }"
                  class="views-item"
                >
                  <div class="item-info">
                    <IDrag />
                    <span>
                      {{ item }}
                    </span>
                  </div>
                  <button
                    class="item-delete"
                    @click="deselectItem(index)"
                    type="button"
                  >
                    <IClose />
                  </button>
                </li>
              </TransitionGroup>
            </div>
          </div>
          <div></div>
        </div>
        <div class="mF-c-footer">
          <button @click="cleanFilter" class="btn-cancel" type="button">
            Limpiar
          </button>
          <button @click.prevent="sendFilter" class="btn-success" type="submit">
            <template v-if="buttonClicked">
              <span class="loader"></span> Proces...
            </template>
            <template v-else> <IStart /> Filtrar </template>
          </button>
        </div>
      </form>
    </div>
  </Transition>
</template>

<style lang="scss"></style>
