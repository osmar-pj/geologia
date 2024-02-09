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
    tabla
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

