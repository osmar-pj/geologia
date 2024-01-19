<script setup>
import readXlsxFile from "read-excel-file";
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import Success from "../components/Success.vue";

const url = import.meta.env.VITE_API_URL;

const props = defineProps(["data"]);
const emit = defineEmits(["cerrarModal"]);

const store = useStore();

const historial = ref([]);
const averages = ref([]);
const headers = ref([]);
const showError = ref(false);
const buttonClicked = ref(false);
const showSuccessM = ref(false);
const showForm = ref(true);

const cerrarModal = () => {
  emit("cerrarModal");
};

const hideError = () => {
  showError.value = false;
};

const handleFileChange = (event) => {
  const file = event.target.files[0];

  readXlsxFile(file)
    .then((rows) => {
      const historialArr = [];
      const averagesArr = [];

      // Obtener encabezados de columnas
      if (Array.isArray(rows[0])) {
        headers.value = rows[0].map(header => header.toUpperCase());

        for (let row = 1; row < rows.length; row++) {
          const rowData = rows[row];

          const hasNullValue = rowData.some((value) => value === null);

          if (hasNullValue) {
            console.error(
              "Error: Se encontró un valor null en la fila. No se puede procesar."
            );
            return;
          }

          const validRow = rowData.every(
            (value) => value !== "" && value !== 0
          );

          if (validRow) {
            const rowObject = {};

            headers.value.forEach((header, col) => {
              const value = isNaN(rowData[col])
                ? rowData[col]
                : parseFloat(rowData[col]);
              rowObject[header] =
                typeof value === "number"
                  ? parseFloat(value.toFixed(2))
                  : value;
            });

            historialArr.push(rowObject);
          }
        }

        for (let col = 0; col < headers.value.length; col++) {
          const column = historialArr.map((row) => row[headers.value[col]]);
          const validColumn = column.every(
            (value) => typeof value === "number" && !isNaN(value)
          );

          if (validColumn) {
            const average =
              column.reduce((acc, value) => acc + value, 0) / column.length;
            averagesArr.push({
              [headers.value[col]]: parseFloat(average.toFixed(2)),
            });
          } else {
            averagesArr.push({ [headers.value[col]]: "" }); // Agregar null para columnas no válidas
          }
        }

        let result = averagesArr.reduce((acc, obj) => {
          Object.keys(obj).forEach((key) => {
            acc[key] = obj[key];
          });
          return acc;
        }, {});

        const filteredAverages = averagesArr.filter(obj => Object.values(obj)[0] !== '' && Object.values(obj)[0] !== null);
        averages.value = filteredAverages; 

        historial.value = [...historialArr, ...[result]];
      } else {
        console.error("Error: La primera fila no es un array de encabezados.");
      }
    })
    .catch((error) => {
      console.error("Error al procesar el archivo Excel:", error);
    });
};

const updateTravel = async () => {
  if (!averages.value || averages.value.length === 0) {
    console.log(averages);
    showError.value = true;
    setTimeout(hideError, 5000);
  } else {
    
    try {
      buttonClicked.value = true;
      console.log(averages);
      const updatedTravel = {
        ...props.data,
        ley_ag: averages.value[0].AG,
        ley_fe: averages.value[1].FE,
        ley_mn: averages.value[2].MN,
        ley_pb: averages.value[3].PB,
        ley_zn: averages.value[4].ZN,
        statusGeology: "General",
      };
      console.log(updatedTravel);
      const response = await fetch(`${url}/triplist/${props.data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTravel),
      });

      const result = await response.json();

      if (result.status === true) {
        console.log("correcto");
        datosMuestra();
        await store.dispatch("get_listControl");
        showForm.value = false;
        setTimeout(() => {
          showSuccessM.value = true;
        }, 800);
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

const datosMuestra = async () => {
  if (!averages.value || averages.value.length === 0) {
    showError.value = true;
    setTimeout(hideError, 5000);
  } else {
    try {
      const response = await fetch(`${url}/ruma/${props.data.ruma}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: historial.value }),
      });

      const result = await response.json();

      if (result.status === true) {
        console.log("correcto historial");
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  }
};
</script>

<template>
  <div class="modalCreate-backg ">
    <Transition name="nested" >
      <form
        class="mCreate-content CCModal inner"
        :style="{
          userSelect: buttonClicked ? 'none' : 'auto',
          pointerEvents: buttonClicked ? 'none' : 'auto',
        }"
        v-if="showForm"
      >
        <div class="mC-c-header">
          <div class="mC-h-title">
            <div class="mC-c-title-icon">
              <img src="../assets/img/i-compl.svg" alt="" />
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
          <div className="mC-b-imputs">
            <div class="table-excel">
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
              <span class="label-error" v-if="showError"
                >*Documento requerido</span
              >
              <div class="view-excel" v-if="historial.length">
                <h4 class="text-excel">
                  Datos procesados del <strong>archivo Excel</strong>
                </h4>
                <table>
                  <thead>
                    <tr>
                      <th v-for="(col, index) in headers" :key="index">
                        {{ col }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rowIndex) in historial" :key="rowIndex">
                      <td v-for="(value, colIndex) in row" :key="colIndex">
                        {{
                          !isNaN(value) || typeof value === "string"
                            ? value
                            : "-"
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
            <button
              class="btn-success"
              type="submit"
              @click.prevent="updateTravel"
            >
              Guardar
            </button>
          </template>
        </div>
      </form>
    </Transition>
    <Transition name="bounce" >
      <Success v-if="showSuccessM" />
    </Transition>
  </div>
</template>

<style lang="scss">

.CCModal{
  max-width: 600px !important;
}
.table-excel {
  width: 100%;
  color: var(--black);
  font-size: clamp(6px, 8vw, 14px);
  line-height: 0.7rem;
  font-weight: 500;
  border-collapse: collapse;
  white-space: nowrap;
  overflow: hidden;

  .view-excel {
    overflow: auto;
    .text-excel {
      padding: 1rem 0;
      text-align: left;
      font-size: clamp(7px, 8vw, 12px);
      font-weight: normal;
      color: var(--grey-2);
      strong {
        font-weight: 600;
      }
    }
    table {
      width: 100%;
      color: var(--black);
      font-size: clamp(6px, 8vw, 14px);
      line-height: 0.7rem;
      font-weight: 500;
      border-collapse: collapse;
      white-space: nowrap;
    }

    thead {
      color: var(--grey-1);
      text-align: left;
      background-color: var(--grey-light-1);
      font-size: clamp(6px, 8vw, 11px);
      position: sticky;
      top: 0;
      z-index: 1;
    }

    th {
      padding: 10px 12px;
      font-weight: normal !important;
      text-align: center;
      div {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        img {
          width: 0.5rem;
        }
      }
      &:first-child {
        border-radius: 8px 0px 0px 8px !important;
      }
      &:last-child {
        border-radius: 0 8px 8px 0px !important;
      }
    }
    td {
      padding: 9px 12px;
      text-align: center;
    }

    tbody tr {
      z-index: 99;
      background-color: var(--white);
      &:last-child {
        font-weight: 600;
      }
    }
    table tr td:first-child,
    table tr th:first-child {
      font-weight: 600;
    }
  }
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
