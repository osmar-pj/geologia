<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import Success from "../components/Success.vue";
import { formatDate } from "../libs/utils";

const url = import.meta.env.VITE_API_URL;
const store = useStore();
const loading = ref(true);

onMounted(async () => {
  try {
    await store.dispatch("get_config");
  } finally {
    loading.value = false; // Oculta el loader una vez que los datos se han cargado
  }
});

const data = computed(() => store.state.config);
const buttonClicked = ref(false);
const showSuccessM = ref(false);
const updateConfig = async () => {
  try {
    buttonClicked.value = true;

    data.value.user = store.state.user.name;

    const response = await fetch(`${url}/config`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.value),
    });

    const result = await response.json();

    if (result.status === true) {
      console.log("Correcto");

      showSuccessM.value = true;
      setTimeout(() => {
        showSuccessM.value = false;
        buttonClicked.value = false;
      }, 2500);
      await store.dispatch("get_config");
    } else {
      console.log("error");
      buttonClicked.value = false;
    }
  } catch (error) {
    console.error("Error al actualizar:", error);
    buttonClicked.value = false;
  }
};
</script>

<template>
  <div
    class="container-setting"
    :style="{
      userSelect: buttonClicked ? 'none' : 'auto',
      pointerEvents: buttonClicked ? 'none' : 'auto',
    }"
  >
    <div class="c-setting-body" v-if="loading">
      <div>
        <span class="loader"></span>
        Procesando...
      </div>
    </div>
    <div class="c-setting-body" v-else>
      <div class="setting-item">
        <h2>Valores punto</h2>
        <div class="setting-i-input">
          <div class="s-i-content">
            <span>Plata - Ag</span>
            <p>
              El valor del punto de la plata (Ag) muestra su cambio de precio
              por unidad.
            </p>
          </div>
          <div class="s-i-config">
            <input type="number" v-model="data.vp_ag" />
          </div>
        </div>
        <div class="setting-i-input">
          <div class="s-i-content">
            <span>Plomo - Pb</span>
            <p>
              El valor del punto del Plomo (Pb) muestra su cambio de precio por
              unidad.
            </p>
          </div>
          <div class="s-i-config">
            <input type="number" v-model="data.vp_pb" />
          </div>
        </div>
        <div class="setting-i-input">
          <div class="s-i-content">
            <span>Zinc - Zn</span>
            <p>
              El valor del punto del Zinc (Zn) muestra su cambio de precio por
              unidad.
            </p>
          </div>
          <div class="s-i-config">
            <input type="number" v-model="data.vp_zn" />
          </div>
        </div>
      </div>
      <div class="setting-item">
        <h2>Unión de stock piles</h2>
        <div class="setting-i-input">
          <div class="s-i-content">
            <span>Tolerancia</span>
            <p>
              La tolerancia en la unión de stock piles adapta variaciones sin
              afectar la eficacia.
            </p>
          </div>
          <div class="s-i-config">
            <input type="number" v-model="data.tolerance" />
          </div>
        </div>
        <div class="setting-i-input">
          <div class="s-i-content">
            <span>Ley Similar</span>
            <p>
              La ley similar en la unión de stock piles adapta variaciones sin
              afectar la eficacia
            </p>
          </div>
          <div class="s-i-config">
            <label class="switch">
              <input type="checkbox" v-model="data.similarLey" />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="setting-i-input">
          <div class="s-i-content">
            <span>Dominio diferente</span>
            <p>
              El dominio en la unión de stock piles adapta variaciones sin
              afectar la eficacia
            </p>
          </div>
          <div class="s-i-config">
            <label class="switch">
              <input type="checkbox" v-model="data.similarDominio" />
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="setting-i-input">
          <div class="s-i-content">
            <span>Mina diferente</span>
            <p>
              La Mina diferente en la unión de stock piles adapta variaciones
              sin afectar la eficacia
            </p>
          </div>
          <div class="s-i-config">
            <label class="switch">
              <input type="checkbox" v-model="data.similarMining" />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
      <div class="setting-item">
        <h4>
          Última actualización:
          <strong>{{ formatDate(data.updatedAt) }} </strong>
        </h4>
        <h5>
          Hecho por: <strong>{{ data.user }}</strong>
        </h5>
      </div>
    </div>
    <div class="c-setting-footer">
      
      <button class="btn-success" type="submit" @click.prevent="updateConfig">
        <template v-if="buttonClicked">
          <span class="loader"></span>Procesando...
        </template>
        <template v-else> Guardar</template>
      </button>
    </div>
  </div>
  <Transition :duration="550" name="nested">
    <div class="modalCreate-backg" v-if="showSuccessM">
      <Transition name="bounce">
        <Success />
      </Transition>
    </div>
  </Transition>
</template>

<style lang="scss">

</style>
