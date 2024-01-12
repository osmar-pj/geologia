<script setup>
import TableList from "../components/Table.vue";
import { ref, onMounted } from "vue"
import { useStore } from "vuex"
const store = useStore()
onMounted(async () => {
    await store.dispatch('get_list')
    data.value = store.state.dataList
})
const data = ref([])

</script>

<template>
    <TableList :showActionsColumn="false" :data="data"/>
</template>

<style lang="scss">

</style>
