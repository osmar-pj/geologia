<script setup>
import TableList from "../components/Table.vue";
import { ref, onMounted, computed } from "vue"
import { useStore } from "vuex"
const store = useStore()

onMounted(async () => {
    await store.dispatch('get_list')
})

const data = computed(() => {
    return store.state.dataList
})

</script>

<template>
    <TableList :showActionsColumn="true" title="Viajes recientes, por completar" :data="data" :showColum="false"  />
</template>

<style lang="scss">

</style>
