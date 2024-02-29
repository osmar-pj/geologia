<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import readXlsxFile from "read-excel-file";
import { formatFixed, formatDateAbas, formatHour } from "../libs/utils";
import Success from "../components/Success.vue";
import ICalendar from "../icons/ICalendar.vue";

const url = import.meta.env.VITE_API_URL;
const store = useStore();

const loading = ref(true);
const dataCancha = ref([]);

const showSuccessM = ref(false);
const showError = ref(false);

const hideError = () => {
  showError.value = false;
};

onMounted(async () => {
  await store.dispatch("config_planta");
});

const data = computed(() => store.state.configPlanta);

const handleFileChange = (event) => {
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

        // Guardar los datos en la variable dataCancha
        dataCancha.value = data;
        console.log(dataCancha.value);
      } else {
        console.error("El archivo Excel está vacío.");
      }
    })
    .catch((error) => {
      console.error("Error al procesar el archivo Excel:", error);
    });
};

const buttonClicked = ref(false);

const uploadFile = async () => {
  try {
    buttonClicked.value = true;
    const updatedTravel = {
      data: dataCancha.value,
      user: store.state.user.name,
    };
    console.log(updatedTravel);
    const response = await fetch(`${url}/program`, {
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
      showSuccessM.value = true;
      setTimeout(() => {
        dataCancha.value = [];
        showSuccessM.value = false;
        buttonClicked.value = false;
      }, 2500);
    } else {
      console.log("error");
      buttonClicked.value = false;
    }
  } catch (error) {
    console.error("Error al actualizar:", error);
    buttonClicked.value = false;
  }
};

const formatDateExcel = (dateString) => {
  const dateObject = new Date(dateString); // Convertir la cadena de fecha a un objeto Date
  if (isNaN(dateObject.getTime())) {
    console.error("La cadena de fecha no es válida:", dateString);
    return ""; // Devolver una cadena vacía si la fecha no es válida
  }

  const isoString = dateObject.toISOString(); // Convertir la fecha a formato ISO 8601

  // Obtener el año, mes y día de la cadena ISO 8601
  const year = isoString.slice(0, 4);
  const month = isoString.slice(5, 7);
  const day = isoString.slice(8, 10);

  // Obtener el nombre abreviado del mes
  const monthNames = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Oct",
    "Nov",
    "Dic",
  ];
  const monthIndex = parseInt(month, 10) - 1; // Restar 1 porque los meses se indexan desde 0 en JavaScript
  const monthAbbr = monthNames[monthIndex];

  // Formatear la fecha como "MMM DD, YYYY"
  const formattedDate = `${monthAbbr} ${parseInt(day, 10)}, ${year}`;

  return formattedDate;
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
    <div class="c-setting-history">
      <div
        class="s-history-item"
        v-for="(item, index) in data.data"
        :key="index"
      >
        <div class="s-h-item-body">
          <span>{{ item.month }}</span>
          <h4><ICalendar /> {{ formatDateAbas(item.date) }}</h4>
          <h4>
            <img src="../assets/img/i-time.svg" alt="" />
            {{ formatHour(item.date) }}
          </h4>
        </div>
        <div class="s-h-item-footer">
          <h5>
            <strong>{{ item.user }}</strong>
          </h5>
        </div>
      </div>
      <div class="s-history-item histoy-desact">
        <div class="s-h-item-body">
          <span>ABRIL</span>
          <h4><ICalendar />--</h4>
          <h4><img src="../assets/img/i-time.svg" alt="" /> --</h4>
        </div>
        <div class="s-h-item-footer">
          <h5><strong>--</strong></h5>
        </div>
      </div>
      <div class="s-history-item histoy-desact">
        <div class="s-h-item-body">
          <span>MAYO</span>
          <h4><ICalendar />--</h4>
          <h4><img src="../assets/img/i-time.svg" alt="" /> --</h4>
        </div>
        <div class="s-h-item-footer">
          <h5><strong>--</strong></h5>
        </div>
      </div>
      <div class="s-history-item histoy-desact">
        <div class="s-h-item-body">
          <span>JUNIO</span>
          <h4><ICalendar />--</h4>
          <h4><img src="../assets/img/i-time.svg" alt="" /> --</h4>
        </div>
        <div class="s-h-item-footer">
          <h5><strong>--</strong></h5>
        </div>
      </div>
      <div class="s-history-item histoy-desact">
        <div class="s-h-item-body">
          <span>JULIO</span>
          <h4><ICalendar />--</h4>
          <h4><img src="../assets/img/i-time.svg" alt="" /> --</h4>
        </div>
        <div class="s-h-item-footer">
          <h5><strong>--</strong></h5>
        </div>
      </div>
      <div class="s-history-item histoy-desact">
        <div class="s-h-item-body">
          <span>AGOSTO</span>
          <h4><ICalendar />--</h4>
          <h4><img src="../assets/img/i-time.svg" alt="" /> --</h4>
        </div>
        <div class="s-h-item-footer">
          <h5><strong>--</strong></h5>
        </div>
      </div>
      <div class="s-history-item histoy-desact">
        <div class="s-h-item-body">
          <span>SETIEMBRE</span>
          <h4><ICalendar />--</h4>
          <h4><img src="../assets/img/i-time.svg" alt="" /> --</h4>
        </div>
        <div class="s-h-item-footer">
          <h5><strong>--</strong></h5>
        </div>
      </div>
      <div class="s-history-item histoy-desact">
        <div class="s-h-item-body">
          <span>OCTUBRE</span>
          <h4><ICalendar />--</h4>
          <h4><img src="../assets/img/i-time.svg" alt="" /> --</h4>
        </div>
        <div class="s-h-item-footer">
          <h5><strong>--</strong></h5>
        </div>
      </div>
    </div>
    <div class="c-setting-body">
      <div class="file-upload-form">
        <label for="fileCancha" class="file-upload-label">
          <div class="file-upload-design">
            <svg viewBox="0 0 640 512" height="1em">
              <path
                d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
              ></path>
            </svg>
            <span class="browse-button">Subir archivo</span>
          </div>
          <input id="fileCancha" type="file" @change="handleFileChange" />
        </label>
      </div>
      <span class="label-error" v-if="showError">*Documento requerido</span>

      <div class="config-content-table N-datatable" v-if="dataCancha.length">
        <table>
          <thead>
            <tr>
              <th v-for="(value, key) in dataCancha[0]" :key="key">
                {{ key }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in dataCancha" :key="index">
              <td v-for="(value, key) in row" :key="key">
                <template v-if="key === 'date'">
                  {{ formatDateExcel(value) }}
                </template>
                <template v-else-if="key === 'ton_prog'">
                  {{ formatFixed(value) }} <small>TMH</small>
                </template>
                <template v-else>
                  {{ typeof value === "number" ? value.toFixed(2) : value }}
                </template>
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
  <Transition :duration="550" name="nested">
    <div class="modalCreate-backg" v-if="showSuccessM">
      <Transition name="bounce">
        <Success />
      </Transition>
    </div>
  </Transition>
</template>

<style lang="scss">
.config-content-table {
  overflow: auto;
  height: 400px !important;
}
.c-setting-history {
  display: flex;

  gap: 1rem;
  .s-history-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--white);
    border: 1px solid var(--grey-light-2);
    border-radius: 12px;
    min-width: 130px;
    gap: 0.3rem;

    .s-h-item-body {
      width: 100%;
      padding: 1.3rem 1.2rem 0.5rem 1.2rem;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      span {
        font-size: clamp(3px, 5vw, 14px);
        line-height: 0.7rem;
        font-weight: 600;
        padding-bottom: 0.2rem;
      }
      h4 {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        color: var(--grey-2);
        font-size: clamp(5px, 8vw, 11.5px);
        line-height: 0.8rem;
        img,
        svg {
          width: 0.8rem;
          height: 0.8rem;
        }
      }
    }
    .s-h-item-footer {
      width: 100%;
      padding: 0.5rem 1.2rem;
      border-top: 1px solid var(--grey-light-2);
      h5 {
        color: var(--grey-2);
        font-size: clamp(5px, 8vw, 10px);
        line-height: 0.8rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
        white-space: normal;
      }
    }
  }
}

.histoy-desact{
  opacity: .4;
}
</style>
