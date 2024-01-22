<script setup>
import TableList from "../components/Table.vue";
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
const store = useStore()

onMounted(async () => {
    await store.dispatch('get_listGeneral')
   
})
const data = computed(() => {
    return store.state.dataListGeneral
})
</script>

<template>
    <TableList :showActionsColumn="false" :data="data" :showColum="true" />
    
</template>

<style lang="scss">

</style>
