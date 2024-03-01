<script setup>
import { defineEmits, onMounted, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const url = import.meta.env.VITE_API_URL;

const emit = defineEmits();

const trips = ref([]);

const sendFilter = async () => {
  try {
    const response = await fetch(`${url}/listGeneral`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
      body: JSON.stringify({
        ts: 1704085200000,
        arr: ["type", "rango"],
        category: "trips",
      }),
    });

    const data = await response.json();

    if (data.status === true) {
      console.log("correcto");

      const newData = data.data.data;
      const newData2 = data.data.header;
      // Verificamos si newData es un array y tiene al menos dos elementos
      if (Array.isArray(newData) && newData.length >= 2) {
        // Asignamos el header a cada uno de los objetos en newData
        newData[0].header = newData2;
        newData[1].header = newData2;

        trips.value = newData;
        console.log(newData)
      } else {
        console.error(
          "newData no es un array o no contiene al menos dos elementos"
        );
      }
    }
  } catch (error) {
    console.error("Error al actualizar:", error);
  }
};

onMounted(async () => {
  await sendFilter();
});
</script>
<template>
  <div class="pdf-c-table line-pdf line-pdf" id="f-page">
    <h3 class="pdf-title">Stock de canchas / Uchuccchacua</h3>
    
    <div class="c-global-c-filtered">
  <div
    class="c-item-filtered config-content-table N-datatable"
    v-for="(trip, index) in trips.data"
    :key="index"
  >
    <table class="table" style="width: 100%" v-if="!store.state.loading">
      <thead>
        <tr>
          <th
            v-for="(column, columnIndex) in trip.header"
            :key="columnIndex"
          >
            {{ column.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in trip.body" :key="rowIndex">
          <td v-for="(column, columnIndex) in row" :key="columnIndex">
            <h4 class="t-ley">
              {{ column }}
            </h4>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>Loading...</div>
  </div>
</div>

   
  </div>
</template>

<style lang="scss">
.c-global-c-filtered {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 800px;
  overflow: hidden;
  width: 100%;
  .c-item-filtered {
    display: flex;
    height: 50%;
  }
}
</style>
