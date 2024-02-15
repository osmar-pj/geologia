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
.c-global-header {
  width: 100%;
  padding: 1.5rem 2.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  .global-h-title {
    span {
      color: var(--grey-1);
      font-size: clamp(6px, 8vw, 14px);
      line-height: 1.1rem;
      font-weight: 400;
    }
    .g-h-t-primary {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      span {
        color: var(--grey-2);
        font-size: clamp(6px, 8vw, 14px);
        font-weight: 600;
        line-height: 1.1rem;
        background-color: var(--grey-light-1);
        padding: 2px 5px;
        border-radius: 8px;
      }
    }
  }
  .global-h-button {
  }
  //   @include md {
  //     padding: 1.5rem 5rem;
  //   }
}

.c-global-c-analysis {
  display: flex;
  flex-direction: column;
  padding: 0 2.5rem;
  padding-bottom: 1rem;
  gap: 1rem;
  flex: 1 1;
  .c-analysis-items {
    display: flex;
    flex: 1 1 300px;    
    gap: 1rem;
  }
}
</style>
