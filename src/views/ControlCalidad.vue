<script setup>
import TableList from "../components/Table.vue";
import { ref, onMounted, computed, inject} from "vue"
import { useStore } from "vuex"
const store = useStore()
const socket = inject("socket")
socket.on('ControlCalidad', (data) => {
    store.commit('addDataListControlCalidad', data)
    const lastIndex = store.state.dataListControl.length - 1;

    store.commit('lesstDataListControlCalidad', lastIndex);
})
onMounted(async () => {
    await store.dispatch('get_listControl')
})

const data = computed(() => {
    return store.state.dataListControl
})

</script>

<template>
    <TableList :showActionsColumn="true" title="Viajes, Control de calidad" :data="data" :showColum="false" :showItem="false"/>
</template>

<style lang="scss">

</style>
