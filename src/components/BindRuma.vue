<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { useStore } from "vuex";
const url = import.meta.env.VITE_API_URL;
const store = useStore();
const { showModal } = defineProps(["showModal"]);
const emit = defineEmits();

const cerrarModal = () => {
  emit("cerrarModal");
};

const dataRuma = ref([]);
const selectedRuma = ref();
const selectedCountries = ref([]);
const buttonClicked = ref(false);
const showError = ref(false);

onMounted(async () => {
  await store.dispatch("ruma_list");
  dataRuma.value = store.state.rumaList;
});

const hideError = () => {
  showError.value = false;
};

const unirRumas = async () => {
  if (!selectedRuma.value || selectedRuma.value.length === 0) {
    showError.value = true;
    setTimeout(hideError, 5000);
  } else {
    try {
      buttonClicked.value = true;
      const response = await fetch(`${url}/updateruma`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rumas: selectedRuma.value }),
      });

      const data = await response.json();
      if (data.status === true) {
        console.log("correcto");
        emit("cerrarModal");
        await store.dispatch("ruma_total");
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
            <h2>Unir rumas</h2>
            <h4>Combinación de rumas para una nueva</h4>
          </div>
        </div>
        <span @click="cerrarModal" class="mC-h-close" type="button">
          <img src="../assets/img/i-close.svg" alt="" />
        </span>
      </div>
      <div class="mC-c-body">
        <div className="mC-b-imputs">
          <div class="mC-imputs-item">
            <label>Lista de rumas</label>
            <div class="imputs-i-input">
              <MultiSelect
                v-model="selectedRuma"
                :options="dataRuma"
                optionLabel="ruma_Id"
                placeholder="Seleccione ruma"
                display="chip"
                class=""
              >
                <template #option="slotProps">
                  <div class="flex align-items-center">
                    <div>{{ slotProps.option.ruma_Id }}</div>
                  </div>
                </template>
                <template #footer>
                  <div class="multiselect-footer">
                    <b>{{ selectedCountries.length }}</b>
                    item{{ selectedCountries.length !== 1 ? "s" : "" }}
                    seleccionado
                  </div>
                </template>
              </MultiSelect>
            </div>
            <span class="label-error" v-if="showError">*Campo requerido</span>
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
          <button @click.prevent="unirRumas" class="btn-success" type="submit">
            Guardar
          </button>
        </template>
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
  font-weight: 500;
  line-height: 0.8rem;
}
</style>
