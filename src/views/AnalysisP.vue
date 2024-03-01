<script setup>
import GrafCompliance from "../components/GrafCompliance.vue";
import Head from "../components/Head.vue";
</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Alimentación de Planta</h1>
      </div>
      <span>Hoy| Dia terminado en Mina </span>
    </div>
    <!-- <div class="global-h-button"><Head/></div> -->
  </div>
  <div class="c-global-c-analysis">
    <GrafCompliance stage="analysisOut" mining="YUMPAG"/>
    <GrafCompliance stage="analysisOut" mining="UCHUCCHACUA"/>
  </div>
     
</template>

<style lang="scss">
.global-h-button {
  display: flex;
  gap: 1rem;
}

.c-global-c-analysis {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1 1;
  .c-analysis-items {
    display: flex;
    flex: 1 1 300px;
    gap: 1rem;
  }
}
</style>
