<script setup>
import TableList from "../components/Table.vue";
import { ref, onMounted, computed} from "vue"
import { useStore } from "vuex"
const store = useStore()

onMounted(async () => {
    await store.dispatch('get_listControl')
    console.log(store.state.dataListControl)
})

const data = computed(() => {
    return store.state.dataListControl
})

</script>

<template>
    <TableList :showActionsColumn="true" title="Viajes recientes, por completar" :data="data" :showColum="false" :showItem="false"/>
</template>

<style lang="scss">

</style>
