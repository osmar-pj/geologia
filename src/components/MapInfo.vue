<script setup>
import { ref, defineProps, watch } from "vue";
import { calculus } from "../libs/utils";

// Define props data
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

// Inicializar las variables reactivas
const pilas = ref(props.data.flatMap((item) => item.pila));
const isSelectedOnePila = ref(pilas.value.length === 1);
const isSelectedMoreThanOnePila = ref(pilas.value.length > 1);

// Observar cambios en props.data y actualizar las variables reactivas
watch(
  () => props.data,
  (newValue) => {
    pilas.value = newValue.flatMap((item) => item.pila);
    isSelectedOnePila.value = pilas.value.length === 1;
    isSelectedMoreThanOnePila.value = pilas.value.length > 1;
  }
);

const vp_ag = ref(13)
const vp_pb = ref(14.69)
const vp_zn = ref(13.76)

</script>

<template>
  <!-- <h2>Información detalla</h2>
    <p>30toneladas</p>
    <div v-if="isSelectedOnePila">
      <span> SOLO INFO DE LA PILA </span>
     <div>
      {{ pilas.pila }}
     </div>
      
    </div>
    <div v-if="isSelectedMoreThanOnePila">
      <span> CALCULATE LEY PONDERADA, TON TOTAL y NSR </span>
      {{ pilas }}
    </div> -->

  <div class="map-info">
    <span class="m-i-text-select">{{ pilas.length }} </span>
    <div class="m-i-content">
      <div class="m-i-container" v-for="pila in pilas" :key="pila._id">
        <div class="i-c-header">
          <div class="c-h-item">
            <h2>{{ pila.cod_tableta }}</h2>
            <h5>{{ pila.ubication }}</h5>
          </div>
          <div class="c-h-item">
            <h2>{{ pila.tonh }} TH</h2>
            <h5>{{ pila.travels.length }} v</h5>
          </div>
        </div>

        <div class="i-c-body">
          <div class="b-other">
            <div class="b-o-item">
              <span>Tajo</span>
              <h5 v-for="tajo in pila.tajo" :key="tajo">{{ tajo }}</h5>
            </div>
            <div class="b-o-item">
              <span>Dominio</span>
              <h5 v-for="dominio in pila.dominio" :key="dominio">
                {{ dominio }}
              </h5>
            </div>
          </div>

          <div class="b-mineral">
            <div class="b-m-item">
              <span
                :style="{
                  color: ((value) =>
                    value < 3
                      ? '#00B050'
                      : value >= 3 && value < 10
                      ? '#FF9900'
                      : '#FF0000')(pila.ley_ag),
                }"
              >
                {{ pila.ley_ag ? pila.ley_ag.toFixed(2) : '' }}
              </span>
              <h5>Ag</h5>
            </div>
            <div class="b-m-item">
              <span :style="{
                  color: ((value) =>
                    value < 3
                      ? '#00B050'
                      : value >= 3 && value < 10
                      ? '#FF9900'
                      : '#FF0000')(pila.ley_fe),
                }"> {{ pila.ley_fe ? pila.ley_fe.toFixed(2) : '' }} </span>
              <h5>Fe</h5>
            </div>
            <div class="b-m-item">
              <span :style="{
                  color: ((value) =>
                    value < 3
                      ? '#00B050'
                      : value >= 3 && value < 10
                      ? '#FF9900'
                      : '#FF0000')(pila.ley_mn),
                }"> {{ pila.ley_mn ? pila.ley_mn.toFixed(2) : '' }} </span>
              <h5>Mn</h5>
            </div>
            <div class="b-m-item">
              <span :style="{
                  color: ((value) =>
                    value < 3
                      ? '#00B050'
                      : value >= 3 && value < 10
                      ? '#FF9900'
                      : '#FF0000')(pila.ley_pb),
                }"> {{ pila.ley_pb ? pila.ley_pb.toFixed(2) : '' }} </span>
              <h5>Pb</h5>
            </div>
            <div class="b-m-item">
              <span :style="{
                  color: ((value) =>
                    value < 3
                      ? '#00B050'
                      : value >= 3 && value < 10
                      ? '#FF9900'
                      : '#FF0000')(pila.ley_zn),
                }"> {{ pila.ley_zn ? pila.ley_zn.toFixed(2) : '' }} </span>
              <h5>Zn</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="m-i-result">
      <!-- <div class="i-r-item">
        <span> 5 </span>
        <h5>Viajes</h5>
      </div> -->
      <div class="i-r-item">
        <span> {{ calculus(pilas, vp_ag, vp_pb, vp_zn).stock }} </span>
        <h5>TMH</h5>
      </div>
      <div class="i-r-item">
        <span> {{ calculus(pilas, vp_ag, vp_pb, vp_zn).nsr }} </span>
        <h5>NSR</h5>
      </div>
      <div class="i-r-item">
        <span> {{ calculus(pilas, vp_ag, vp_pb, vp_zn).ag_eq }} </span>
        <h5>Ag_Eq</h5>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.map-info {
  position: absolute;
  bottom:20px;
  right: 20px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 380px;
  gap: 0.3rem;

  border-radius: 15px;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.02);

  h2 {
    color: var(--white);
  }
  p {
    color: var(--white);
  }
  .m-i-text-select {
    position: absolute;
    right: -5px;
    top: -5px;
    font-size: clamp(2px, 2vw, 9px);
    line-height: 1rem;
    color: var(--white);
    font-weight: normal;
    background-color: rgba(0, 0, 0, 0.8);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: grid;
    place-items: center;
  }
  .m-i-content {
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    flex: 1 1;
    .m-i-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      background-color: rgba(0, 0, 0, 0.75);
      padding: 1rem;
      border-radius: 10px;
      .i-c-header {
        display: flex;
        justify-content: space-between;
        .c-h-item {
          display: flex;
          flex-direction: column;
          span {
            color: var(--white);
            font-size: clamp(2px, 5vw, 14px);
          }
          h5 {
            color: var(--grey-light-3);
            font-size: clamp(2px, 2vw, 9px);
            line-height: 0.6rem;
            padding-top: 0.2rem;
          }
          &:nth-child(2) {
            align-items: flex-end;
          }
        }
      }
    }
    .i-c-body {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      .b-other {
        display: flex;
        justify-content: space-between;
        .b-o-item {
          display: flex;
          flex-direction: column;
          span {
            color: var(--white);
            font-size: clamp(2px, 5vw, 12.5px);
          }
          h5 {
            color: var(--grey-light-3);
            font-size: clamp(2px, 2vw, 9px);
            line-height: 0.6rem;
            padding-top: 0.2rem;
          }
        }
      }
      .b-mineral {
        display: flex;
        justify-content: space-around;
        background-color: rgba(255, 255, 255, 0.15);
        padding: 0.5rem;
        border-radius: 8px;
        .b-m-item {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          position: relative;

          span {
            color: var(--white);
            font-size: clamp(2px, 5vw, 12.5px);
          }
          h5 {
            color: var(--grey-light-3);
            font-size: clamp(2px, 2vw, 9px);
            line-height: 0.6rem;
            padding-top: 0.2rem;
          }
        }
        .b-m-item:not(:last-child)::after {
          position: absolute;
          content: "";
          width: 1px;
          height: 100%;
          background-color: var(--grey-2);
          opacity: 0.4;
          right: -10px;
        }
      }
    }
  }
  .m-i-result {
    background-color: rgba(0, 0, 0, 0.75);
    padding: 0.8rem 1.5rem;
    display: flex;
    justify-content: space-around;
    border-radius: 0 0 15px 15px;
    .i-r-item {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      span {
        color: var(--white);
        font-size: clamp(2px, 5vw, 14px);
        font-weight: 450;
      }
      h5 {
        color: var(--grey-light-3);
        font-size: clamp(2px, 2vw, 9px);
        line-height: 0.6rem;
        padding-top: 0.2rem;
      }
    }
  }
}
</style>
