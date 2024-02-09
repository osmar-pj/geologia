
<script setup>
import Graf from "../components/Graf.vue";
import TableDash from "../components/TableDash.vue";
</script>
<template>
 <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Planta</h1>
        <span></span>
      </div>
      <span>| Dia terminado en Mina </span>
    </div>
    <div class="global-h-button">
    
    </div>
  </div>
  <div class="c-global-c-content">
    <Graf ruta="UCHUCCHACUA"/>
    <TableDash/>
  </div>
</template>
<style lang="scss">


</style>