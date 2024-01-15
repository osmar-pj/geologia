<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { useStore } from "vuex";
import Filexcel from "../components/Filexcel.vue";
const url = import.meta.env.VITE_API_URL

const store = useStore();
const dataRuma = ref([])
const { showModal, showItem } = defineProps(["showItem", "showModal"]);
const emit = defineEmits();

const cerrarModal = () => {
  emit("cerrarModal");
};

onMounted(async () => {
    await store.dispatch('rumaList')
    data.value = store.state.dataList.filter(item => item.status === 'Completo');
})

const tajos = ref([
  { name: "TJ400_1P_1", value: "TJ400_1P_1" },
  { name: "TJ400_2P_1", value: "TJ400_2P_1" },
  { name: "TJ400_6S_1", value: "TJ400_6S_1" },
  { name: "TJ500_1S_1", value: "TJ500_1S_1" },
  { name: "TJ500_2S_1", value: "TJ500_2S_1" },
  { name: "TJ500_3P_1", value: "TJ500_3P_1" },
  { name: "TJ500_3S_1", value: "TJ500_3S_1" },
  { name: "TJ500_4S_1", value: "TJ500_4S_1" },
  { name: "TJ500_5S_1", value: "TJ500_5S_1" },
  { name: "TJ500_6P_1", value: "TJ500_6P_1" },
  { name: "TJ500_7P_1", value: "TJ500_7P_1" },
  { name: "TJ500_7S_1", value: "TJ500_7S_1" },
  { name: "TJ500_8S_1", value: "TJ500_8S_1" },
  { name: "TJ500_11P_1", value: "TJ500_11P_1" },
]);

const userModal = store.state.userModal;
const selectedOption = ref(userModal.tipo || "TAJO");
const selectedTajo = ref(userModal.tajo || "");
const NroRuma = ref(userModal.ruma || "");
console.log(userModal.tajo);

const updateTravel = async () => {
  try {
    const response = await fetch(`${url}/triplist/${userModal._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tipo: selectedOption.value, tajo: selectedTajo.value.value, status: "ControlCalidad", ruma :NroRuma.value }),
    });

    const data = await response.json();

    if (!data.status) {
      console.log("correcto");
    } else {
      console.log("error");
    }
  } catch (error) {
    console.error("Error al actualizar:", error);
  }
};

</script>

<template>
  <div class="modalCreate-backg">
    <form class="mCreate-content mCreate-2">
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
            El viaje programado el <strong>'{{ userModal.fecha }} '</strong>,
            conducido por <strong> {{ userModal.operador }} </strong> asociado
            al vehículo <strong>'{{ userModal.vehiculo }} '</strong>, transportó
            <strong>{{ userModal.ton }} toneladas</strong> de
            <strong>{{ userModal.material }} </strong> en
            <strong>{{ userModal.vagones }} vagones</strong>. El vehículo, con
            el tipo <strong>'{{ userModal.tipo }} '</strong>, se dirigió al tajo
            denominado <strong>'{{ userModal.tajo }} '</strong>. La tableta no
            fue especificada, y el estado final del viaje fue
            <strong>'{{ userModal.status }}'</strong>.
          </p>
        </div>
        <div className="mC-b-imputs">
          <div class="radio-inputs">
            <label class="radio">
              <input
                type="radio"
                name="radio"
                v-model="selectedOption"
                value="TAJO"
                checked
              />
              <span class="name">Tajo</span>
            </label>
            <label class="radio">
              <input
                type="radio"
                name="radio"
                v-model="selectedOption"
                value="AVANCE"
              />
              <span class="name">Avance</span>
            </label>
          </div>

          <div class="mC-imputs-item" v-show="selectedOption === 'TAJO'" v-if="!showItem">
            <label>Tajo</label>
            <div class="imputs-i-input">
              <Dropdown
                class="p-dropdown"
                v-model="selectedTajo"
                :options="tajos"
                optionLabel="name"
                placeholder="Seleccionar"
              />
            </div>
          </div>

          <!-- <div class="radio-inputs" v-if="!showItem">
            <label class="radio">
              <input type="radio" name="radio" checked="" />
              <span class="name">Crear Ruma</span>
            </label>
            <label class="radio">
              <input type="radio" name="radio" />
              <span class="name">Asignar Ruma</span>
            </label>
          </div> -->
          <div class="mC-imputs-item" v-if="!showItem">
            <label>Nro Ruma</label>
            <div class="imputs-i-input">
              <Dropdown
                class="p-dropdown"
                v-model="selectedRuma"
                :options="dataRuma"
                optionLabel="name"
                placeholder="Seleccionar"
              />
            </div>
          </div>
          <Filexcel v-if="showItem" />
          <!-- CONTROL DE CALIDAD -->
          <div className="mC-imputs-item" v-if="showItem">
            <label>Codigo de muestra</label>
            <div className="imputs-i-input">
              <img src="../assets/img/i-tablet.svg" alt="" />
              <input
                type="text"
                name="operationTruck_Id"
                inputMode="text"
                placeholder="Ej. TJ-999_9_1"
                className="input-crud"
                value=""
                required
              />
            </div>
          </div>
          <div className="mC-imputs-item" v-if="showItem">
            <label>Fecha Abaste</label>
            <div className="imputs-i-input">
              <img src="../assets/img/i-tablet.svg" alt="" />
              <input
                type="text"
                name="operationTruck_Id"
                inputMode="text"
                placeholder="Ej. TJ-999_9_1"
                className="input-crud"
                value=""
                required
              />
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
          Guardar
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss">
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
            font-weight: 500;
            letter-spacing: -0.03em;
          }
          h4 {
            padding-top: 0.1rem;
            font-weight: normal;
            color: var(--grey-1);
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
      padding: 1.8rem 1.5rem;
      overflow: auto;
      max-height: 70vh;
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
          label {
            font-size: clamp(7px, 8vw, 13px);
            font-weight: 400;
            color: var(--grey-1);
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
          position: relative;
          display: flex;
          flex-wrap: wrap;
          border-radius: 12px;
          background-color: var(--grey-light-1);
          box-sizing: border-box;
          padding: 6px;
          width: 100%;
          font-size: 14px;
          .radio {
            flex: 1 1 auto;
            text-align: center;
            input {
              display: none;
              &:checked + .name {
                background-color: var(--primary);
                color: var(--white);
                font-weight: 500;
              }
            }
            .name {
              display: flex;
              cursor: pointer;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
              border: none;
              padding: 0.5rem 0;
              color: var(--grey-1);
              transition: all 0.15s ease-in-out;
            }
          }
        }
      }

      .mC-b-info {
        display: flex;
        flex-direction: column;
        padding-bottom: 1rem;
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
}
.btn-cancel {
  height: 45px;
  background-color: var(--white);
  color: var(--primary);
  border: 1px solid var(--primary);
  &:hover {
    background-color: var(--primary);
    color: var(--white);
  }
}
</style>
