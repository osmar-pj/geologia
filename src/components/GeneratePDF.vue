<script setup>
import { ref, onMounted, computed, defineEmits, defineProps } from "vue";
import { useStore } from "vuex";
import html2pdf from "html2pdf.js";
import GrafCompliance from "./GrafCompliance.vue";
import IExport from "../icons/IExport.vue";
import TablePDF from "../components/TablePDF.vue"

const store = useStore();
const url = import.meta.env.VITE_API_URL;

const emit = defineEmits();
const cerrarModal = () => {
  emit("cerrarModal");
};


const generatingPDF = ref(true);
// Función para enviar el filtro y obtener los datos

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
  <div class="modalCreate-backg">
    <div class="mExporrtPDF-content">
      <div class="pdf-header">
        <h5>
          PDF-Test.pdf
        </h5>
        <button class="btn-GP" @click="generatePDF">
          <IExport/>
        </button>
      </div>
      <span @click="cerrarModal" class="btn-close" type="button">
        <img src="../assets/img/i-close.svg" alt="" />
      </span>
      <div class="pdf-content" v-show="generatingPDF">
        <div id="app" ref="document" >
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
            <div class="pdf-c-table line-pdf line-pdf" id="first-page">
              <h2>Cancha /Dominio Rango</h2>
              <TablePDF lisA="dominio" lisB='rango' />
            </div>
            
            <div class="pdf-c-table line-pdf line-pdf" id="f-pdf-c-table">
              <h2>Cancha /Tipo - Rango</h2>
              <TablePDF lisA="type" lisB='rango' />
            </div>
         
            

            <!-- Contenido de la segunda hoja -->
            <div class="pdf-c-grafic line-pdf" id="second-page">
              <h2 class="pdf-title">
                Reporte de canchas / Yumpag - Uchuccchacua
              </h2>
                <GrafCompliance
                style="width: 100%"
                stage="analysisIn"
                mining="YUMPAG"
              />  
            </div>

            <!-- Contenido de la segunda hoja -->
            <div class="pdf-c-grafic line-pdf" id="t-page">
              <h3 class="pdf-title">
                Reporte de canchas / Yumpag - Uchuccchacua
              </h3>

                <GrafCompliance
                style="width: 100%"
                stage="analysisIn"
                mining="UCHUCCHACUA"
              />  
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.mExporrtPDF-content {
  background-color: rgba(92,97,100,255);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 340mm;
  height: 230mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.pdf-header{
  background-color: #373d3f;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 3rem;
  h5{
  color: var(--white);
  }
}

.pdf-content {
  overflow-y: auto;
  border: 1px solid var(--grey-light-3);
  
  z-index: 2;
  background-color: var(--white);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  width: 297mm;
  height: 210mm;
  margin-bottom: 1rem;
}
.btn-GP {
  width: 35px ;
  height: 35px;
  background-color: rgba(92,97,100,255);
  display: grid;
  place-items: center;
  border-radius: 5px;
  padding: 0;
  svg{
    fill: transparent;
    color: var(--white);
    stroke-width: 1.7;
  }
  &:hover{
    background-color: rgba(92, 97, 100, 0.404);
  }
}

.btn-close{
  position: absolute;
  right: -5px;
  top: -5px;
  width: 20px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.623);
  display: grid;
  place-items: center;
  border-radius: 5px;
  
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

.line-pdf{
  border-bottom: 1px solid var(--grey-light-22);
}

.line-pdf-t{
  border-bottom: 1px solid var(--grey-light-22);
  height: auto;
  display: grid;
  gap: 2rem;

}

.pdf-c-table,
.pdf-c-grafic {
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

.pdf-c-table{
 gap: 2rem;
}
</style>
