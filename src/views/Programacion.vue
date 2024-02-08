<script setup>
import TableList from "../components/Table.vue";
import { ref, onMounted } from "vue"
import { useStore } from "vuex"
const store = useStore()
const data = ref([])

onMounted(async () => {
    await store.dispatch('get_list')
    data.value = store.state.dataList.filter(item => item.status === 'Programado');
})
</script>

<template>
    <TableList :showActionsColumn="false" title="Viajes culminados, revisar" :data="data"/>
</template>

<style lang="scss">

</style>
