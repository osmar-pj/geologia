<script setup>
import { computed, onMounted, ref } from "vue";

import readXlsxFile from "read-excel-file";
const url = import.meta.env.VITE_API_URL;

const loading = ref(true);
const historial = ref([]);
const headers = ref([]);
const showError = ref(false);

const hideError = () => {
  showError.value = false;
};
const handleFileChange = (event) => {
  const file = event.target.files[0];
  readXlsxFile(file)
    .then((rows) => {
      if (rows.length > 0) {
        // Guardar los datos del archivo en la variable historial
        historial.value = rows.slice(1); // Excluir la primera fila (encabezados)
        // Guardar los encabezados en la variable headers
        headers.value = rows[0];
      } else {
        console.error("El archivo Excel está vacío.");
      }
    })
    .catch((error) => {
      console.error("Error al procesar el archivo Excel:", error);
    });
};

const data = computed(() => store.state.config);
const buttonClicked = ref(false);

const uploadFile = async () => {
  console.log(historial);
  try {
    buttonClicked.value = true;

    const response = await fetch(`${url}/program`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(historial.value),
    });

    const result = await response.json();

    if (result.status === true) {
      console.log("Correcto");
      buttonClicked.value = false;
    } else {
      console.log("error");
      buttonClicked.value = false;
    }
  } catch (error) {
    console.error("Error al actualizar:", error);
    buttonClicked.value = false;
  }
};
</script>

<template>
  <div class="container-setting">
    <div class="c-setting-body">
      <div class="file-upload-form">
        <label for="file" class="file-upload-label">
          <div class="file-upload-design">
            <svg viewBox="0 0 640 512" height="1em">
              <path
                d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
              ></path>
            </svg>
            <span class="browse-button">Subir archivo</span>
          </div>
          <input id="file" type="file" @change="handleFileChange" />
        </label>
      </div>
      <span class="label-error" v-if="showError">*Documento requerido</span>
      <div class="config-content-table N-datatable" v-if="historial.length">
        <table>
          <thead>
            <tr>
              <th v-for="header in headers" :key="header">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in historial" :key="index">
              <td v-for="value in row" :key="value">
                <!-- Aplicar toFixed(2) si el valor es numérico -->
                {{ typeof value === "number" ? value.toFixed(2) : value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="c-setting-footer">
      <button class="btn-success" type="submit" @click.prevent="uploadFile">
        <template v-if="buttonClicked">
          <span class="loader"></span>Procesando...
        </template>
        <template v-else> Guardar</template>
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.config-content-table {
  overflow: auto;
  height: 400px !important;
}
</style>
