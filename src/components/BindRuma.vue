<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { useStore } from "vuex";
import Bind from "../icons/Bind.vue";
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
            <Bind color="#6e6d7a"/>
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

</style>
