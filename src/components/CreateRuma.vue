<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import IPlus from "../icons/IPlus.vue";

const url = import.meta.env.VITE_API_URL;
const store = useStore();

const showOCModal = ref(false);
const buttonClicked = ref(false);

const openModal = () => {
  showOCModal.value = true;
};

const cerrarModal = () => {
  showOCModal.value = false;
};

const createRuma = async () => {
  try {
    buttonClicked.value = true;
    const response = await fetch(`${url}/ruma`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.status === true) {
      console.log("Correcto");
      await store.dispatch("ruma_list");
      showOCModal.value = false;
      buttonClicked.value = false;
    } else {
      console.log("error");
      buttonClicked.value = false;
    }
  } catch (error) {
    console.error("Error al actualizar:", error);
  }
};
</script>

<template>
  <div class="mC-imputs-more">
    <button class="btn-ruma" type="button" @click="openModal()">
      <IPlus /> Crear Ruma
    </button>
  </div>
  <Transition :duration="550" name="nested">
    <div
      class="modalCreate-backg"
      v-if="showOCModal"
      @cerrarModal="showOCModal = false"
    >
      <form
        class="mCreate-content mCreate-2 inner"
        :style="{
          userSelect: buttonClicked ? 'none' : 'auto',
          pointerEvents: buttonClicked ? 'none' : 'auto',
        }"
      >
        <div class="mC-c-header">
          <div class="mC-h-title">
            <div class="mC-c-title-icon">
              <IPlus />
            </div>
            <div class="mC-c-title-text">
              <h2>Crear nueva ruma</h2>
              <h4>Inicializar una nueva ruma</h4>
            </div>
          </div>
          <span @click="cerrarModal" class="mC-h-close" type="button">
            <img src="../assets/img/i-close.svg" alt="" />
          </span>
        </div>
        <div class="mC-c-body">
          <div class="mC-b-info">
            <p>
              Crear una nueva ruma implica iniciar una nueva área o pila para
              acumular los materiales extraídos.
              <strong>¿Seguro que deseas crear una nueva ruma?</strong>?
            </p>
          </div>
        </div>
        <div class="mC-c-footer">
          <template v-if="buttonClicked">
            <div class="loader"></div>
          </template>
          <template v-else>
            <button @click="cerrarModal" class="btn-cancel" type="button">
              No
            </button>
            <button
              class="btn-success"
              type="submit"
              @click.prevent="createRuma()"
            >
              Si
            </button>
          </template>
        </div>
      </form>
    </div>
  </Transition>
</template>

<style lang="scss">
.mC-imputs-more {
  flex: 0 1 150px;
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
  transition: all 0.35s ease-in;
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
