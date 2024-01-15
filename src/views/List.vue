<script setup>
import TableList from "../components/Table.vue";
import { ref, onMounted } from "vue"
import { useStore } from "vuex"
const store = useStore()
const data = ref([])

onMounted(async () => {
    await store.dispatch('get_list')
    data.value = store.state.dataList.filter(item => item.status === 'Completo');
})

</script>

<template>
    <TableList :showActionsColumn="false" :data="data" :showColum="true" />
</template>

<style lang="scss">

</style>
