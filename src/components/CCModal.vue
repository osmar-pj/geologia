<script setup>
import readXlsxFile from "read-excel-file";
import Papa from "papaparse";
import { ref, watch, onMounted, computed } from "vue";
import { useStore } from "vuex";
import Success from "../components/Success.vue";
import Edit from "../icons/Edit.vue";
import Delete from "../icons/Delete.vue";

const url = import.meta.env.VITE_API_URL;
const store = useStore();
const props = defineProps(["data"]);
const emit = defineEmits(["cerrarModal"]);
const cerrarModal = () => {
  emit("cerrarModal");
};

const hideError = () => {
  showError.value = false;
};

const title = ref();
const csvData = ref([]);
const averages = ref([]);
const selectedProducts = ref();
const showError = ref(false);
const buttonClicked = ref(false);
const showSuccessM = ref(false);
const showForm = ref(true);

const handleFileUpload = (event) => {
  const file = event.target.files[0];

  if (file) {
    const fileName = file.name;
    const underscoreIndex = fileName.indexOf("_");
    title.value =
      underscoreIndex !== -1
        ? fileName.substring(0, underscoreIndex)
        : fileName;

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
          return newRow
        })
        
        const finalData = filteredData.filter((row) =>
        Object.values(row).some((value) => value !== "")
        )
        
        finalData.forEach((row, index) => {
          row["id"] = index + 1
          row["disabled"] = false
        })
        
        csvData.value.push(...finalData)
      },
      error: (error) => {
        console.error("Error parsing CSV:", error.message);
      },
    })
  }
}

const dataTableClass = "table-exel";
const editingRows = ref([]);
const onRowEditSave = (event) => {
  let { newData, index } = event;
  csvData.value[index] = newData;
}

const targetColumns = [
  "Ag (ozt)",
  "Fe (pct)",
  "Mn (pct)",
  "Pb (pct)",
  "Zn (pct)",
]

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

const updateTravel = async () => {
  if (!title.value || !csvData.value || !averages.value) {
    showError.value = true;
  } else {
    showError.value = false;
    const promedios = targetColumns.reduce((acc, column) => {
      acc[column] = calculateColumnAverage(column);
      return acc;
    }, {})
    try {
      buttonClicked.value = true;
      const updatedTravel = {
        ley_ag: promedios['Ag (ozt)'],
        ley_fe: promedios['Fe (pct)'],
        ley_mn: promedios['Mn (pct)'],
        ley_pb: promedios['Pb (pct)'],
        ley_zn: promedios['Zn (pct)'],
        cod_despacho: title.value,
        samples: csvData.value,
        statusCumm: false
      }
      const response = await fetch(`${url}/pila/${props.data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTravel),
      })

      const result = await response.json();

      if (result.status === true) {
        console.log("correcto");

        await store.dispatch("get_listControl");
        showForm.value = false;
        setTimeout(() => {
          showSuccessM.value = true;
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
  }
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
              <Edit />
            </div>
            <div class="mC-c-title-text">
              <h2>Completar leyes</h2>
              <h4>Rellenar la información restante del viaje</h4>
            </div>
          </div>
          <span @click="cerrarModal" class="mC-h-close" type="button">
            <img src="../assets/img/i-close.svg" alt="" />
          </span>
        </div>
        <div class="mC-c-body">
          <!-- <div className="mC-b-info">
            <p>
              El viaje programado el <strong>'{{ data.date }} '</strong>,
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
          </div> -->
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
                  <input id="file" type="file" @change="handleFileUpload" />
                </label>
              </div>
              <span class="label-error" v-if="showError"
                >*Ingrese documento</span
              >
              <div class="view-excel" v-if="csvData.length">
                <h4 class="text-excel">
                  Nombre del Archivo <strong>archivo Excel:{{ title }}</strong>
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
                        {{ data[field] }}
                      </template>
                      <template #editor="{ data, field }">
                        <component
                          :is="
                            typeof data[field] === 'number'
                              ? 'InputNumber'
                              : 'InputText'
                          "
                          v-model="data[field]"
                          :mode="
                            typeof data[field] === 'number' ? 'decimal' : ''
                          "
                          autofocus
                        />
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
    <Transition name="bounce">
      <Success v-if="showSuccessM" />
    </Transition>
  </div>
</template>

<style lang="scss">
.CCModal {
  max-width: 1200px !important;
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
    width: 60px;
    height: 20px !important;
    text-align: center;
    padding: 0 12px !important;
    .p-inputtext {
      height: 30px;
      border-radius: 5px;
      padding: 3px 10px;
      font-size: clamp(6px, 8vw, 13.5px);
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
    .p-row-editor-cancel {
      padding-left: 0.5rem;
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
