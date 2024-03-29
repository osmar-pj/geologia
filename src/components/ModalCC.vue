<script setup>
import Papa from "papaparse";
import { ref, watch, defineProps, defineEmits } from "vue";
import { useStore } from "vuex";
import Success from "../components/Success.vue";
import ICSV from "../icons/ICSV.vue";

const url = import.meta.env.VITE_API_URL;
const store = useStore();
const props = defineProps(["data"]);
const emit = defineEmits(["cerrarModal"]);
const cerrarModal = () => {
  emit("cerrarModal");
};

const csvData = ref([]);
const averages = ref([]);
const selectedProducts = ref();
const showError = ref(false);
const fileUploaded = ref(false);
const showLoader = ref(false);

const showDocError = ref(false);
const buttonClicked = ref(false);
const showSuccessM = ref(false);
const showForm = ref(true);
const selectedCodTableta = ref(false);

const handleFileUpload = (event) => {
  const file = event.target.files[0];

  if (file) {
    const fileName = file.name;
    const underscoreIndex = fileName.indexOf("_");
    const titleValue =
      underscoreIndex !== -1
        ? fileName.substring(0, underscoreIndex)
        : fileName;
    const despachos = props.data.cod_despacho;
    const isTitleInDespachos = despachos.includes(titleValue);
    if (isTitleInDespachos) {
      showDocError.value = false;
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          const filteredData = result.data.map((row) => {
            const newRow = {};
            for (const key in row) {
              if (row[key] !== "") {
                const newKey =
                  key.toLowerCase() === "observaci�n" ? "Observacion" : key;
                newRow[newKey] = [
                  "Ag (ozt)",
                  "Fe (pct)",
                  "Mn (pct)",
                  "Pb (pct)",
                  "Zn (pct)",
                ].includes(newKey)
                  ? parseFloat(Number(row[key]).toFixed(2))
                  : row[key];
              }
            }
            return newRow;
          });

          const finalData = filteredData.filter((row) =>
            Object.values(row).some((value) => value !== "")
          );

          finalData.forEach((row, index) => {
            row["id"] = index + 1;
            row["disabled"] = false;
          });
         

          csvData.value.push(...finalData);

          buttonClicked.value = true;
          showLoader.value = true;
          setTimeout(() => {
            fileUploaded.value = true;
            showLoader.value = false;
            buttonClicked.value = false;
          }, 1600);
          console.log(finalData);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error.message);
        },
      });
    } else {
      console.log("codigo incorrecto");
      showDocError.value = true;
      setTimeout(() => {
        showDocError.value = false;
      }, 10000);
      return;
    }
  }
};

const cancelFile = () => {
  dataPlanta.value = [];
  fileUploaded.value = false;
};

const dataTableClass = "table-exel";
const editingRows = ref([]);
const onRowEditSave = (event) => {
  let { newData, index } = event;
  csvData.value[index] = newData;
};

const targetColumns = [
  "Ag (ozt)",
  "Fe (pct)",
  "Mn (pct)",
  "Pb (pct)",
  "Zn (pct)",
];

const calculateColumnAverage = (columnName) => {
  if (!targetColumns.includes(columnName)) {
    averages.value[columnName] = "";
    return "";
  }

  const enabledRows = csvData.value.filter((row) => !row.disabled);
  const validColumnValues = enabledRows
    .map((row) => row[columnName])
    .filter((value) => !isNaN(value));

  averages.value[columnName] =
    validColumnValues.length > 0
      ? parseFloat(
          (
            validColumnValues.reduce(
              (acc, value) => acc + parseFloat(value),
              0
            ) / validColumnValues.length
          ).toFixed(2)
        )
      : 0;
  return validColumnValues.length > 0 ? averages.value[columnName] : "";
};

const findIndexById = (id) => {
  return csvData.value.findIndex((row) => row.id === id);
};

const onSelectionChange = () => {
  const selectedRowIds = selectedProducts.value.map((row) => row.id);

  csvData.value.forEach((row) => {
    const index = findIndexById(row.id);
    if (index !== -1) {
      const wasDisabled = csvData.value[index].disabled;
      const isSelected = selectedRowIds.includes(row.id);

      if (isSelected !== wasDisabled) {
        csvData.value[index].disabled = isSelected;
      }
    }
  });
};

watch(selectedProducts, () => {
  onSelectionChange();
});

const rango = (ley) => {
  // switch case
  switch (true) {
    case ley >= 0 && ley <= 3:
      return "0-3";
    case ley > 3 && ley <= 4:
      return "3-4";
    case ley > 4 && ley <= 4.5:
      return "4-4.5";
    case ley > 4.5 && ley <= 5:
      return "4.5-5";
    case ley > 5 && ley <= 10:
      return "5-10";
    default:
      return "10";
  }
};

const updateTravel = async () => {
  if (csvData.value.length === 0) {
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
    }, 5000);
  } else {
    showError.value = false;
    const promedios = targetColumns.reduce((acc, column) => {
      acc[column] = calculateColumnAverage(column);
      return acc;
    }, {});
    try {
      buttonClicked.value = true;
      const updatedTravel = {
        ley_ag: promedios["Ag (ozt)"],
        ley_fe: promedios["Fe (pct)"],
        ley_mn: promedios["Mn (pct)"],
        ley_pb: promedios["Pb (pct)"],
        ley_zn: promedios["Zn (pct)"],
        tmh_ag: promedios["Ag (ozt)"] * props.data.tonh,
        tmh_fe: promedios["Fe (pct)"] * props.data.tonh,
        tmh_mn: promedios["Mn (pct)"] * props.data.tonh,
        tmh_pb: promedios["Pb (pct)"] * props.data.tonh,
        tmh_zn: promedios["Zn (pct)"] * props.data.tonh,
        rango: rango(promedios["Ag (ozt)"]),
        samples: csvData.value,
        isCoding: selectedCodTableta.value,
        name: store.state.user.name,
      };
      const response = await fetch(`${url}/pila/${props.data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTravel),
      });

      const result = await response.json();

      if (result.status === true) {
        console.log("correcto");

        await store.dispatch("get_listQControl");
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
    }
  }
};

const stockClass = (key, data) => {
  if (isRelevantColumn(key)) {
    return [
      "a",
      {
        "bg-green": data < 3,
        "bg-yellow": data >= 3 && data < 9.9999,
        "bg-red": data >= 10,
      },
    ];
  } else {
    return "a"; // Otra clase si no es una columna relevante
  }
};

const isRelevantColumn = (key) => {
  const relevantColumns = [
    "Ag (ozt)",
    "Fe (pct)",
    "Mn (pct)",
    "Pb (pct)",
    "Zn (pct)",
  ];
  return relevantColumns.includes(key);
};
</script>

<template>
  <div class="modalCreate-backg">
    <Transition name="nested">
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
              <ICSV />
            </div>
            <div class="mC-c-title-text">
              <h3>Completar leyes</h3>
              <h4>Subir muestra de Stock Piles</h4>
            </div>
          </div>
          <span @click="cerrarModal" class="mC-h-close" type="button">
            <img src="../assets/img/i-close.svg" alt="" />
          </span>
        </div>
        <div class="mC-c-body">
          <!-- <div
            class="mC-b-text"
            v-if="
              props.data.typePila === 'Giba' && props.data.samples.length > 1
            "
          >
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
                <span class="radio-tile">
                  <span class="radio-label">Seguir Acumulando</span>
                </span>
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
                <span class="radio-tile">
                  <span class="radio-label">Código tableta</span>
                </span>
              </label>
            </div>
          </div> -->
          <div className="mC-b-imputs">
            <div class="table-excel">
              <div class="container-loader-files" v-if="!fileUploaded">
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
                    <input id="file" type="file" @change="handleFileUpload" />
                  </label>
                </div>
                <div class="progress-container" v-if="showLoader">
                  <div class="progress-bar" id="myBar"></div>
                </div>
                <span class="label-error" v-if="showError"
                  >*Documento requerido</span
                >
                <span class="label-error" v-if="showDocError"
                  >*El nombre del archivo ingresado no coincide con el código de
                  despacho</span
                >
              </div>

              <div class="view-excel" v-if="fileUploaded">
                <h4 class="text-excel">
                  Codigo de Despacho
                  <strong>{{ props.data.cod_despacho }}</strong>
                </h4>
                <DataTable
                  :value="csvData"
                  v-model:editingRows="editingRows"
                  v-model:selection="selectedProducts"
                  editMode="row"
                  @row-edit-save="onRowEditSave"
                  @selection-change="onSelectionChange"
                  :class="dataTableClass"
                >
                  <Column
                    selectionMode="multiple"
                    headerStyle="width: 2.5rem"
                    :exportable="false"
                  ></Column>
                  <template v-for="(value, key) in csvData[0]">
                    <Column
                      v-if="key !== 'id' && key !== 'disabled'"
                      :key="key"
                      :field="key"
                      :header="key"
                    >
                      <template #body="{ data, field }">
                        <span :class="stockClass(field, data[field])">{{
                          data[field]
                        }}</span>
                      </template>
                      <template #editor="{ data, field }">
                        <InputNumber
                          v-if="typeof data[field] === 'number'"
                          v-model="data[field]"
                          :mode="'decimal'"
                          :decimal="2"
                          autofocus
                          :class="{
                            'bg-red': data[field] >= 10,
                            'bg-yellow':
                              data[field] >= 3 && data[field] < 9.9999,
                            'bg-green': data[field] < 3,
                          }"
                        />
                        <InputText v-else v-model="data[field]" />
                      </template>
                      <template #footer="{ footerData }">
                        {{ calculateColumnAverage(key) }}
                      </template>
                    </Column>
                  </template>
                  <Column
                    :rowEditor="true"
                    style="width: 30px; min-width: 30px"
                  >
                  </Column>
                </DataTable>
              </div>
            </div>
          </div>
          <div></div>
        </div>

        <div class="mC-c-footer">
          <button @click="cerrarModal" class="btn-cancel" type="button">
            Cancelar
          </button>
          <button
            class="btn-success"
            type="submit"
            @click.prevent="updateTravel"
          >
            <template v-if="buttonClicked">
              <span class="loader"></span>Procesando...
            </template>
            <template v-else> Guardar </template>
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
.bg-red {
  color: #ff0000;
  input {
    color: #ff0000 !important;
  }
}

.bg-yellow {
  color: #ff9900;
  input {
    color: #ff9900;
  }
}

.bg-green {
  color: #00b050;
  input {
    color: #00b050;
  }
}

.CCModal {
  max-width: 960px !important;
}

.disabled-row,
.disabled-row * {
  cursor: not-allowed !important;
  pointer-events: none !important;
  user-select: none !important;
  opacity: 0.8;
}

.table-exel {
  .p-datatable-table {
    tr td:first-child {
      text-align: center;
    }
    td {
      padding: 4px 0;
      border-top: 1px solid var(--grey-light-11);
    }
    th {
      padding: 12px 12px;
    }
    .p-column-header-content {
      justify-content: center;
    }
    .p-datatable-tbody {
      .p-highlight {
        box-shadow: none;
        .p-editable-column {
          opacity: 0.4;
          user-select: none;
          pointer-events: none;
        }
      }
    }
  }

  .columnheader {
    text-align: center;
  }
  .p-editable-column {
    height: 20px !important;
    text-align: center;
    padding: 0 12px !important;
    .p-inputtext {
      height: 30px;
      border-radius: 5px;
      padding: 3px 10px;
      font-size: clamp(6px, 8vw, 12.5px);
      text-align: center;
    }
  }
  .p-cell-editing {
    padding: 4px !important;
  }
  .p-row-editor-init {
    height: 30px;
    width: 30px;
    padding: 0;
    border-radius: 0;
    .p-icon {
      width: 0.8rem;
      height: 0.8rem;
      color: var(--primary);
    }
  }
  .p-cell-editing {
    .p-row-editor-save,
    .p-row-editor-cancel {
      color: var(--primary);
      height: 30px;
      width: 30px;
      padding: 0;
    }
  }
  .p-datatable-tfoot {
    td {
      text-align: center;
      font-weight: 500;
      font-size: clamp(6px, 8vw, 14px);
    }
  }
  .btn-excel-delet {
    padding: 0;
    svg {
      cursor: pointer;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--red);
      fill: transparent;
      stroke-width: 1.6;
      transition: all 0.25s ease-out;
    }
  }
  .p-datatable-wrapper {
  }
}
.table-excel {
  width: 100%;
  color: var(--black);
  font-size: clamp(6px, 8vw, 14px);
  line-height: 0.7rem;

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
  }
}


</style>
