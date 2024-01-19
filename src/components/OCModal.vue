<script setup>
import CreateRuma from "../components/CreateRuma.vue";
import { watch, ref, defineProps, defineEmits, onMounted, computed } from "vue";
import { useStore } from "vuex";
const url = import.meta.env.VITE_API_URL;

const props = defineProps(["data"]);
const emit = defineEmits();

const cerrarModal = () => {
  emit("cerrarModal");
};
const store = useStore();
const dataTajo = ref([]);
const selectedTipo = ref("TAJO");
const selectedTajo = ref("");
const selectedRuma = ref("");
const showError = ref(false);
const buttonClicked = ref(false);
const showSuccessM = ref(false);

const handleTipoChange = () => {
  if (selectedTipo.value === "AVANCE") {
    selectedTajo.value = "AVANCE";
  } else if (selectedTipo.value === "TAJO") {
    selectedTajo.value = "";
  }  
};

watch(selectedTipo, handleTipoChange);

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

const updateTravel = async () => {

  console.log("tipo:",selectedTipo.value,"tajo:",selectedTajo.value,"ruma:",selectedRuma.value);
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
        tipo: selectedTipo.value,
        tajo: selectedTajo.value.name,
        ruma: selectedRuma.value.ruma_Id,
        statusGeology: "QualityControl",
      };
      
      const response = await fetch(`${url}/triplist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTravel),
      });

      const result = await response.json();

      if (result.status === true) {
        console.log("Correcto");
        cerrarModal();
        await store.dispatch("get_list");
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
    <form class="mCreate-content inner" :style="{ userSelect: buttonClicked ? 'none' : 'auto', pointerEvents: buttonClicked ? 'none' : 'auto' }">
      <div class="mC-c-header">
        <div class="mC-h-title">
          <div class="mC-c-title-icon">
            <img src="../assets/img/i-compl.svg" alt="" />
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
        <div className="mC-b-info">
          <p>
            El viaje programado el <strong>'{{ data.fecha }} '</strong>,
            conducido por <strong> {{ data.operador }} </strong> asociado al
            vehículo <strong>'{{ data.vehiculo }} '</strong>, transportó
            <strong>{{ data.ton }} toneladas</strong> de
            <strong>{{ data.material }} </strong> en
            <strong>{{ data.vagones }} vagones</strong>. El vehículo, con el
            tipo <strong>'{{ data.tipo }} '</strong>, se dirigió al tajo
            denominado <strong>'{{ data.tajo }} '</strong>. La tableta no fue
            especificada, y el estado final del viaje fue
            <strong>'{{ data.status }}'</strong>.
          </p>
        </div>
        <div className="mC-b-imputs" v-if="data.tipo === '' || data.tajo === 0">
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
            v-show="
              selectedTipo === 'TAJO' && (data.tipo === '' || data.tajo === 0)
            "
          >
            <label>Selecciona un Tajo</label>
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
        </div>
        <div className="mC-b-imputs">
          <div class="mC-imputs-item">
            <label>Selecciona una Ruma</label>
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
@import "../style.scss";

.modalCreate-backg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 12;
  display: grid;
  place-items: center;
  .mCreate-content {
    background-color: var(--white);
    max-width: 480px;
    width: 100%;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);

    .mC-c-header {
      padding: 1.5rem 1.5rem 0 1.5rem;

      .mC-h-title {
        display: flex;
        align-items: center;
        gap: 1rem;
        .mC-c-title-icon {
          display: grid;
          place-items: center;
          img {
            width: 1.6rem;
            height: 1.6rem;
            // @include md {
            //   width: 2.5rem;
            // }
          }
        }
        .mC-c-title-text {
          text-align: left;
          h2 {
            font-size: clamp(6px, 8vw, 18px);
            color: var(--black);
            font-weight: 600;
            letter-spacing: -0.03em;
          }
          h4 {
            padding-top: 0.1rem;
            font-weight: 500;
            color: var(--grey-2);
            font-size: clamp(6px, 8vw, 13px);
          }
        }
      }
      .mC-h-close {
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
        transition: all 0.35s ease-in-out;
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
    .mC-c-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 2rem 1.5rem;
      overflow: auto;
      max-height: 80vh;
      .mC-b-imputs {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        .mC-imputs-item {
          flex: 1 1 200px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
          position: relative;
          label {
            font-size: clamp(7px, 8vw, 13px);
            font-weight: 500;
            color: var(--grey-2);
            line-height: 1rem;
          }
          .imputs-i-input {
            position: relative;
            width: 100%;
            img {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              left: 15px;
              width: 1.4rem;
              height: 1.4rem;
            }
          }
        }
        .radio-inputs {
          width: 100%;
          display: flex;
          gap: 1rem;
          padding-bottom: 1rem;
          li {
            flex: 1 1 120px;
          }
        }
      }

      .mC-b-info {
        display: flex;
        flex-direction: column;
        padding-bottom: 0.5rem;
        p {
          strong {
            font-weight: 600;
          }
        }
      }
    }
    .mC-c-footer {
      padding: 0 1.5rem 1.5rem 1.5rem;

      display: flex;
      gap: 1rem;

      .btn-success {
        transition: all 0.35s ease-out;
        background-color: var(--primary);
        &:hover {
          background-color: var(--secondary);
        }
      }
    }
  }
}

.btn-success,
.btn-cancel {
  height: 45px;
  padding: 0 1rem;
  font-weight: 500;
}
.btn-cancel {
  height: 45px;
  border-color: var(--grey-light-22);
  color: var(--grey-2);
  background-color: var(--grey-light-22);
  &:hover {
    background-color: var(--secondary);
    color: var(--white);
  }
}

.mC-imputs-more {
  flex: 0 1 90px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 0.25rem;
}
.btn-ruma {
  background-color: var(--grey-light-22);
  color: var(--grey-2);
  padding: 0.8rem 0.5rem;
  font-weight: 500;
  height: 45px;
  &:hover {
    background-color: var(--primary);
    color: var(--white);
  }
}

.radio-inputs {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  label {
    flex: 1 1 200px;
  }
}

.label-error {
  font-size: clamp(6px, 8vw, 12px);
  color: rgb(243, 89, 89);
  font-weight: 600;
  line-height: 0.8rem;
  margin-top: 0.1rem;
}

/***--RADIO BUTTON */
.radio-input:checked + .radio-tile {
  border-color: var(--primary);
  box-shadow: 0 3px 6px #26d45171;
  color: var(--primary);
}

.radio-input:checked + .radio-tile:before {
  opacity: 1;
  background-color: var(--primary);
  border-color: var(--primary);
}

.radio-input:checked + .radio-tile .radio-label {
  color: var(--black);
}

.radio-input:focus + .radio-tile:before {
  opacity: 1;
}

.radio-tile {
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 65px;
  border-radius: 10px;
  border: 1px solid var(--grey-light-2);
  transition: 0.15s ease;
  cursor: pointer;
  position: relative;
}

.radio-tile:before {
  content: "";
  position: absolute;
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  border: 1px solid var(--grey-light-2);
  border-radius: 50%;
  top: 50%;
  right: 20px;
  opacity: 0;
  transform: translateY(-50%);
  transition: 0.25s ease;
}

.radio-tile:hover {
  border-color: var(--primary);
}

.radio-tile:hover:before {
  opacity: 1;
}

.radio-label {
  color: var(--black);
  transition: 0.375s ease;
  text-align: center;
  font-size: clamp(6px, 8vw, 14px);
  line-height: 1.2rem;
  font-weight: 500;
}

.radio-info {
  color: var(--grey-2);
  transition: 0.375s ease;
  text-align: center;
  font-size: clamp(6px, 8vw, 12px);
}

.radio-input {
  clip: rect(0 0 0 0);
  -webkit-clip-path: inset(100%);
  clip-path: inset(100%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
