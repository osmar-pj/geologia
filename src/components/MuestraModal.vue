<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { useStore } from "vuex";
import IDelete from "../icons/IDelete.vue";

const store = useStore();
const url = import.meta.env.VITE_API_URL;

const props = defineProps(["data"]);
const emit = defineEmits();

const buttonClicked = ref(false);
const cerrarModal = () => {
  emit("cerrarModal");
};

const deleteTravel = async () => {
  try {
    buttonClicked.value = true;
    const response = await fetch(`${url}/triplist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({statusTransition: "Muestreo"}),
    });

    const result = await response.json();
    if (result.status === true) {
      console.log("correcto");
      cerrarModal();
      await store.dispatch("get_list");
      showSuccessModal.value = true;
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
  <div class="modalCreate-backg">
    <form class="mCreate-content mCreate-2 inner" :style="{ userSelect: buttonClicked ? 'none' : 'auto', pointerEvents: buttonClicked ? 'none' : 'auto' }">
      <div class="mC-c-header">
        <div class="mC-h-title">
          <div class="mC-c-title-icon">
            <IDelete/>
          </div>
          <div class="mC-c-title-text">
            <h2>
              Enviar Pila a Muestreo
            </h2>
            <h4>Borrar un viaje de la lista</h4>
          </div>
        </div>
        <span @click="cerrarModal" class="mC-h-close" type="button">
          <img src="../assets/img/i-close.svg" alt="" />
        </span>
      </div>
      <div class="mC-c-body">
        <div class="mC-b-info">
          <p>
            ¿Está seguro que desea enviar la pila
            <strong
              >"{{data.pila}}"</strong
            >
            a muestreo?
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
            class="btn-delete"
            type="submit"
            @click.prevent="deleteTravel()"
          >
            Si
          </button>
        </template>
      </div>
    </form>
  </div>
  
</template>