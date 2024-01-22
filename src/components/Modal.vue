<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { useStore } from "vuex";
const store = useStore();
const { showModal, showItem } = defineProps(["showItem", "showModal"]);
const emit = defineEmits();

const cerrarModal = () => {
  emit("cerrarModal");
};

const userModal = store.state.userModal;

const updateTravel = () => {
  // enviar el UPDATE al backend
  // actualizar el userModal como null
};

const selectedCity = ref(null);
const selectedType = ref(null);
const cities = ref([
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

const type = ref([
  { name: "Tajo", value: "tajo" },
  { name: "Avance", value: "avance" },
]);
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
            El viaje programado el <strong>12 de Diciembre de 2023</strong>,
            conducido por
            <strong> {{ userModal.operador }} </strong> asociado al vehículo
            <strong>'BFC-567'</strong>, transportó
            <strong>12 toneladas</strong> de <strong>desmonte</strong> en
            <strong>0 vagones</strong>. El vehículo, con el tipo
            <strong>'Tajo 500JC'</strong>, se dirigió al tajo denominado
            <strong>'Tajo'</strong>. La tableta no fue especificada, y el estado
            final del viaje fue 'en revisión'.
          </p>
        </div>
        <div className="mC-b-imputs">
          <div class="radio-inputs" v-if="!showItem">
            <label class="radio">
              <input type="radio" name="radio" checked="" />
              <span class="name">Tajo</span>
            </label>
            <label class="radio">
              <input type="radio" name="radio" />
              <span class="name">Avance</span>
            </label>
          </div>
          <div className="mC-imputs-item" v-if="!showItem">
            <label>Tajo</label>
            <div className="imputs-i-input">
              <!-- <img src="imgs/i-f-user.svg" alt="" /> -->
              <Dropdown
                class="p-dropdown"
                v-model="selectedCity"
                :options="cities"
                optionLabel="name"
                placeholder="Seleccionar"
              />
            </div>
          </div>
          <div className="mC-imputs-item" v-if="!showItem">
            <label>Nro de Ruma</label>
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
            <label>Ley Ag</label>
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
            <label>Ley Fe</label>
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
            <label>Ley Mn</label>
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
            <label>Ley Pb</label>
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
            <label>Ley Zn</label>
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
        <button class="btn-success" type="submit" @click.prevent="updateTravel()">Guardar</button>
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
    max-width: 400px;
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
          flex: 1 1 250px;
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
