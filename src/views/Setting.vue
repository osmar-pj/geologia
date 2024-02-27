<script setup>
import ConfigGeneral from "../components/ConfigGeneral.vue";
import ConfigPlanta from "../components/ConfigPlanta.vue";
</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Configuración</h1>
      </div>
      <span>| Hoy terminado en Mina </span>
    </div>
    <div class="global-h-button"></div>
  </div>

  <div class="c-global-c-content">
    <div class="c-setting-header">a</div>
    <TabView>
      <TabPanel header="General">
        <ConfigGeneral />
      </TabPanel>
      <TabPanel header="Editar Perfil">
        <p class="m-0">Sed ut perspiciatis</p>
      </TabPanel>
      <TabPanel header="Data Planta">
        <ConfigPlanta />
      </TabPanel>     
    </TabView>
  </div>
</template>

<style lang="scss">
  .c-setting-header {
    p {
      color: var(--grey-2);
    }
  }

</style>
