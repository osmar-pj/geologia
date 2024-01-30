<script setup>
import {
  watch,
  ref,
  defineProps,
  defineEmits,
  onMounted,
  computed,
  inject,
  reactive,
} from "vue";
import { useStore } from "vuex";
import CreateRuma from "../components/CreateRuma.vue";
import Success from "../components/Success.vue";
import Edit from "../icons/Edit.vue";
import IMore from "../icons/IMore.vue";
import IMinus from "../icons/IMinus.vue";

const url = import.meta.env.VITE_API_URL;
const props = defineProps(["data"]);
const emit = defineEmits();
const cerrarModal = () => {
  emit("cerrarModal");
};
const store = useStore();
const dataTajo = ref([]);
// const selectedTipo = ref(props.data.type ? props.data.type : "TAJO");
// const selectedTajo = ref(props.data.tajo ? { name: props.data.tajo } : "");
const selectedRuma = ref("");
const showError = ref(false);
const buttonClicked = ref(false);
const showSuccessM = ref(false);
const showForm = ref(true);

// const handleTipoChange = () => {
//   if (selectedTipo.value === "AVANCE") {
//     selectedTajo.value = "AVANCE";
//   } else if (selectedTipo.value === "TAJO") {
//     selectedTajo.value = "";
//   }
// };

// watch(selectedTipo, handleTipoChange);

onMounted(async () => {
  await store.dispatch("ruma_list");
  await store.dispatch("tajo_list");
  dataTajo.value = store.state.tajoList;
});

const dataRuma = computed(() => {
  return store.state.rumaList;
});

const hideError = () => {
  showError.value = false;
};

const totalWagons = 10;
const data = ["Polimetalico", "Alabandita"];
const counts = reactive(data.map(() => totalWagons / data.length));

const increase = (index) => {
  if (counts.reduce((acc, val) => acc + val, 0) < totalWagons) {
    counts[index]++;
  }
};

const decrease = (index) => {
  if (counts[index] > 0) {
    counts[index]--;
  }
};

const updateCount = (index, event) => {
  const value = parseInt(event.target.value, 10);
  counts[index] = isNaN(value) ? 0 : Math.min(value, totalWagons);
};
const updateTravel = async () => {
  if (
    (!selectedTipo.value && selectedTipo.value !== 0) ||
    !selectedTajo.value ||
    !selectedTajo.value.name ||
    !selectedRuma.value ||
    !selectedRuma.value.ruma_Id
  ) {
    showError.value = true;
    setTimeout(hideError, 5000);
  } else {
    try {
      buttonClicked.value = true;
      const updatedTravel = {
        ...props.data,
        type: selectedTipo.value,
        tajo: selectedTajo.value.name,
        ruma: selectedRuma.value.ruma_Id,
        statusGeology: "QualityControl",
      };

      const response = await fetch(`${url}/triplist/${props.data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTravel),
      });

      const result = await response.json();

      if (result.status === true) {
        console.log("Correcto");
        await store.dispatch("get_list");
        console.log("UPDATED", result.data);
        await store.commit("addDataListControlCalidad", result.data);
        cerrarModal();
      } else {
        console.log("error");
        buttonClicked.value = false;
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  }
};
</script>

<template>
  <div class="modalCreate-backg">
    <form
      class="mCreate-content mCreate-3 inner"
      :style="{
        userSelect: buttonClicked ? 'none' : 'auto',
        pointerEvents: buttonClicked ? 'none' : 'auto',
      }"
    >
      <div class="mC-c-header">
        <div class="mC-h-title">
          <div class="mC-c-title-icon">
            <Edit />
          </div>
          <div class="mC-c-title-text">
            <h2>Completar campos</h2>
            <h4>Rellenar la información restante del viaje</h4>
          </div>
        </div>
        <span @click="cerrarModal" class="mC-h-close" type="button">
          <img src="../assets/img/i-close.svg" alt="" />
        </span>
      </div>
      <div class="mC-c-body">
        <!-- <div className="mC-b-info">
          <h3 class="item-text">{{ data.operator }}</h3>
          <div class="item-descrip">
            <h5>Camión</h5>
            <h4>{{ data.tag }}</h4>
          </div>
          <div class="item-descrip">
            <h5>Toneladas</h5>
            <h4>{{ data.tonh }} <small>TMH</small></h4>
          </div>
          <div class="item-descrip">
            <h5>Tajo</h5>
            <h4>{{ data.tajo }}</h4>
          </div>
          <div class="item-descrip">
            <h5>Dominio</h5>
            <h4>{{ data.dominio }}</h4>
          </div>
        </div> -->
        <div class="mC-b-imputs">
          <div
            v-for="(item, index) in data"
            :key="index"
            class="container-count"
          >
            <div class="count-item">
              <div class="count-info">
                <img
                  :src="'../assets/img/i-' + item.toLowerCase() + '.svg'"
                  alt=""
                />
                <span>{{ item }}</span>
              </div>
              <div class="count-input">
                <button class="button-number" @click="decrease(index)">
                  <IMinus />
                </button>
                <input
                class="input-number no-spinners"
                  type="number"
                  :value="counts[index]"
                  @input="updateCount(index, $event)"
                  />
                  <button class="button-number" @click="increase(index)">
                    <IMore />
                  </button>
              </div>
            </div>
            <div class="count-item">
              <Dropdown
                  class="p-dropdown-search"
                  filter
                  v-model="selectedTajo"
                  :options="dataTajo"
                  optionLabel="name"
                  placeholder="Seleccionar"
                />
            </div>
          </div>
        </div>
        <!-- <div className="mC-b-imputs" v-if="!data.type || !data.tajo">
          <div class="radio-inputs">
            <label>
              <input
                class="radio-input"
                type="radio"
                name="radio"
                v-model="selectedTipo"
                value="TAJO"
                id="tajo-radio"
                checked
              />
              <span class="radio-tile">
                <span class="radio-label">Tajo</span>
                <p class="radio-info">Mina a Tajo Abierto</p>
              </span>
            </label>
            <label>
              <input
                class="radio-input"
                type="radio"
                name="radio"
                v-model="selectedTipo"
                value="AVANCE"
                id="avance-radio"
              />
              <span class="radio-tile">
                <span class="radio-label">Avance</span>
                <p class="radio-info">Mina Subterránea</p>
              </span>
            </label>
          </div>
          <Transition name="fade" mode="out-in">
            <div
              class="mC-imputs-item"
              v-if="selectedTipo === 'TAJO' && (!data.type || !data.tajo)"
            >
              <label>Seleccione Tajo</label>
              <div class="imputs-i-input">
                <Dropdown
                  class="p-dropdown-search"
                  filter
                  v-model="selectedTajo"
                  :options="dataTajo"
                  optionLabel="name"
                  placeholder="Seleccionar"
                />
              </div>
              <span class="label-error" v-if="showError"
                >*Seleccionar campo requerido</span
              >
            </div>
          </Transition>
        </div> -->
        <div className="mC-b-imputs">
          <div class="mC-imputs-item">
            <label>Seleccione Ruma</label>
            <div class="imputs-i-input">
              <Dropdown
                class="p-dropdown"
                v-model="selectedRuma"
                :options="dataRuma"
                optionLabel="ruma_Id"
                placeholder="Seleccionar"
              />
            </div>
          </div>
          <CreateRuma />
          <span class="label-error" v-if="showError"
            >*Seleccionar campo requerido</span
          >
        </div>
      </div>
      <div class="mC-c-footer">
        <template v-if="buttonClicked">
          <div class="loader"></div>
        </template>
        <template v-else>
          <button @click="cerrarModal" class="btn-cancel" type="button">
            Cancelar
          </button>
          <button
            class="btn-success"
            type="submit"
            @click.prevent="updateTravel()"
          >
            Guardar
          </button>
        </template>
      </div>
    </form>
  </div>
</template>

<style lang="scss">
.container-count {
  flex: 1 1 150px;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  gap: 1rem;
  padding: 15px 20px;
  border: 1px solid var(--grey-light-2);
  border-radius: 10px;
  .count-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    .count-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 5rem;
        height: 3rem;
      }
      span {
        color: var(--black);
        transition: 0.375s ease;
        text-align: left;
        font-size: clamp(6px, 8vw, 14px);
        line-height: 1.2rem;
        font-weight: 500;
      }
    }
    .count-input {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.25rem;
      .input-number {
        width: 40px;
        height: 40px;
        color: var(--black);
        padding: 0;
        text-align: center;
      }
      .button-number {
        width: 35px;
        height: 35px;
        color: var(--grey-2);
        background-color: var(--grey-light-22);
        padding: 0;
        display: grid;
        place-items: center;
        svg {
          fill: transparent;
          color: var(--grey-2);
          width: 1.2rem;
          height: 1.2rem;
          stroke-width: 2;
        }
        &:hover {
          background-color: var(--primary);
          svg {
            color: var(--white);
          }
        }
        &:active {
          transform: scale(0.85);
        }
      }
    }
  }
}
.label-error {
  font-size: clamp(6px, 8vw, 12px);
  color: rgb(243, 89, 89);
  font-weight: 600;
  line-height: 0.8rem;
  margin-top: 0.1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.mCreate-3 {
  max-width: 500px !important;
}

.no-spinners::-webkit-inner-spin-button,
.no-spinners::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
