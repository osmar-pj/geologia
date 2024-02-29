<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import Success from "../components/Success.vue";

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
    console.log();

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
.container-setting {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  width: 100%;
  flex: 1 1;
  .c-setting-body {
    display: flex;
    flex-direction: column;
    // justify-content: center;
    // align-items: center;
    gap: 2.5rem;
    flex: 1 1;
    overflow: auto;
    .setting-item {
      // max-width: 1000px;
      display: flex;
      flex-direction: column;
      h2 {
        padding-bottom: 0.5rem;
      }

      .setting-i-input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        border: 1px solid var(--grey-light-22);
        padding: 1rem 2rem;
        border-radius: 8px;
        background-color: var(--white);
        .s-i-content {
          span {
            font-size: clamp(7.5px, 8vw, 13.5px);
            line-height: 1rem;
            font-weight: 500;
          }
          p {
            padding-top: 0.1rem;
            font-size: clamp(7.5px, 8vw, 12.5px);
            line-height: 1rem;
            color: var(--grey-2);
          }
        }
        .s-i-config {
          display: flex;
          justify-content: center;
          width: 100px;
          input {
            height: 35px;
            padding: 0 10px;
            text-align: center;
          }
        }
      }
    }
  }
  .c-setting-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    button {
      width: 150px;
    }
  }
}
.switch {
  --button-width: 40px;
  --button-height: 25px;
  --toggle-diameter: 18px;
  --button-toggle-offset: calc(
    (var(--button-height) - var(--toggle-diameter)) / 2
  );
  --toggle-shadow-offset: 10px;
  --toggle-wider: 3em;
  --color-grey: #cccccc;
}

.slider {
  display: inline-block;
  width: var(--button-width);
  height: var(--button-height);
  background-color: var(--color-grey);
  border-radius: calc(var(--button-height) / 2);
  position: relative;
  transition: 0.3s all ease-in-out;
  cursor: pointer;
}

.slider::after {
  content: "";
  display: inline-block;
  width: var(--toggle-diameter);
  height: var(--toggle-diameter);
  background-color: var(--white);
  border-radius: calc(var(--toggle-diameter) / 2);
  position: absolute;
  top: var(--button-toggle-offset);
  transform: translateX(var(--button-toggle-offset));
  box-shadow: var(--toggle-shadow-offset) 0
    calc(var(--toggle-shadow-offset) * 4) rgba(0, 0, 0, 0.1);
  transition: 0.3s all ease-in-out;
}

.switch input[type="checkbox"]:checked + .slider {
  background-color: var(--primary);
}

.switch input[type="checkbox"]:checked + .slider::after {
  transform: translateX(
    calc(
      var(--button-width) - var(--toggle-diameter) - var(--button-toggle-offset)
    )
  );
  box-shadow: calc(var(--toggle-shadow-offset) * -1) 0
    calc(var(--toggle-shadow-offset) * 4) rgba(0, 0, 0, 0.1);
}

.switch input[type="checkbox"] {
  display: none;
}

.switch input[type="checkbox"]:active + .slider::after {
  width: var(--toggle-wider);
}

.switch input[type="checkbox"]:checked:active + .slider::after {
  transform: translateX(
    calc(
      var(--button-width) - var(--toggle-wider) - var(--button-toggle-offset)
    )
  );
}
</style>
