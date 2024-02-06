<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { useStore } from "vuex";
import IDelete from "../icons/IDelete.vue";
import ICalendar from "../icons/ICalendar.vue";
import Success from "../components/Success.vue";
const store = useStore();
const url = import.meta.env.VITE_API_URL;

const props = defineProps(["data"]);
const emit = defineEmits();

const buttonClicked = ref(false);
const cerrarModal = () => {
  emit("cerrarModal");
};

const selectedEstado = ref(new Date());
const showSuccessModal = ref(false);
const showForm = ref(true);

const updateTravel = async () => {
  try {
    buttonClicked.value = true;
    const updatedData={
      dateSupply: selectedEstado.value ,
      userId: store.state.user.userId,
    }
    const response = await fetch(`${url}/pila/${props.data._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const result = await response.json();
    if (result.status === true) {
      console.log("correcto");
      await store.dispatch("get_list");
      showForm.value = false;     
      setTimeout(() => {
        showSuccessModal.value = true;
        }, 600)
        setTimeout(() => {
          cerrarModal();
        }, 2000)
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
            <IDelete />
          </div>
          <div class="mC-c-title-text">
            <h2>Abastecimiento</h2>
            <h4>Fecha programada</h4>
          </div>
        </div>
        <span @click="cerrarModal" class="mC-h-close" type="button">
          <img src="../assets/img/i-close.svg" alt="" />
        </span>
      </div>
      <div class="mC-c-body">        
        <div className="mC-b-imputs">
          <div class="mC-imputs-item input-pila">
            <label>Seleccione Fecha</label>
            <div class="imputs-i-input">
              <Calendar
                v-model="selectedEstado"
                view="date"                               
                dateFormat="dd/mm/yy"
                aria-placeholder="dd/mm/yy"
                showIcon
                iconDisplay="input"
                :yearNavigator="true"
              >
                <template #inputicon="{ clickCallback }">
                  <ICalendar />
                </template>
              </Calendar>
            </div>
          </div>         
          <!-- <span class="label-error" v-if="showError"
            >*Seleccionar campo requerido</span
          > -->
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
            Aceptar
          </button>
        </template>
      </div>
    </form>
  </Transition>
    <Transition name="bounce">
      <Success v-if="showSuccessModal" />
    </Transition>
  </div>
</template>
