<script setup>
import TableList from "../components/Table.vue";
import { ref, onMounted } from "vue"
import { useStore } from "vuex"
const store = useStore()
onMounted(async () => {
    await store.dispatch('get_list')
    data.value = store.state.dataList
})
const data = ref([
    { date: new Date(), driver: 'Juan', tag: 'BFC-567', vagones: 0, ton: 12, mineral: 'desmonte', tajo: 'Tajo', tipo: 'Tajo 500JC', tableta: null, status: 'revision' },
    { date: new Date(), driver: 'Juan', tag: 'LOC #42', vagones: 8, ton: 72, mineral: 'mineral', tajo: null, tipo: null, tableta: null, status: 'revision' },
    { date: new Date(), driver: 'Juan', tag: 'BFC-567', vagones: 0, ton: 12, mineral: 'desmonte', tajo: 'Avance', tipo: 'Avance', tableta: null, status: 'revision' },
    { date: new Date(), driver: 'Juan', tag: 'BFC-567', vagones: 0, ton: 12, mineral: 'desmonte', tajo: 'Tajo', tipo: 'Tajo 500JC', tableta: null },
    { date: new Date(), driver: 'Juan', tag: 'BFC-567', vagones: 0, ton: 12, mineral: 'desmonte', tajo: 'Tajo', tipo: 'Tajo 500JC', tableta: null },
    { date: new Date(), driver: 'Juan', tag: 'BFC-567', vagones: 0, ton: 12, mineral: 'desmonte', tajo: 'Tajo', tipo: 'Tajo 500JC', tableta: null },
    { date: new Date(), driver: 'Juan', tag: 'BFC-567', vagones: 0, ton: 12, mineral: 'desmonte', tajo: 'Tajo', tipo: 'Tajo 500JC', tableta: null },
    { date: new Date(), driver: 'Juan', tag: 'BFC-567', vagones: 0, ton: 12, mineral: 'desmonte', tajo: 'Tajo', tipo: 'Tajo 500JC', tableta: null },
])
</script>

<template>
    <TableList :showActionsColumn="true" title="Viajes recientes, por completar" :data="data"/>
</template>

<style lang="scss">

</style>
