<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { jsPDF } from "jspdf";

const store = useStore();
const url = import.meta.env.VITE_API_URL;

const trips = ref([]);

// Función para enviar el filtro y obtener los datos
const sendFilter = async () => {
  try {
    const response = await fetch(`${url}/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
      body: JSON.stringify({ arr: ["year", "month", "rango", "type"] }),
    });

    const data = await response.json();
    trips.value = data;
    if (data.status === true) {
      console.log("correcto");
    }
  } catch (error) {
    console.error("Error al actualizar:", error);
  }
};

onMounted(async () => {
  await sendFilter();
});

// Función para generar el PDF
const generatePDF = () => {
  const doc = new jsPDF();
  doc.setFont("helvetica");
  // Posición inicial para escribir
  let y = 15;

  // Encabezado
  doc.setFontSize(20);
  doc.text("Reporte Geología", 10, y);
  y += 10;
  doc.setFontSize(12);
  doc.text(`Total de viajes: ${trips.value.length}`, 10, y);
  y += 10;
  doc.text("Análisis de datos de muestra y pilas", 10, y);
  y += 10;

  // Contenido de la tabla
  trips.value.forEach((trip) => {
    doc.setFontSize(10);
    Object.entries(trip).forEach(([key, value], index) => {
      doc.text(`${value}`, 10 + (index * 40), y);
    });
    y += 10;
  });

  // Obtener el PDF como un Blob
  const pdfBlob = doc.output("blob");

  // Crear una URL para el Blob
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Abrir el PDF en una nueva pestaña
  window.open(pdfUrl);
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
  <Button class="btn-success btn-GP" @click="generatePDF">Generate PDF</Button>
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
    <div id="pdf-content" class="pdf-content">
      <div class="c-global-header">
        <div class="global-h-title">
          <div class="g-h-t-primary">
            <h1>Reporte Geología</h1>
            <span>{{ trips ? trips.length : 0 }}</span>
          </div>
          <span> Análisis de datos de muestra y pilas </span>
        </div>
      </div>
      <div class="c-global-c-content">
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
    </div>
  </div>
</template>

<style lang="scss">
.pdf-content {
  h1 {
    font-size: 2rem;
  }
  p {
    font-size: 1.5rem;
  }
  .c-global-c-content {
    padding: 2rem;
  }
}
.btn-GP {
  width: 200px !important;
  margin-left: 2rem;
}

.caratula {
  background-image: url("../assets/img/backg-pdf.svg");
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 115vh;
  position: relative;
}

.contenido-caratula {
  position: absolute;
  left: 50%;
  top: 50%;
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
</style>
