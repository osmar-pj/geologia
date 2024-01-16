<script setup>
import TableList from "../components/Table.vue";
import { ref, onMounted } from "vue"
import { useStore } from "vuex"
const store = useStore()
const data = ref([])

onMounted(async () => {
    await store.dispatch('get_list')
    data.value = store.state.dataList.filter(item => item.statusGeology === 'OreControl');
})
</script>

<template>
    <TableList :showActionsColumn="true" title="Viajes recientes, por completar" :data="data" :showColum="false" :showItem="false" />
</template>

<style lang="scss">

</style>
