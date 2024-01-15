<template>
  <div class="table-excel">
    <div></div>
    <input type="file" @change="handleFileChange" />
    <h4>Datos desde el archivo Excel</h4>
    <div v-if="data.length">
      <table>
        <thead>
          <tr>
            <th v-for="(col, index) in data[0]" :key="index">{{ col }}</th>
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
</template>

<script>
import readXlsxFile from "read-excel-file";

export default {
  data() {
    return {
      data: [],
      averages: [],
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];

      readXlsxFile(file)
        .then((rows) => {
          const averages = [];

          for (let col = 0; col < rows[0].length; col++) {
            const column = rows
              .map((row) => parseFloat(row[col]))
              .filter((value) => !isNaN(value));
            const average =
              column.reduce((acc, value) => acc + value, 0) / column.length;
            averages.push(average);
          }

          this.data = rows;
          this.averages = averages;
        })
        .catch((error) => {
          console.error("Error al procesar el archivo Excel:", error);
        });
    },
  },
};
</script>

<style lang="scss">
input[type="file"] {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: none;
  background-color: var(--white);
  border: none;
  height: 40px;
  width: 100%;
  text-align: left;
  border-radius: 10px;
  padding: 14px 20px 14px 45px;
  font-size: clamp(5.5px, 8vw, 12px);
  font-weight: 400;
  border: 1.5px solid var(--grey-light-2);
  transition: all 0.25s ease-out;
}

.table-excel {
  width: 100%;
  color: var(--black);
  font-size: clamp(6px, 8vw, 14px);
  line-height: 0.7rem;
  font-weight: 500;
  border-collapse: collapse;
  white-space: nowrap;
  overflow: hidden;
  padding-top: 1rem;
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
