<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import html2pdf from "html2pdf.js";
import Graf from "../components/Graf.vue";

const store = useStore();
const url = import.meta.env.VITE_API_URL;

const trips = ref([]);
const generatingPDF = ref(true);
// Función para enviar el filtro y obtener los datos
const sendFilter = async () => {
  try {
    const response = await fetch(`${url}/plantalist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
      body: JSON.stringify({ arr: ["year", "month"] }),
    });

    const data = await response.json();
    if (data.status === true) {
      console.log("correcto");
      trips.value = data.data;
    }
  } catch (error) {
    console.error("Error al actualizar:", error);
  }
};

onMounted(async () => {
  await sendFilter();
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
      unit: "in",
      format: "letter",
      orientation: "landscape",
    },
    pagebreak: {
      mode: "legacy",
    },
  };

  // Crear un PDF con ambas secciones
  const content = document.getElementById("element-to-convert");
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
  <!-- <Button class="btn-success btn-GP" @click="generatePDF">Generate PDF</Button> -->
  <div>
    <!-- <div class="caratula">
       <div class="contenido-caratula">
         <h3>{{ formattedDate  }}</h3>
         <h1>REPORTE</h1>
         <h2>Área/ Geología</h2>
         <h4>{{ storedUser.name }}</h4>
       </div>
     </div>
     -->
  </div>
  <button class="btn-success btn-GP" @click="generatePDF">
    Exportar PDF
  </button>
  <div class="pdf-content"  v-show="!generatingPDF">
    <div id="app" ref="document" style="text-align: center">
      <div id="element-to-convert">
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
        <div class="c-global-c-content" id="first-page">
          <DataTable :value="trips">
            <Column field="month" header="Mes"></Column>
            <Column field="rango" header="Rango"></Column>
            <Column field="type" header="Tipo"></Column>
            <Column field="tonh" header="Tonelaje">
              <template #body="slotProps">
                {{ slotProps.data.tonh.toFixed(2) }}
              </template>
            </Column>
            <Column field="ley_ag" header="Ley Ag">
              <template #body="slotProps">
                {{ slotProps.data.ley_ag.toFixed(2) }}
              </template>
            </Column>
            <Column field="ley_fe" header="Ley Fe">
              <template #body="slotProps">
                {{ slotProps.data.ley_fe.toFixed(2) }}
              </template>
            </Column>
            <Column field="ley_mn" header="Ley Mn">
              <template #body="slotProps">
                {{ slotProps.data.ley_mn.toFixed(2) }}
              </template>
            </Column>
            <Column field="ley_pb" header="Ley Pb">
              <template #body="slotProps">
                {{ slotProps.data.ley_pb.toFixed(2) }}
              </template>
            </Column>
            <Column field="ley_zn" header="Ley Zn">
              <template #body="slotProps">
                {{ slotProps.data.ley_zn.toFixed(2) }}
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Salto de página después de la primera hoja -->
        <div class="html2pdf__page-break"></div>

        <!-- Contenido de la segunda hoja -->
        <div class="pdf-c-grafic" id="second-page">
          <Graf ruta="YUMPAG" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.pdf-content {
  width: 100%;
  height: 80vh;
  overflow: auto;
  border: 1px solid var(--grey-light-3);
  margin: 2rem 2rem 2rem 2rem;
}
.btn-GP {
  width: 200px !important;
  
}

.caratula {
  background-image: url("../assets/img/backg-pdf.svg");
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  position: relative;
}

.contenido-caratula {
  overflow: auto;
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  z-index: 1;
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
.pdf-c-grafic{
  width: 100%;
  height: 100%;
  padding: 2rem;
  display: grid;
  place-items: center;
}
</style>
