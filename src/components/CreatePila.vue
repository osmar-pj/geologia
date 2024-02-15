<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import IPlus from "../icons/IPlus.vue";
import SuccessPila from "../components/SuccessPila.vue";

const url = import.meta.env.VITE_API_URL;
const store = useStore();

const showOCModal = ref(false);
const buttonClicked = ref(false);
const showSuccessM = ref(false);
const showForm = ref(true);
const modalData = ref(null);

const openModal = () => {
  showOCModal.value = true;
};

const cerrarModal = () => {
  showOCModal.value = false;
};

const createPila = async () => {
  try {
    buttonClicked.value = true;
    const response = await fetch(`${url}/pila`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mining: "YUMPAG" }),
    });

    const data = await response.json();

    if (data.status === true) {
      modalData.value = data;
      await store.dispatch("pila_list");
      showForm.value = false;
      setTimeout(() => {
        showSuccessM.value = true;
      }, 600);
      setTimeout(() => {
        cerrarModal();
        showForm.value = true;
        showSuccessM.value = false;
      }, 4000);
      buttonClicked.value = false;
    } else {
      console.log("error");
      buttonClicked.value = false;
    }
  } catch (error) {
    console.error("Error al crear la Pila:", error);
  }
};
</script>

<template>
  <div class="mC-imputs-more">
    <button class="btn-ruma" type="button" @click="openModal()">
      <IPlus /> Crear Pila
    </button>
  </div>
  <Transition :duration="550" name="nested">
    <div
      class="modalCreate-backg"
      v-if="showOCModal"
      @cerrarModal="showOCModal = false"
    >
      <Transition name="nested">
        <form
          class="mCreate-content mCreate-2 inner"
          :style="{
            userSelect: buttonClicked ? 'none' : 'auto',
            pointerEvents: buttonClicked ? 'none' : 'auto',
          }"
          v-if="showForm"
        >
          <div class="mC-c-header">
            <div class="mC-h-title">
              <div class="mC-c-title-icon">
                <IPlus />
              </div>
              <div class="mC-c-title-text">
                <h2>Crear nueva pila</h2>
                <h4>Inicializar una nueva pila</h4>
              </div>
            </div>
            <span @click="cerrarModal" class="mC-h-close" type="button">
              <img src="../assets/img/i-close.svg" alt="" />
            </span>
          </div>
          <div class="mC-c-body">
            <div class="mC-b-info">
              <p>
                Crear una nueva pila implica iniciar una nueva área para
                acumular los materiales extraídos.
                <strong>¿Seguro que deseas crear una nueva pila?</strong>
              </p>
            </div>
          </div>
          <div class="mC-c-footer">
            <button @click="cerrarModal" class="btn-cancel" type="button">
              No
            </button>
            <button
              class="btn-success"
              type="submit"
              @click.prevent="createPila()"
            >
              <template v-if="buttonClicked">
                <span class="loader"></span>Proces...
              </template>
              <template v-else> Si </template>
            </button>
          </div>
        </form>
      </Transition>
      <Transition name="bounce">
        <SuccessPila v-if="showSuccessM"  :data="modalData" />
      </Transition>
    </div>
  </Transition>
</template>

<style lang="scss">
.mC-imputs-more {
  flex: 0 1 130px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 0.25rem;
}
.btn-ruma {
  color: var(--primary);
  padding: 0.8rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  border: 1px solid var(--primary);
  height: 40px;
  width: 100%;
  svg {
    color: var(--primary);
    width: 1.3rem;
    height: 1.3rem;
    stroke-width: 1.7;
    fill: transparent;
  }
  &:hover {
    background-color: var(--primary);
    color: var(--white);
    border: 1px solid var(--primary);
    svg {
      color: var(--white);
    }
  }
}
</style>
