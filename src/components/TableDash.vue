<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const data = computed(() => {
  return store.state.dataFilterTable;
});
</script>

<template>
  <div class="table-dash">
    <div class="container-t-dash">
      <table>
        <thead>
          <tr>
            <th v-for="(column, index) in data.columns" :key="index">
              {{ column.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data.data" :key="index">
            <td v-for="column in data.columns" :key="column.field">
              {{
                column.fn
                  ? column.fn(row[column.field])
                  : typeof row[column.field] === "number"
                  ? row[column.field].toFixed(1)
                  : row[column.field] || column.und
              }}
            </td>
          </tr>
        </tbody>
      </table>
      <!-- <DataTable :value="data.data">
      <Column
        v-for="(column, index) in data.columns"
        :key="index"
        :field="column.field"
        :header="column.title"
      >
        <template #body="slotProps">
          {{
            slotProps.row &&
            slotProps.row[column.field] !== undefined
              ? (column.fn
                  ? column.fn(slotProps.row[column.field])
                  : typeof slotProps.row[column.field] === "number"
                  ? slotProps.row[column.field].toFixed(1)
                  : slotProps.row[column.field]) || column.und
              : ""
          }}
        </template>
      </Column>
    </DataTable> -->
    </div>
  </div>
</template>

<style lang="scss">
.div-co-dash {
  display: flex;
  gap: 1rem;
}
.btn-graficar {
  background-color: var(--primary);
  max-width: 200px;
}
.container-t-dash {
  overflow: auto;
  width: 100%;
  height: 400px;
}
.table-dash {
  width: 100%;
  color: var(--black);
  font-size: clamp(6px, 8vw, 14px);
  line-height: 0.7rem;
  font-weight: 500;
  border-collapse: collapse;
  white-space: nowrap;
  overflow: hidden;
  padding-top: 1rem;
  background-color: var(--white);
  border-radius: var(--br-xxl);
  border: 1px solid var(--grey-light-22);
  padding: 2rem;
  table {
    width: 100%;
    color: var(--black);
    font-size: clamp(6px, 8vw, 13px);
    line-height: 0.7rem;
    border-collapse: collapse;
    white-space: nowrap;
  }

  thead {
    color: var(--grey-1);
    text-align: left;
    background-color: var(--grey-light-1);
    font-size: clamp(6px, 8vw, 11px);
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  th {
    padding: 15px 12px;
    font-weight: normal !important;
    text-align: left;
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
    padding: 12px 10px;
    text-align: left;
  }

  tbody tr {
    z-index: 99;
    background-color: var(--white);
  }
  tr:nth-child(even) {
    background-color:var(--grey-light-1);
    border-top: 1px solid var(--grey-light-22);
    border-bottom: 1px solid var(--grey-light-22);
  }
}
</style>
