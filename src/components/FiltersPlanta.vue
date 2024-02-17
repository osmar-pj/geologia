<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import IFilter from "../icons/IFilter.vue";
import IDrag from "../icons/IDrag.vue";
import IStart from "../icons/IStart.vue";
import IClose from "../icons/IClose.vue";
import ICategory from "../icons/ICategory.vue";
import IItem from "../icons/IItem.vue";

const url = import.meta.env.VITE_API_URL;
const store = useStore();

const dataFilters = ref([]);
const selectedCategories = ref([]);
const draggableItem = ref([null]);
const showFilters = ref(false);
const showError = ref(false);
const buttonClicked = ref(false);

const openModal = () => {
  showFilters.value = true;
};
const cerrarModal = () => {
  showFilters.value = false;
};

const cleanFilter = () => {
  selectedCategories.value = [];
  sendFilter();
  cerrarModal();
};

onMounted(async () => {
  await store.dispatch("get_listFilters");
  dataFilters.value = store.state.dataListFilters.columns.filter(
    (i) => i.type === "object"
  );
  await sendFilter();
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
    try {
      buttonClicked.value = true;
      const response = await fetch(`${url}/plantalist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": true,
        },
        body: JSON.stringify({ arr: selectedCategories.value }),
      });

      const data = await response.json();
      console.log(data);
      if (data.status === true) {
        store.dispatch("filter_Planta", data);
        cerrarModal();
        buttonClicked.value = false;
      } else {
        console.log("error");
        buttonClicked.value = false;
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      buttonClicked.value = false;
    }  
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
          <div class="mF-b-categories">
            <div class="categories-title">
              <ICategory /><span> Categorias ({{ selectedCategories.length }})</span>
            </div>
            <div class="categories-contenedor">
              <div class="mF-imputs-item" v-if="store.state.loading">
                <div class="loader"></div>
              </div>
              <div
                v-for="category of dataFilters"
                :key="category.key"
                class="mF-imputs-item"
              >
                <Checkbox
                  v-model="selectedCategories"
                  :inputId="category.key"
                  name="category"
                  :value="category.name"
                />
                <label :for="category.key">{{ category.name }}</label>
              </div>
            </div>
            <span class="label-error" v-if="showError"
              >*Selecciona al menos un item</span
            >
          </div>
          <div class="mF-b-categories">
            <div class="categories-title">
              <IItem /><span> Items seleccionados ({{ selectedCategories.length }})</span>
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
        </div>
        <div class="mF-c-footer">
          <button @click="cleanFilter" class="btn-cancel" type="button">
            Limpiar
          </button>
          <button
              @click.prevent="sendFilter"
              class="btn-success"
              type="submit"
            >
          <template v-if="buttonClicked">
            <span class="loader"></span> Proces...
          </template>
          <template v-else>
              <IStart /> Filtrar
            </template>
          </button>
        </div>
      </form>
    </div>
  </Transition>
</template>

<style lang="scss">

</style>
