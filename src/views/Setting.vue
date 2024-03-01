<script setup>
import { useStore } from "vuex";
import ConfigGeneral from "../components/ConfigGeneral.vue";
import ConfigPlanta from "../components/ConfigPlanta.vue";
import ConfigCancha from "../components/ConfigCancha.vue";
import ConfigTajo from "../components/ConfigTajo.vue";

const store = useStore();
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
    <div class="c-setting-header">
      <div class="c-s-header-content">
        <div class="h-c-avatar">
          <img src="../assets/img/avatar.gif" alt="" />
        </div>
        <div class="h-c-info">
          <h2>{{store.state.user.name}} / General</h2>
          <h5>
            Configure sus preferencias y necesidades para la aplicación
          </h5>
        </div>
      </div>
    </div>
    <TabView>
      <TabPanel header="General">
        <ConfigGeneral />
      </TabPanel>
      <!-- <TabPanel header="Editar Perfil">
        <p class="m-0">Sed ut perspiciatis</p>
      </TabPanel> -->
      <TabPanel header="Programación Cancha">
        <ConfigCancha />
      </TabPanel>
      <TabPanel header="Programación Planta">
        <ConfigPlanta />
      </TabPanel>
      <TabPanel header="Tajo">
        <ConfigTajo />
      </TabPanel>
    </TabView>
  </div>
</template>

<style lang="scss">
.c-setting-header {
  display: grid;
  place-items: center;

  height: 50px;
  .c-s-header-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    p {
      color: var(--grey-2);
    }
    .h-c-avatar{
      img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
    .h-c-info{
      h5{
        padding-top: .25rem;
        color: var(--grey-light-3);
      }
    }
  }
}
</style>
