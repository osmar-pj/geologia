<script setup>
import readXlsxFile from "read-excel-file";
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
const url = import.meta.env.VITE_API_URL;

const { showModal } = defineProps(["showModal"]);
const emit = defineEmits();

const cerrarModal = () => {
  emit("cerrarModal");
};

const store = useStore();
const userModal = store.state.userModal;

const data = ref([]);
const averages = ref([]);

const handleFileChange = (event) => {
  const file = event.target.files[0];

  readXlsxFile(file)
    .then((rows) => {
      const averagesArr = [];

      for (let col = 0; col < rows[0].length; col++) {
        const column = rows
          .map((row) => parseFloat(row[col]))
          .filter((value) => !isNaN(value));
        const average =
          column.reduce((acc, value) => acc + value, 0) / column.length;
        averagesArr.push(average);
      }

      data.value = rows;
      averages.value = averagesArr;
    })
    .catch((error) => {
      console.error("Error al procesar el archivo Excel:", error);
    });
};


const updateTravel = async () => {

  try {
    userModal.statusGeology = "General";
    userModal.ley_ag = averages.value[0].toFixed(2);
    userModal.ley_fe = averages.value[1].toFixed(2);
    userModal.ley_mn = averages.value[2].toFixed(2);
    userModal.ley_pb = averages.value[3].toFixed(2);
    userModal.ley_zn = averages.value[4].toFixed(2);
    datosMuestra()
    const response = await fetch(`${url}/triplist/${userModal._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userModal),
    });

    const data = await response.json();

    if (data.status === true) {
      console.log("correcto");
    } else {
      console.log("error");
    }
  } catch (error) {
    console.error("Error al actualizar:", error);
  }
};

const datosMuestra = async () => {

try {
 
  const response = await fetch(`${url}/ruma/${userModal._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data.value),
  });

  const data = await response.json();

  if (data.status === true) {
    console.log("correcto");
  } else {
    console.log("error");
  }
} catch (error) {
  console.error("Error al actualizar:", error);
}
};
</script>

<template>
  <div class="modalCreate-backg">
    <form class="mCreate-content">
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
            El viaje programado el <strong>'{{ userModal.fecha }} '</strong>,
            conducido por <strong> {{ userModal.operador }} </strong> asociado
            al vehículo <strong>'{{ userModal.vehiculo }} '</strong>, transportó
            <strong>{{ userModal.ton }} toneladas</strong> de
            <strong>{{ userModal.material }} </strong> en
            <strong>{{ userModal.vagones }} vagones</strong>. El vehículo, con
            el tipo <strong>'{{ userModal.tipo }} '</strong>, se dirigió al tajo
            denominado <strong>'{{ userModal.tajo }} '</strong>. La tableta no
            fue especificada, y el estado final del viaje fue
            <strong>'{{ userModal.status }}'</strong>.
          </p>
        </div>
        <div className="mC-b-imputs">          
           <div class="table-excel">
            <div></div>
            <input type="file" @change="handleFileChange" />
            <h4>Datos desde el archivo Excel</h4>
            <div v-if="data.length">
              <table>
                <thead>
                  <tr>
                    <th v-for="(col, index) in data[0]" :key="index">
                      {{ col }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in data.slice(1)" :key="rowIndex">
                    <td v-for="(value, colIndex) in row" :key="colIndex">
                      {{ isNaN(value) ? value : value.toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td v-for="(average, index) in averages" :key="index">
                      {{ isNaN(average) ? average : average.toFixed(2) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div> 
           <!-- <div className="mC-imputs-item">
            <label>Codigo de muestra</label>
            <div className="imputs-i-input">
              <img src="../assets/img/i-tablet.svg" alt="" />
              <input
                type="text"
                name="operationTruck_Id"
                inputMode="text"
                placeholder="Ej.000122"
                className="input-crud"
                value=""
                required
              />
            </div>
          </div>  -->
          <!-- <div className="mC-imputs-item">
            <label>Fecha Abastecimiento</label>
            <div className="imputs-i-input">
              
              <input
                type="date"
                name="operationTruck_Id"
                inputMode="text"
                placeholder="Ej. TJ-999_9_1"
                className="input-crud"
                value=""
                required
              />
            </div>
          </div> -->
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
          Guardar
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss">

.table-excel {
  width: 100%;
  color: var(--black);
  font-size: clamp(6px, 8vw, 14px);
  line-height: 0.7rem;
  font-weight: 500;
  border-collapse: collapse;
  white-space: nowrap;
  overflow: hidden;
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
  }
  tfoot {
    font-weight: 700;
  }
}
</style>
