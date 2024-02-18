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
      const response = await fetch(`${url}/listGeneral`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": true,
        },
        body: JSON.stringify({ arr: selectedCategories.value }),
      });

      const data = await response.json();
     
      if (data.status === true) {
        console.log(data)  
        store.dispatch("filter_list", data);
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
.btn-filters {
  background-color: var(--white);  
  border: 1px solid var(--grey-light-2);
  border-radius: 8px;
  min-width: 100px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease-out;
  color: var(--black);
  gap: 0.5rem;
  svg {
    fill: transparent;
    color: var(--grey-2);
    stroke-width: 1.5;
    width: 1.4rem;
    height: 1.4rem;
  }
  span {
    background-color: var(--grey-light-11);
    border-radius: 5px;
    padding: 0;
    min-width: 22px;
    height: 22px;
    font-weight: 450;
    font-size: clamp(6.5px, 8vw, 13px);
    display: grid;
    place-items: center;
  }
}
.modalFilters-backg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 5;
  overflow: hidden;
  .modalFilters-content {
    position: absolute;
    right: 0;
    top: 0;
    max-width: 350px;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    background-color: var(--white);

    .mF-c-header {
      padding: 1.5rem;

      .mF-h-title {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.1rem;
        text-align: left;

        h2 {
          font-size: clamp(6px, 8vw, 18px);
          color: var(--black);
          font-weight: 600;
          letter-spacing: -0.03em;
        }
        
      }
      .mF-h-close {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background-color: var(--grey-light-1);
        cursor: pointer;
        display: grid;
        place-items: center;
        transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
        img {
          width: 0.5rem;
          // @include md {
          //   width: 0.6rem;
          // }
        }
        padding: 0;
        &:hover {
          background-color: var(--grey-light-22);
        }
        // @include md {
        //   width: 30px;
        //   height: 30px;
        //   top: 20px;
        //   right: 40px;
        // }
      }
    }
    .mF-c-body {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 0.5rem 1.5rem;
      overflow: auto;
      flex: 1 1;
      .mF-b-categories {
        .categories-title {
          padding-bottom: .8rem;
          display: flex;
          align-items: center;
          gap: .5rem;
          span {
            font-size: clamp(6px, 8vw, 14px);
            line-height: 0.8rem;
            color: var(--grey-2);
            font-weight: 500;
          }
          svg{
            width: 1.4rem;
                  height: 1.4rem;
                  color: var(--grey-light-3);
                  fill: transparent;
                  stroke-width: 1.7;
          }
        }
        .categories-contenedor {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          .mF-imputs-item {
            flex: 1 1 100px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            label {
              font-size: clamp(6px, 8vw, 12.5px);
              line-height: 0.8rem;
            }
          }
        }
        .categories-items {
          border: 1px solid var(--grey-light-22);
          border-radius: var(--br-m);
          padding: 1rem;
          ul {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
            .views-item {
              padding: 6px 15px;
              border-radius: var(--br-m);
              background-color: var(--grey-light-11);
              font-size: clamp(6px, 8vw, 12.5px);
              line-height: 0.8rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 0.5rem;
              transition: all 0.35s ease-in;
              cursor: pointer;
              &:hover {
                background-color: var(--white);
                box-shadow: 0 0px 15px rgba(0, 0, 0, 0.1);
                transform: scale(1.05);
              }
              &:active {
                transform: scale(1.02);
                background-color: var(--white);
                box-shadow: 0 0px 20px rgba(0, 0, 0, 0.1);
              }
              .item-info {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                svg {
                  width: 1.4rem;
                  height: 1.4rem;
                  color: var(--grey-light-3);
                  fill: transparent;
                  stroke-width: 1.7;
                }
              }
              .i-selecte-active {
                padding-top: 0.2rem;
                font-size: clamp(6px, 8vw, 10px);
                line-height: 0.6rem;
                color: var(--grey-light-3);
              }
            }
          }
        }
      }
    }
    .mF-c-footer {
      padding: 1.5rem;
      display: flex;
      gap: .5rem;

      .btn-success {
        background-color: var(--primary);
        &:hover {
          background-color: var(--secondary);
        }
      }
    }
  }
}

.item-delete {
  width: auto;
  height: auto;
  display: grid;
  place-items: center;
  padding: 3px;
  border-radius: var(--br-s);
  svg {
    color: var(--grey-light-3);
    fill: transparent;
    width: 1.4rem !important;
    height: 1.4rem !important;
    stroke-width: 1.5;
  }
  &:hover {
    transform: scale(1.02);
    svg {
      color: var(--red);
    }
  }
}
</style>
