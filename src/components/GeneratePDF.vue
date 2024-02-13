<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

const trips = ref([])
// PDF content
const sendFilter = async () => {  
    try {
      const response = await fetch(`${url}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": true,
        },
        body: JSON.stringify({ arr: ['year', 'month', 'rango', 'type']}),
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
    await sendFilter()
})


const storedUser = JSON.parse(localStorage.getItem("user"));
const currentDate = ref(new Date());

const formattedDate = ref(formatDate(currentDate.value));

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
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
  <Button class="btn-success btn-GP" @click="() => $refs.html2Pdf.generatePdf()">Generate PDF</Button>
  <div>
    <vue3-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="false"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      :filename="`Geology report ${new Date().toLocaleDateString()}`"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      :pdf-margins="{ top: 2.5 * 28.35, right: 2.5 * 28.35, bottom: 2.5 * 28.35, left: 2.5 * 28.35 }"
      pdf-content-width="calc(100% - (2.5 * 28.35 * 2))"
      ref="html2Pdf"
      >
      <template v-slot:pdf-content>
        <div class="caratula">
          <div class="contenido-caratula">
            <h3>{{ formattedDate  }}</h3>
            <h1>REPORTE</h1>
            <h2>Área/ Geología</h2>
            <h4>{{ storedUser.name }}</h4>
          </div>
        </div>
        <!-- <div class="html2pdf__page-break"/> -->
        <div class="pdf-content">
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
      </template>
    </vue3-html2pdf>
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
