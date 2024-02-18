<script setup></script>

<template>
  <div class="map-info">
    <h2>Información detalla</h2>
    <p>30toneladas</p>
  </div>
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
  h2 {
    color: var(--white);
  }
  p {
    color: var(--white);
  }
}
</style>
