<script setup>
import TableList from "../components/Table.vue";
import { ref, onMounted, computed, inject } from "vue"
import { useStore } from "vuex"
const store = useStore()
const socket = inject("socket")
socket.on('OreControl', (data) => {
    store.commit('addDataListOreControl', data)
    
})
onMounted(async () => {
    await store.dispatch('get_list')
})

const data = computed(() => {
    return store.state.dataList
})

</script>

<template>
    <TableList :showActionsColumn="true" title="Viajes, Ore Control" :data="data" :showColum="false" :showItem="true" />
</template>

<style lang="scss">

</style>
