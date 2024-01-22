<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { useStore } from "vuex";

const props = defineProps(["rumaIdToDeactivate"]);
const store = useStore();
const url = import.meta.env.VITE_API_URL;
const emit = defineEmits();

const cerrarModal = () => {
  store.state.rumaIdToDeactivate = null;
  emit("cerrarModal");
};

const buttonClicked = ref(false);
const deleteTravel = async () => {
  try {
    buttonClicked.value = true;
    const response = await fetch(`${url}/ruma/${props.rumaIdToDeactivate}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ valid: 0 }),
    });

    const data = await response.json();
    if (data.status === true) {
      console.log("correcto");
      await store.dispatch("ruma_total");
      cerrarModal();
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
            <img src="../assets/img/i-compl.svg" alt="" />
          </div>
          <div class="mC-c-title-text">
            <h2>Enviar a planta</h2>
            <h4>Ruma a enviar al planta</h4>
          </div>
        </div>
        <span @click="cerrarModal" class="mC-h-close" type="button">
          <img src="../assets/img/i-close.svg" alt="" />
        </span>
      </div>
      <div class="mC-c-body">
        <div class="mC-b-info">
          <p>
            La ruma <strong>"{{ props.rumaIdToDeactivate }}"</strong> se enviará
            para planta
            <strong>¿Está seguro de realizar esta acción?</strong>
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

<style lang="scss">

</style>
