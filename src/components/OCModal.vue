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
} from "vue"
import { useStore } from "vuex"
import CreateRuma from "../components/CreateRuma.vue"
import Success from "../components/Success.vue"
import Edit from "../icons/Edit.vue"
import IMore from "../icons/IMore.vue"
import IMinus from "../icons/IMinus.vue"
import IHelp from "../icons/IHelp.vue"
import IChange from "../icons/IChange.vue"

const url = import.meta.env.VITE_API_URL
const props = defineProps(["data"])
const emit = defineEmits()
const cerrarModal = () => {
  emit("cerrarModal")
}
const store = useStore()
const data = ref(props.data)
const isCamion = computed(() => data.value.carriage === "Camion")
const isVagones = computed(() => data.value.carriage === "Vagones")
const isSplitRequired = computed(() => data.value.splitRequired)
const numberOfMaterials = isSplitRequired.value
  ? data.value.materials.length
  : 1
const isOdd = (number) => number % 2 !== 0

const dataToUpdate = ref([])

const selectedDominio = ref();
const dominios = ref([
    { name: 'Ag/Alabandita'},
    { name: 'Ag/Carbonatos' },
    { name: 'Polimetálico' },
]);

dataToUpdate.value = isCamion.value
  ? [
      {
        type: data.value.type,
        tajo: data.value.tajo,
        pila: "",
        material: data.value.material,
        dominio:selectedDominio.value,
      },
    ]
  : isSplitRequired.value
  ? data.value.destiny.map((item, index) => {
      return {
        type: "TAJO",
        tajo: null,
        pila: item,
        dominio:
          numberOfMaterials == 1
            ? data.value.materials
            : data.value.materials[index].material,
        vagones:
          numberOfMaterials == 1
            ? data.value.vagones
            : data.value.materials[index].count,
      }
    })
  : [
      {
        type: "TAJO",
        tajo: null,
        // pila: data.value.ubication,
        dominio: data.value.dominio
      },
    ]

const dataTajo = ref([])

const selectedRuma = ref("")
const showError = ref(false)
const buttonClicked = ref(false)
const showSuccessM = ref(false)
const showForm = ref(true)

onMounted(async () => {
  await store.dispatch("tajo_list")
  await store.dispatch("pila_list")
  dataTajo.value = store.state.tajoList;
});

const dataPila = computed(() => {
  return store.state.pilaList;
});

const hideError = () => {
  showError.value = false;
};

const changeGibaForAll = () => {
  for (let i = 0; i < dataToUpdate.value.length - 1; i++) {
    const currentPila = dataToUpdate.value[i].pila;
    const nextPila = dataToUpdate.value[i + 1].pila;
    dataToUpdate.value[i].pila = nextPila;
    dataToUpdate.value[i + 1].pila = currentPila;
  }
}

const getImagePath = (imageName) => {
  switch (imageName) {
    case "POLIMETALICO":
      return "/src/assets/img/i-polimetalico.svg"
    case "ALABANDITA":
      return "/src/assets/img/i-alabandita.svg"
    case "DESMONTE":
      return "/src/assets/img/i-desmonte.svg"
    default:
      return "/src/assets/img/i-carbonato.svg"
  }
}

const updateTravel = async () => {
   try {
     buttonClicked.value = true
  console.log()
    const data = dataToUpdate.value.map((i) => {
      return {
        ...i,
        userId:store.state.user.userId,
      }
    })
   
    const response = await fetch(`${url}/trip/${props.data._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (result.status === true) {
      console.log("Correcto")
      await store.dispatch("get_list")
      // await store.commit("addDataListControlCalidad", result.data)
       cerrarModal()
     } else {
       console.log("error")
       buttonClicked.value = false
     }
   } catch (error) {
     console.error("Error al actualizar:", error)
     buttonClicked.value = false
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
            <h4>Rellenar información restante para terminar el viaje</h4>
          </div>
        </div>
        <span @click="cerrarModal" class="mC-h-close" type="button">
          <img src="../assets/img/i-close.svg" alt="" />
        </span>
      </div>

      <div class="mC-c-body">
        <div className="mC-b-info">
          <div class="item-descrip" v-if="isVagones && isSplitRequired">
            <!-- AGREGAR ESTILO DE WARNING O AVISO -->
            <div>Warning! Este viaje se debe dividir</div>
          </div>
          <h3 class="item-text">{{ data.operator }}</h3>
          <div class="item-descrip">
            <h5>{{ data.carriage }}</h5>
            <h4>{{ data.tag }}</h4>
          </div>
          <div class="item-descrip">
            <h5>Toneladas</h5>
            <h4>{{ data.tonh.toFixed(2) }} <small>TMH</small></h4>
          </div>
          <div class="item-descrip" v-if="!isSplitRequired">
            <h5>Tajo</h5>
            <h4 v-if="data.tajo">
              {{ data.tajo }}
            </h4>
            <div v-else class="t-nulo"><IHelp /> Por completar...</div>
          </div>
        </div>
        <div class="mC-b-imputs inputs-change" v-if="!isCamion">
          <div
            v-for="(item, index) in dataToUpdate"
            :key="index"
            class="container-count"
          >
            <span>
              Giba: <strong>{{ item.pila }}</strong>
            </span>
          </div>
          <button
            class="btn-change"
            @click.prevent="changeGibaForAll"
            v-if="isSplitRequired"
          >
            <IChange />
          </button>
        </div>

        <div class="mC-b-imputs">
          <div
            v-for="(item, index) in dataToUpdate"
            :key="index"
            class="container-count"
          >
            <div class="count-item">
              <div class="count-info">
                <img :src="getImagePath(item.dominio)" alt="" />
                <span>{{ item.dominio }} {{ item.vagones }}</span>
              </div>
              <!-- <div class="count-input" v-if="isSplitRequired">
                <button
                  class="button-number"
                  type="button"
                  @click="decrease(index)"
                >
                  <IMinus />
                </button>
                <input
                  class="input-number no-spinners"
                  type="number"
                  :value="item.vagones"
                  @input="updateCount(index, $event)"
                />
                <button
                  class="button-number"
                  type="button"
                  @click="increase(index)"
                >
                  <IMore />
                </button>
              </div> -->
            </div>
            <div class="count-item" v-if="!isCamion">
              <div className="mC-b-imputs">
                <div class="mC-imputs-item">
                  <label>Seleccione Tipo</label>
                  <div class="radio-inputs">
                    <label>
                      <input
                        class="radio-input"
                        type="radio"
                        :name="'radio_' + index"
                        v-model="item.type"
                        value="TAJO"
                        id="tajo-radio"
                        checked
                      />
                      <span class="radio-tile">
                        <span class="radio-label">Tajo</span>
                        <p class="radio-info">Abierto</p>
                      </span>
                    </label>
                    <label>
                      <input
                        class="radio-input"
                        type="radio"
                        :name="'radio_' + index"
                        v-model="item.type"
                        value="AVANCE"
                        id="avance-radio"
                        @change="item.tajo = 'AVANCE'"
                      />
                      <span class="radio-tile">
                        <span class="radio-label">Avance</span>
                        <p class="radio-info">Subterránea</p>
                      </span>
                    </label>
                  </div>
                </div>
                <Transition name="fade" mode="out-in">
                  <div class="mC-imputs-item" v-if="item.type === 'TAJO'">
                    <label>Seleccione Tajo</label>
                    <div class="imputs-i-input">
                      <Dropdown
                        placeholder="Seleccionar"
                        class="p-dropdown-search"
                        filter
                        v-model="item.tajo"
                        :options="dataTajo"
                        optionLabel="name"
                        optionValue="name"
                      />
                    </div>
                    <span class="label-error" v-if="showError"
                      >*Seleccionar campo requerido</span
                    >
                  </div>
                </Transition>
              </div>
            </div>
            <div className="mC-b-imputs" v-if="isCamion">
              <div class="mC-imputs-item input-pila">
                <label>Seleccione Dominio</label>
                <div class="imputs-i-input">
                  <Dropdown
                    class="p-dropdown"
                    v-model="item.dominio"
                    :options="dominios"
                    optionLabel="name"
                    optionValue="name"
                    placeholder="Seleccionar"
                  />
                </div>
              </div>
              <div class="mC-imputs-item input-pila">
                <label>Seleccione Pila</label>
                <div class="imputs-i-input">
                  <Dropdown
                    class="p-dropdown"
                    v-model="item.pila"
                    :options="dataPila.pilasToOreControl"
                    optionLabel="pila"
                    optionValue="pila"
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
.inputs-change {
  position: relative;
  .btn-change {
    position: absolute;
    color: var(--grey-2);
    background-color: var(--grey-light-22);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    padding: 0;
    display: grid;
    place-items: center;
    svg {
      fill: transparent;
      color: var(--grey-2);
      width: 1.5rem;
      height: 1.5rem;
      stroke-width: 1.5;
    }
    &:active {
      transform: translate(-50%, -50%) scale(0.85);
    }
  }
}

.input-pila {
  flex: 1 1 130px !important;
}
.t-nulo {
  padding: 2px 6px;
  background-color: #fee2e2b4;
  border-radius: 5px;
  display: flex;
  place-items: center;
  gap: 0.25rem;
  font-size: clamp(6px, 8vw, 12px);
  color: var(--red);
  svg {
    fill: transparent;
    color: var(--red);
    width: 15px;
    height: 15px;
    stroke-width: 1.5;
  }
}
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
    align-items: center;
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

      border: 1.5px solid var(--grey-light-2);
      border-radius: 5px;
      .input-number {
        width: 35px;
        height: 35px;
        color: var(--black);
        padding: 0;
        text-align: center;
        font-size: clamp(6px, 8vw, 14px);
        border-radius: 0;
        border: none;
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
        &:nth-child(1) {
          border-radius: 5px 0 0 5px;
        }
        &:nth-child(3) {
          border-radius: 0 5px 5px 0;
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
  max-width: 650px !important;
}

.no-spinners::-webkit-inner-spin-button,
.no-spinners::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
