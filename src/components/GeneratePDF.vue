<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import html2pdf from "html2pdf.js";
import ComplianceGraf from "./ComplianceGraf.vue";

const store = useStore();
const url = import.meta.env.VITE_API_URL;

const trips = ref([]);
const tripsY = ref([]);
const generatingPDF = ref(true);
// Función para enviar el filtro y obtener los datos
const sendFilter = async () => {
  try {
    const response = await fetch(`${url}/listGeneral`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
      body: JSON.stringify({
        arr: ["mining", "year", "month", "rango", "type"],
        category: "trips",
        filtered: { month: "ENERO", mining: "UCHUCCHACUA" },
      }),
    });

    const data = await response.json();
    console.log(data);
    if (data.status === true) {
      console.log("correcto");
      trips.value = data.data;
      console.log(data.data);
    }
  } catch (error) {
    console.error("Error al actualizar:", error);
  }
};

const sendFilterY = async () => {
  try {
    const response = await fetch(`${url}/listGeneral`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
      body: JSON.stringify({
        arr: ["mining", "year", "month", "rango", "type"],
        category: "trips",
        filtered: { month: "ENERO", mining: "YUMPAG" },
      }),
    });

    const data = await response.json();
    console.log(data);
    if (data.status === true) {
      console.log("correcto");
      tripsY.value = data.data;
      console.log(data.data);
    }
  } catch (error) {
    console.error("Error al actualizar:", error);
  }
};

onMounted(async () => {
  await sendFilter();
  await sendFilterY();
});

const generatePDF = () => {
  const options = {
    margin: 0,
    filename: "documento.pdf",
    image: {
      type: "jpeg",
      quality: 0.98,
    },
    html2canvas: {
      scale: 3,
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm", // Cambiar la unidad a milímetros
      format: [297, 210], // Establecer el formato como "landscape" en milímetros
      orientation: "landscape",
    },
    pagebreak: {
      mode: "legacy",
    },
  };

  const content = document.getElementById("pdf-content");
  html2pdf().from(content).set(options).save();
};

const storedUser = JSON.parse(localStorage.getItem("user"));
const currentDate = ref(new Date());
const formattedDate = ref(formatDate(currentDate.value));

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Actualizar la fecha cada segundo
setInterval(() => {
  currentDate.value = new Date();
  formattedDate.value = formatDate(currentDate.value);
}, 1000);
</script>
<template>
  <button class="btn-success btn-GP" @click="generatePDF">Exportar PDF</button>
  <div class="pdf-content" v-show="!generatingPDF">
    <div id="app" ref="document" style="width: 297mm; height: 210mm">
      <div id="pdf-content">
        <!-- Contenido de la caratula hoja -->

        <div class="caratula">
          <div class="contenido-caratula">
            <h3>{{ formattedDate }}</h3>
            <h1>REPORTE</h1>
            <h2>Área/ Geología</h2>
            <h4>{{ storedUser.name }}</h4>
          </div>
        </div>

        <!-- Contenido de la primera hoja -->
        <div class="pdf-c-table" id="first-page">
          <h3 class="pdf-title">Stock de canchas / Yumpag</h3>
          <div class="N-datatable">
            <table>
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Rango</th>
                  <th>Tipo</th>
                  <th>Tonelaje</th>
                  <th>Ley Ag</th>
                  <th>Ley Fe</th>
                  <th>Ley Mn</th>
                  <th>Ley Pb</th>
                  <th>Ley Zn</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in trips.body" :key="item.id">
                  <td>{{ item.month }}</td>
                  <td>{{ item.rango }}</td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.tonh.toFixed(2) }}</td>
                  <td>{{ item.ley_ag.toFixed(2) }}</td>
                  <td>{{ item.ley_fe.toFixed(2) }}</td>
                  <td>{{ item.ley_mn.toFixed(2) }}</td>
                  <td>{{ item.ley_pb.toFixed(2) }}</td>
                  <td>{{ item.ley_zn.toFixed(2) }}</td>
                </tr>
                <tr
                  v-for="item in trips.footer"
                  :key="item.id"
                  class="tbl-bold"
                >
                  <td>Total</td>
                  <td></td>
                  <td></td>
                  <td>{{ item.tonh.toFixed(2) }}</td>
                  <td>{{ item.ley_ag.toFixed(2) }}</td>
                  <td>{{ item.ley_fe.toFixed(2) }}</td>
                  <td>{{ item.ley_mn.toFixed(2) }}</td>
                  <td>{{ item.ley_pb.toFixed(2) }}</td>
                  <td>{{ item.ley_zn.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="html2pdf__page-break"></div>

        <div class="pdf-c-table" id="f-page">
          <h3 class="pdf-title">Stock de canchas / Uchuccchacua</h3>
          <div class="N-datatable">
            <table>
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Rango</th>
                  <th>Tipo</th>
                  <th>Tonelaje</th>
                  <th>Ley Ag</th>
                  <th>Ley Fe</th>
                  <th>Ley Mn</th>
                  <th>Ley Pb</th>
                  <th>Ley Zn</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in tripsY.body" :key="item.id">
                  <td>{{ item.month }}</td>
                  <td>{{ item.rango }}</td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.tonh.toFixed(2) }}</td>
                  <td>{{ item.ley_ag.toFixed(2) }}</td>
                  <td>{{ item.ley_fe.toFixed(2) }}</td>
                  <td>{{ item.ley_mn.toFixed(2) }}</td>
                  <td>{{ item.ley_pb.toFixed(2) }}</td>
                  <td>{{ item.ley_zn.toFixed(2) }}</td>
                </tr>
                <tr
                  v-for="item in tripsY.footer"
                  :key="item.id"
                  class="tbl-bold"
                >
                  <td>Total</td>
                  <td></td>
                  <td></td>
                  <td>{{ item.tonh.toFixed(2) }}</td>
                  <td>{{ item.ley_ag.toFixed(2) }}</td>
                  <td>{{ item.ley_fe.toFixed(2) }}</td>
                  <td>{{ item.ley_mn.toFixed(2) }}</td>
                  <td>{{ item.ley_pb.toFixed(2) }}</td>
                  <td>{{ item.ley_zn.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Salto de página después de la primera hoja -->
        <div class="html2pdf__page-break"></div>

        <!-- Contenido de la segunda hoja -->
        <div class="pdf-c-grafic" id="second-page">
          <h2 class="pdf-title">Reporte de canchas / Yumpag - Uchuccchacua</h2>
          <ComplianceGraf
            style="width: 100%"
            stage="analysisIn"
            mining="YUMPAG"
          />
        </div>

        <!-- Contenido de la segunda hoja -->
        <div class="pdf-c-grafic" id="t-page">
          <h3 class="pdf-title">Reporte de canchas / Yumpag - Uchuccchacua</h3>

          <ComplianceGraf
            style="width: 100%"
            stage="analysisIn"
            mining="UCHUCCHACUA"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.pdf-content {
  // width: 100%;
  // height: 80vh;
  overflow: auto;
  border: 1px solid var(--grey-light-3);
  margin: 2rem 2rem 2rem 2rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  // max-width: 1000px;
  background-color: var(--white);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border-radius: 10px;

  width: 297mm;
  height: 210mm;
}
.btn-GP {
  width: 200px !important;
}

.caratula {
  width: 297mm;
  height: 210mm;
  background-image: url("../assets/img/backg-pdf.svg");
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;

  .contenido-caratula {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    text-align: center;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    h1 {
      color: #ffca0c;
      padding-bottom: 1rem;
      font-size: clamp(13px, 8vw, 30px);
      line-height: 1.7rem;
    }
    h2 {
      color: #3ecef3;
    }
    h3 {
      color: #ffca0c;
    }
    h4 {
      color: var(--white);
    }
  }
}

.pdf-c-table,.pdf-c-grafic  {
  width: 297mm;
  height: 210mm;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pdf-title {
  padding-bottom: 1rem;
  text-align: left;
  font-weight: 550;
  width: 100%;
}

.tbl-bold {
  font-weight: 600;
  font-size: clamp(6px, 8vw, 14px);
  td {
    background-color: #ffd90049;
  }
}
</style>
