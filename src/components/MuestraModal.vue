<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { useStore } from "vuex";
import IDelete from "../icons/IDelete.vue";
import Success from "../components/Success.vue";

const store = useStore();
const url = import.meta.env.VITE_API_URL;

const props = defineProps(["data"]);
const emit = defineEmits();

const buttonClicked = ref(false);
const cerrarModal = () => {
  emit("cerrarModal");
};
const showError = ref(false);
const selectedCodTableta = ref(false);
const CodDespacho = ref("UCCA0008893");
const showSuccessModal = ref(false);
const showForm = ref(true);

const updateTravel = async () => {
  if (props.data.travels.length < 1) {
    showError.value = true;
  } else {
    try {
      buttonClicked.value = true;
      const dataUpdate = {
        name: store.state.user.name,
        isCoding: selectedCodTableta.value,
        cod_despacho: CodDespacho.value,
      };

      const response = await fetch(`${url}/pila/${props.data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataUpdate),
      });

      const result = await response.json();
      if (result.status === true) {
        console.log("correcto");
        await store.dispatch("get_listQControl");
        showForm.value = false;
        setTimeout(() => {
          showSuccessModal.value = true;
        }, 600);
        setTimeout(() => {
          cerrarModal();
        }, 2000);
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
    <Transition name="nested">
      <form
        class="mCreate-content mCreate-4 inner"
        :style="{
          userSelect: buttonClicked ? 'none' : 'auto',
          pointerEvents: buttonClicked ? 'none' : 'auto',
        }"
        v-if="showForm"
      >
        <div class="mC-c-header">
          <div class="mC-h-title">
            <div class="mC-c-title-icon">
              <IDelete />
            </div>
            <div class="mC-c-title-text">
              <h3>Siguiente Proceso</h3>
              <h4>Envia la Pila al siguiente proceso</h4>
            </div>
          </div>
          <span @click="cerrarModal" class="mC-h-close" type="button">
            <img src="../assets/img/i-close.svg" alt="" />
          </span>
        </div>
        <div class="mC-c-body">
          <div class="mC-b-imputs">
            <div class="mC-b-text" v-if="props.data.typePila == 'Pila'">
              <p>
                ¿Está seguro que desea enviar la pila
                <strong>"{{ data.pila }}"</strong>
                a analizar?
              </p>
            </div>
            <div class="mC-b-text" v-if="props.data.typePila == 'Giba'">
              <p>
                ¿Está seguro de enviar la Giba
                <strong>"{{ data.pila }}"</strong>
                a analizar o generar un codigo de tableta?
              </p>
            </div>
            <div class="mC-imputs-item" v-if="props.data.typePila == 'Giba'">             
              <label>Seleccione el tipo</label>
              <div class="radio-inputs">
                <label>
                  <input
                    class="radio-input"
                    type="radio"
                    name="codigo"
                    v-model="selectedCodTableta"
                    :value="false"
                    id="true"
                  />
                  <span class="radio-title"> Analizar </span>
                </label>
                <label>
                  <input
                    class="radio-input"
                    type="radio"
                    name="codigo"
                    v-model="selectedCodTableta"
                    :value="true"
                    id="false"
                  />
                  <span class="radio-title"> Código de tableta </span>
                </label>
              </div>
            </div>
            <span class="label-error" v-if="showError"
              >*Debe tener al menos un viaje</span
            >
            <Transition name="fade" mode="out-in">
              <div class="mC-imputs-item" v-if="selectedCodTableta == false">
                <label>Ingrese código de despacho</label>
                <div class="imputs-i-input">
                  <input
                    type="text"
                    placeholder="UCCA0008893"
                    value="UCCA0008893"
                    v-model="CodDespacho"
                  />
                </div>
                <span class="label-error" v-if="showError"
                  >*Campo requerido</span
                >
              </div>
            </Transition>
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
            <template v-if="buttonClicked">
              <span class="loader"></span>Proces...
            </template>
            <template v-else> Aceptar </template>
          </button>
        </div>
      </form>
    </Transition>
    <Transition name="bounce">
      <Success v-if="showSuccessModal" />
    </Transition>
  </div>
</template>

<style lang="scss">
.label-error {
  font-size: clamp(7px, 8vw, 14px);
  line-height: 1.1rem;
  color: var(--red);
}

.mC-b-text {
   width: 100%;
   width: 100%;
   display: flex;
   justify-content: space-between;
   gap: 1rem;
   padding: 0 0.5rem;
   border-radius: 10px;
    border: 1px solid var(--grey-light-2);
    padding: 15px 20px;
  p {
   
    font-size: clamp(5px, 8vw, 12.5px);
    padding-bottom: 0.2rem;
  }
}

.mCreate-4 {
  max-width: 350px !important;
}
</style>
