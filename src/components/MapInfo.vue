<script setup>
import { ref, onMounted, computed, defineProps } from "vue";
// define props data
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
console.log(props.data);
const pilas = ref(null)
pilas.value = props.data
const isSelectedOnePila = ref(false)
isSelectedOnePila.value = pilas.value.length === 1
const isSelectedMoreThanOnePila = ref(false)
isSelectedMoreThanOnePila.value = pilas.value.length > 1
</script>

<template>
  <div class="map-info">
    <h2>Información detalla</h2>
    <p>30toneladas</p>
    <p v-if="isSelectedOnePila">
      <span> SOLO INFO DE LA PILA </span>
      {{ pilas }}
    </p>
    <p v-if="isSelectedMoreThanOnePila">
      <span> CALCULATE LEY PONDERADA, TON TOTAL y NSR </span>
      {{ pilas }}
    </p>
  </div>
  <transition></transition>
</template>

<style lang="scss">
.map-info {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 300px;
  gap: 0.3rem;
  padding: 2rem;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.02);
  overflow: auto;
  h2 {
    color: var(--white);
  }
  p {
    color: var(--white);
  }
}
</style>
