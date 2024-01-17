<script setup>
import TableList from "../components/Table.vue";
import { ref, onMounted } from "vue"
import { useStore } from "vuex"
const store = useStore()
const data = ref([])

onMounted(async () => {
    await store.dispatch('get_listGeneral')
    data.value = store.state.dataListGeneral;
})

</script>

<template>
    <TableList :showActionsColumn="false" :data="data" :showColum="true" />
</template>

<style lang="scss">

</style>
