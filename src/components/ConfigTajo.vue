<script setup>
import { ref, onMounted,computed } from "vue";
import { useStore } from "vuex";
import readXlsxFile from "read-excel-file";
import { formatDateAbas } from "../libs/utils";
import { formatFixed } from "../libs/utils";
import Edit from "../icons/Edit.vue";
import CrudTajo from "../components/CrudTajo.vue";
const url = import.meta.env.VITE_API_URL;
const store = useStore();

const loading = ref(true);
const dataTajo = ref([]);


const showError = ref(false);

const hideError = () => {
  showError.value = false;
};
const handleFileTajo = (event) => {
  const file = event.target.files[0];
  readXlsxFile(file)
    .then((rows) => {
      if (rows.length > 0) {
        // Obtener los encabezados del archivo Excel
        const headers = rows[0];

        // Mapear cada fila del archivo a un objeto con las claves correspondientes
        const data = rows.slice(1).map((row) => {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index];
          });
          return rowData;
        });
        dataTajo.value = data;
      } else {
        console.error("El archivo Excel está vacío.");
      }
    })
    .catch((error) => {
      console.error("Error al procesar el archivo Excel:", error);
    });
};
const modalData = ref(null);
const showOCModal = ref(false);
const accionModal = ref(null);

const openModal = (data, accion) => {
  modalData.value = data;
  console.log(data)
  accionModal.value = accion;
  console.log(accion)
  showOCModal.value = true;
};
onMounted(async () => {
  await store.dispatch("tajo_list");

});

const listTajo = computed(() => store.state.tajoList);
const buttonClicked = ref(false);

const uploadFileTajo = async () => {
  try {
    buttonClicked.value = true;
    const updatedTravel = {
      data: dataTajo.value,
      user: store.state.user.name,
    };
    console.log(updatedTravel);
    const response = await fetch(`${url}/tajo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTravel),
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
  <div
    class="container-setting"
    :style="{
      userSelect: buttonClicked ? 'none' : 'auto',
      pointerEvents: buttonClicked ? 'none' : 'auto',
    }"
  >
    <div class="c-setting-body">
      <div class="file-upload-form">
        <label for="fileTajo" class="file-upload-label">
          <div class="file-upload-design">
            <svg viewBox="0 0 640 512" height="1em">
              <path
                d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
              ></path>
            </svg>
            <span class="browse-button">Subir archivo</span>
          </div>
          <input id="fileTajo" type="file" @change="handleFileTajo" />
        </label>
      </div>
      <span class="label-error" v-if="showError">*Documento requerido</span>

      <div class="config-content-table N-datatable" v-if="dataTajo.length">
        <table>
          <thead>
            <tr>
              <th v-for="(value, key) in dataTajo[0]" :key="key">{{ key }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in dataTajo" :key="index">
              <td v-for="(value, key) in row" :key="key">
                <template v-if="key === 'date'">
                  {{ formatDateAbas(value) }}
                </template>

                <template v-else>
                  {{ value }}
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <button @click="openModal(row,false)" class="btn-success">Crear</button>
      </div>
      <div class="config-content-table N-datatable">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th v-for="(value, key) in listTajo[0]" :key="key">{{ key }}</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in listTajo" :key="index">
              <td>
                <div class="td-user">
                  <div class="t-name">
                    <h5>#{{ index + 1 }}</h5>
                  </div>
                </div>
              </td>
              <td v-for="(value, key) in row" :key="key">
                <template>
                  {{ key }}
                </template>
                <template v-if="key === 'createdAt' || key === 'updatedAt'">
                  {{ formatDateAbas(value) }}
                </template>

                <template v-else-if="key === 'ton_prog'">
                  {{ formatFixed(value) }} <small>TMH</small>
                </template>
                <template v-else>
                  {{ value }}
                </template>
              </td>
              <td>
                <div className="btns">
                  <button
                    class="item-btn table-btn-edit"
                    @click="openModal(row,true)"
                    v-tooltip.bottom="{
                      value: 'Completar',
                      pt: {
                        arrow: {
                          style: {
                            borderBottomColor: 'var(--primary-color)',
                          },
                        },
                        text: 'bg-primary font-medium',
                      },
                    }"
                  >
                    <Edit />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>        
      </div>
    </div>
    <div class="c-setting-footer">
      <button class="btn-success" type="submit" @click.prevent="uploadFileTajo">
        <template v-if="buttonClicked">
          <span class="loader"></span>Procesando...
        </template>
        <template v-else> Guardar</template>
      </button>
    </div>
  </div>
  <Transition :duration="550" name="nested">
    <CrudTajo
      v-if="showOCModal"
      @cerrarModal="showOCModal = false"
      :data="modalData"
      :accion="accionModal"
    />
  </Transition>
</template>

<style lang="scss">
.config-content-table {
  overflow: auto;
  height: 400px !important;
}
</style>
