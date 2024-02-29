<script setup>
import { defineEmits, defineProps, ref, computed,watchEffect } from "vue";
import { useStore } from "vuex";
import IPlus from "../icons/IPlus.vue";
import Success from "../components/Success.vue";

const url = import.meta.env.VITE_API_URL;
const store = useStore();
const props = defineProps(["data", "accion"]);
const emit = defineEmits();
const cerrarModal = () => {
  emit("cerrarModal");
};

const buttonClicked = ref(false);
const selectMineral = ref('');

const showSuccessM = ref(false);
const showForm = ref(true);
const showError = ref(false);
const hideError = () => {
  showError.value = false;
};

const initialValues = computed(() => {
  return props.accion
    ? {
       
        tajo: props.data.name || "",
        level: props.data.level || "",
        veta: props.data.veta || "",
        mineral: props.data.mineral || "",
        zona: props.data.zona || "",
        valid: props.data.valid !== undefined ? props.data.valid : false,
        user: store.state.user.name,
      }
    : {
       
        tajo: "",
        level: "",
        veta: "",
        mineral: " ",
        zona: "",
        valid: true,
      };
});


const formData = ref(initialValues.value);
watchEffect(() => {
  selectMineral.value = formData.value.mineral;
});

// Cuando cambia el valor de selectMineral.value, actualiza formData.mineral
watchEffect(() => {
  formData.value.mineral = selectMineral.value;
})

const dominios = ref([
  { name: "Ag/Alabandita" },
  { name: "Ag/Carbonatos" },
  { name: "Polimetálico" },
  { name: "Ag-Sulfuros (Alabandita)" },
  { name: "Ag-Carbonatos (Rodocrosita-Rodonita)" },
]);

const updateTravel = async () => {
  //  if (
  //    dataToUpdate.value.length === 0 ||
  //    dataToUpdate.value.some((item) =>
  //      Object.values(item).some((value) => value === "" || value === null)
  //    )
  //  ) {
  //    console.log(dataToUpdate.value);
  //    console.log("Los datos a actualizar están vacíos");
  //  } else {
  try {
    buttonClicked.value = true;
    console.log(formData.value);

    const response = await fetch(`${url}/tajo/${props.data._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData.value),
    });

    const result = await response.json();

    if (result.status === true) {
      console.log("Correcto");
      await store.dispatch("tajo_list");
      showForm.value = false;
        setTimeout(() => {
          showSuccessM.value = true;
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
    buttonClicked.value = false;
  }
};
const createTajo = async () => {
  console.log(formData.value);
  if (
    Object.values(formData).some((value) => value === "" || value === null)
) {
    console.log("Los datos a actualizar están vacíos");
} else {
  try {
    buttonClicked.value = true;
    console.log(formData.value);
    const updatedTravel = {
      data: [formData.value],
      user: store.state.user.name,
    };
    const response = await fetch(`${url}/tajo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTravel),
    });

    const result = await response.json();
    console.log(result);
    if (result.status === true) {
      console.log("Correcto");
      
      await store.dispatch("tajo_list");
      showForm.value = false;
        setTimeout(() => {
          showSuccessM.value = true;
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
    buttonClicked.value = false;
  }
}
};
</script>

<template>
  <div class="modalCreate-backg">
    <Transition name="nested">
    <form
      class="mCreate-content mCreate-Crud inner"
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
            <h3>{{ props.accion ? "Actualizar tajo" : "Crear tajo" }}</h3>
            <h4>
              {{
                props.accion
                  ? "Modifica la información de un tajo"
                  : "Agrega una nueva tajo"
              }}
            </h4>
          </div>
        </div>
        <span @click="cerrarModal" class="mC-h-close" type="button">
          <img src="../assets/img/i-close.svg" alt="" />
        </span>
      </div>
     
      <div class="mC-c-body">
        <div className="mC-b-imputs-Crud">
          <div class="mC-imputs-item">
            <label>Ingrese name</label>
            <div class="imputs-i-input">
              <input
                type="text"
                placeholder="Ej. TJ1234-5"
                v-model="formData.tajo"
              />
            </div>
            <span class="label-error" v-if="showError">*Campo requerido</span>
          </div>
          <div class="mC-imputs-item">
            <label>Ingrese Nivel</label>
            <div class="imputs-i-input">
              <input
                type="text"
                placeholder="Ej. 1234"
                v-model="formData.level"
              />
            </div>
            <span class="label-error" v-if="showError">*Campo requerido</span>
          </div>
          <div class="mC-imputs-item">
            <label>Ingrese Veta</label>
            <div class="imputs-i-input">
              <input
                type="text"
                placeholder="Ej. V_EJEMPLO"
                v-model="formData.veta"
              />
            </div>
            <span class="label-error" v-if="showError">*Campo requerido</span>
          </div>
          <div class="mC-imputs-item">
            <label>Seleccione dominio</label>
            <div class="imputs-i-input">
              <Dropdown
                class="p-dropdown"
                v-model="selectMineral"
                :options="dominios"
                optionLabel="name"
                optionValue="name"
                placeholder="Seleccionar"
              />
            </div>
            <span class="label-error" v-if="showError">*Campo requerido</span>
          </div>
          <div class="mC-imputs-item">
            <label>Ingrese Zona</label>
            <div class="imputs-i-input">
              <input
                type="text"
                placeholder="Ej. Socorro Alto"
                v-model="formData.zona"
              />
            </div>
            <span class="label-error" v-if="showError">*Campo requerido</span>
          </div>
          <div class="mC-imputs-item">
            <label>Validación</label>
            <div class="imputs-i-input">
              <label class="switch">
              <input type="checkbox" v-model="formData.valid" />
              <span class="slider"></span>
            </label>
            </div>
            <span class="label-error" v-if="showError">*Campo requerido</span>
          </div>
        </div>
      </div>

      <div class="mC-c-footer">
        <button @click="cerrarModal" class="btn-cancel" type="button">
          Cancelar
        </button>
       
        <button
          v-if="props.accion"
          class="btn-success"
          type="submit"
          @click.prevent="updateTravel()"
        >
        <template v-if="buttonClicked">
            <span class="loader"></span>Procesando...
          </template>
          <template v-else> Actualizar </template>
        </button>

        <button
          v-else
          class="btn-success"
          type="submit"
          @click.prevent="createTajo()"
        >
        <template v-if="buttonClicked">
            <span class="loader"></span>Procesando...
          </template>
          <template v-else> Crear </template>
        </button>
      </div>
    </form>
  </Transition>
  <Transition name="bounce">
      <Success v-if="showSuccessM" />
    </Transition>
  </div>
</template>

<style lang="scss">
.mCreate-Crud {
  max-width: 450px !important;
}

.mC-b-imputs-Crud {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  .mC-imputs-item {
    flex: 1 1 150px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
    position: relative;
    label {
      font-size: clamp(5px, 6vw, 11.5px);
      font-weight: 400;
      color: var(--grey-2);
      line-height: 1rem;
    }
    .imputs-i-input {
      position: relative;
      width: 100%;
      min-height: 40px;
      display: flex;
      // justify-content: center;
      align-items: center;
      img {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 15px;
        width: 1.4rem;
        height: 1.4rem;
      }
      input {
        padding: 14px 20px;
      }
      .p-dropdown{
        width: 100%;
      }
    }
  }
}
</style>
