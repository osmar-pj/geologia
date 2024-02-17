<script setup>
import Graf from "../components/Graf.vue";
</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Cumplimiento de Producción</h1>
      </div>
      <span>Hoy| Dia terminado en Mina </span>
    </div>
    <div class="global-h-button"></div>
  </div>
  <div class="c-global-c-analysis">
    <div class="c-analysis-items">
      <Graf ruta="YUMPAG" />
      <Graf ruta="UCHUCCHACUA" />
    </div>
    <div class="c-analysis-items">
      <Graf ruta="YUMPAG" />
      <Graf ruta="UCHUCCHACUA" />
    </div>
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
