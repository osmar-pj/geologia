<script setup>
import { computed, defineEmits, defineProps, onMounted, ref } from "vue";
import { useStore } from "vuex";
import CreatePila from "../components/CreatePila.vue";
import Edit from "../icons/Edit.vue";
import IChange from "../icons/IChange.vue";
import IHelp from "../icons/IHelp.vue";

const url = import.meta.env.VITE_API_URL;
const props = defineProps(["data"]);
const emit = defineEmits();
const cerrarModal = () => {
  emit("cerrarModal");
};
const store = useStore();
const data = ref(props.data);
const isCamion = computed(() => data.value.carriage === "Camion");
const isVagones = computed(() => data.value.carriage === "Vagones");
const isSplitRequired = computed(() => data.value.splitRequired);
const numberOfMaterials =
  isSplitRequired.value && data.value && data.value.materials
    ? data.value.materials.length
    : 1;

const dataToUpdate = ref([]);

const selectedDominio = ref(null);
const dominios = ref([
  { name: "Ag/Alabandita" },
  { name: "Ag/Carbonatos" },
  { name: "Polimetálico" },
]);

dataToUpdate.value = isCamion.value
  ? [
      {
        type: data.value.type,
        tajo: data.value.tajo,
        pila: "",
        material: data.value.material,
        dominio: selectedDominio.value,
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
      };
    })
  : [
      {
        type: "TAJO",
        tajo: null,
        // pila: data.value.ubication,
        dominio: data.value.dominio,
      },
    ];

const dataTajo = ref([]);

const showError = ref(false);
const buttonClicked = ref(false);
const showSuccessM = ref(false);
const showForm = ref(true);

onMounted(async () => {
  await store.dispatch("tajo_list");
  await store.dispatch("pila_list");
  dataTajo.value = store.state.tajoList;
});

const dataPila = computed(() => {
  return store.state.pilaList.pilasToOreControl;
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
};

const getImagePath = (imageName) => {
  switch (imageName) {
    case "Polimetálico":
      return "/src/assets/img/i-polimetalicoF.svg";
    case "Ag/Alabandita":
      return "/src/assets/img/i-alabanditaF.svg";
    case "Ag/Carbonatos":
      return "/src/assets/img/i-carbonatoF.svg";
    default:
      return "/src/assets/img/i-carbonatoF.svg";
  }
};

const updateTravel = async () => {
  if (
    dataToUpdate.value.length === 0 ||
    dataToUpdate.value.some((item) =>
      Object.values(item).some((value) => value === "" || value === null)
    )
  ) {
    console.log("Los datos a actualizar están vacíos");
  } else {
    try {
      buttonClicked.value = true;
      console.log();
      const data = dataToUpdate.value.map((i) => {
        return {
          ...i,
          name: store.state.user.name,
        };
      });

      const response = await fetch(`${url}/trip/${props.data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.status === true) {
        console.log("Correcto");

        await store.dispatch("get_listOControl");
        cerrarModal();
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
</script>

<template>
  <div class="modalCreate-backg">
    <form
      class="mCreate-content"
      :class="{ 'mCreate-3': numberOfMaterials >= 2 }"
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
            <h3>Completar campos</h3>
            <h4>Rellenar información restante del viaje</h4>
          </div>
        </div>
        <span @click="cerrarModal" class="mC-h-close" type="button">
          <img src="../assets/img/i-close.svg" alt="" />
        </span>
      </div>

      <div class="mC-c-body">
        <div className="mC-b-info">
          <div class="item-warning" v-if="isVagones && isSplitRequired">
            <IHelp/> <span>Atención! Este <strong>viaje se dividirá</strong></span>
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
        <div class="mC-b-giba" v-if="!isCamion && isSplitRequired">
          <div
            v-for="(item, index) in dataToUpdate"
            :key="index"
            class="container-giba"
          >
            <h2>
              {{ item.pila }}
            </h2>
            <span class="text-giba">Giba</span>
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
              <img :src="getImagePath(item.dominio)" alt="" />
              <div class="c-info-text">
                <h5>{{ item.dominio }}</h5>
                <span>
                  <strong>{{ item.vagones }} </strong> unidad(es)</span
                >
              </div>
            </div>
            <div className="mC-b-imputs" v-if="!isCamion">
              <div class="mC-imputs-item">
                <!-- <label>Seleccione Tipo</label> -->
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
                    <span class="radio-title"> Tajo </span>
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
                    <span class="radio-title"> Avance </span>
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
                    >*Campo requerido</span
                  >
                </div>
              </Transition>
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
                    :options="dataPila"
                    optionLabel="pila"
                    optionValue="pila"
                    placeholder="Seleccionar"
                  />
                </div>
              </div>
              <CreatePila />
              <span class="label-error" v-if="showError"
                >*Seleccionar campo requerido</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="mC-c-footer">
        <button @click="cerrarModal" class="btn-cancel" type="button">
          Cancelar
        </button>
        <button
          class="btn-success"
          type="submit"
          @click.prevent="updateTravel()"
        >
          <template v-if="buttonClicked">
            <span class="loader"></span>Procesando...
          </template>
          <template v-else> Guardar </template>
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss">
.mC-b-giba {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  .container-giba {
    flex: 1 1 150px;
    padding: 10px 20px;
    border: 1px solid var(--grey-light-2);
    border-radius: 10px;
    display: grid;
    place-items: center;
    .text-giba {
      color: var(--grey-2);
      font-size: clamp(6px, 8vw, 10px);
      line-height: 0.8rem;
    }
  }
  .btn-change {
    position: absolute;
    color: var(--grey-2);

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 35px;
    height: 35px;
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
    &:hover {
      background-color: var(--grey-light-22);
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
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-direction: column;
  padding: 0 1rem;
  position: relative;
  .count-item {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0 0.5rem 0;
    img {
      width: 2.5rem;
      height: 2.5rem;
    }
    .c-info-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      h5 {
        font-size: clamp(6px, 8vw, 13.5px);
        font-weight: 500;
      }
      span {
        line-height: 1rem;
        font-size: clamp(6px, 8vw, 11.5px);
        color: var(--grey-2);
      }
    }
  }
  &::before {
    content: "";
    width: 1px;
    height: 50%;
    background-color: var(--grey-light-2);
    position: absolute;
    right: -0.5rem;
    top: 50%;
    transform: translateY(-50%);
  }
  &:last-child {
    &::before {
      background-color: transparent;
    }
  }
}

.item-warning{
  background-color: #fee2e2b4;
  padding: 5px 10px;
  border-radius: 6px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  span{
    color: var(--red);
    font-size: clamp(7px, 8vw, 12.5px);
    line-height: .9rem;
  }
  svg {
    fill: transparent;
    color: var(--red);
    width: 16px;
    height: 16px;
    stroke-width: 2;
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
  max-width: 550px !important;
}

.no-spinners::-webkit-inner-spin-button,
.no-spinners::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
