<script setup>
import CreateRuma from "../components/CreateRuma.vue";
import { watch, ref, defineProps, defineEmits, onMounted, computed } from "vue";
import { useStore } from "vuex";
import Success from "../components/Success.vue";
import Edit from "../icons/Edit.vue";
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
const showForm = ref(true);

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
  console.log(
    "tipo:",
    selectedTipo.value,
    "tajo:",
    selectedTajo.value,
    "ruma:",
    selectedRuma.value
  );
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
        await store.dispatch("get_list");

        cerrarModal();
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
    <form
      class="mCreate-content inner"
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
</style>
