<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import BindRuma from "../components/BindRuma.vue";
import DeactivateRuma from "../components/DeactivateRuma.vue";
import Bind from "../icons/Bind.vue";
import IRuma from "../icons/IRuma.vue";
import IOption from "../icons/IOption.vue";

const store = useStore();
const formattedDate = ref("");
const showBindRuma = ref(false);
const showDeactivateRuma = ref(false);

const openBindRuma = () => {
  showBindRuma.value = true;
};
const openDeactivateRuma = (ruma_Id) => {
  showDeactivateRuma.value = true;
  store.state.rumaIdToDeactivate = ruma_Id;
};

onMounted(async () => {
  const options = {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const today = new Date();

  const weekday =
    today
      .toLocaleDateString("es-ES", { weekday: "long" })
      .charAt(0)
      .toUpperCase() +
    today.toLocaleDateString("es-ES", { weekday: "long" }).slice(1);

  formattedDate.value = `${weekday}, ${today
    .toLocaleDateString("es-ES", options)
    .replace(/\//g, ".")}`;

  await store.dispatch("ruma_total");
});

const data = computed(() => {
  return store.state.rumaTotal;
})

const filteredDataMining1 = computed(() => {
  return data.value.filter((ruma) => ruma.ubication === "Cancha Colquicocha" && ruma.mining === "YUMPAG");
});
const filteredDataMining2 = computed(() => {
  return data.value.filter((ruma) => ruma.ubication === "Cancha Colquicocha" && ruma.mining === "UCHUCCHACUA");
});

const filteredDataCancha1 = computed(() => {
  return data.value.filter((ruma) => ruma.ubication === "Cancha 1");
});

const filteredDataCancha2 = computed(() => {
  return data.value.filter((ruma) => ruma.ubication === "Cancha 2");
});

const expanded = ref(false);

const toggleExpand = () => {
  expanded.value = !expanded.value;
};
</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Control de Rumas</h1>
        <span>{{ data ? data.length : 0 }}</span>
      </div>
      <span>{{ formattedDate }} | Dia terminado en Mina </span>
    </div>
    <div class="global-h-button">
      <button class="btn-unirRuma" @click="openBindRuma()">
        <Bind /> Unir Rumas
      </button>
    </div>
  </div>
  <div class="c-global-container">
    <div class="c-g-container-mining">
      <div class="container-mining-header">
        <span>Cancha Colcquicocha</span> <IOption />
      </div>
      <div class="container-mining-body body-mining-2">
        <div class="c-m-body-item">
          <div
            v-for="(ruma, index) in filteredDataMining1"
            :key="index"
            class="card-ruma"
          >
            <span class="c-ruma-status"> </span>
            <div
              class="c-ruma-body"
              :style="{
                backgroundColor:
                  ruma.mining === 'UCHUCCHACUA'
                    ? '#8CBEB249'
                    : ruma.mining === 'YUMPAG'
                    ? '#9FE5C249'
                    : '',
              }"
            >
              <div class="c-r-body-info">
                <IRuma />
                <div class="c-r-b-i-text">
                  <h5>
                    {{ ruma.mining }}
                  </h5>
                  <h3>COD-{{ ruma.cod_tableta }}</h3>
                  <span>
                    {{ ruma.ley_ag ? ruma.ley_ag.toFixed(2) : "0" }}
                  </span>
                </div>
              </div>
              <div class="c-r-body-items">
                <span
                  class="c-r-b-item"
                  v-for="(rumaId, rumaIndex) in ruma.tajo"
                  :key="rumaIndex"
                >
                  {{ rumaId }}
                </span>
              </div>
            </div>
            <div class="c-ruma-footer">
              <div class="c-r-footer-ton">
                <h3>{{ ruma.tonh }}/tm</h3>
                <span>
                  {{ ruma.dominio }}
                </span>
              </div>
              <div class="c-r-footer-btn">
                <button
                  @click="openDeactivateRuma(ruma.ruma_Id)"
                  :style="{
                    backgroundColor:
                      ruma.dominio === 'Polimetálico'
                        ? '#6666FF'
                        : ruma.dominio === 'Ag/Alabandita'
                        ? '#fb5663'
                        : '#FF9900',
                  }"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="c-m-body-item">
          <div
            v-for="(ruma, index) in filteredDataMining2"
            :key="index"
            class="card-ruma"
          >
            <span class="c-ruma-status"> </span>
            <div
              class="c-ruma-body"
              :style="{
                backgroundColor:
                  ruma.mining === 'UCHUCCHACUA'
                    ? '#8CBEB249'
                    : ruma.mining === 'YUMPAG'
                    ? '#9FE5C249'
                    : '',
              }"
            >
              <div class="c-r-body-info">
                <IRuma />
                <div class="c-r-b-i-text">
                  <h5>
                    {{ ruma.mining }}
                  </h5>
                  <h3>COD-{{ ruma.cod_tableta }}</h3>
                  <span>
                    {{ ruma.ley_ag ? ruma.ley_ag.toFixed(2) : "0" }}
                  </span>
                </div>
              </div>
              <div class="c-r-body-items">
                <span
                  class="c-r-b-item"
                  v-for="(rumaId, rumaIndex) in ruma.tajo"
                  :key="rumaIndex"
                >
                  {{ rumaId }}
                </span>
              </div>
            </div>
            <div class="c-ruma-footer">
              <div class="c-r-footer-ton">
                <h3>{{ ruma.tonh }}/tm</h3>
                <span>
                  {{ ruma.dominio }}
                </span>
              </div>
              <div class="c-r-footer-btn">
                <button
                  @click="openDeactivateRuma(ruma.ruma_Id)"
                  :style="{
                    backgroundColor:
                      ruma.dominio === 'Polimetálico'
                        ? '#6666FF'
                        : ruma.dominio === 'Ag/Alabandita'
                        ? '#fb5663'
                        : '#FF9900',
                  }"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer"></div>
    </div>
    <div class="c-g-container-mining">
      <div class="container-mining-header">
        <span>Cancha 2</span><IOption />
      </div>
      <div class="container-mining-body">
        <div
          v-for="(ruma, index) in filteredDataCancha2"
          :key="index"
          class="card-ruma"
        >
          <span class="c-ruma-status"> </span>
          <div
            class="c-ruma-body"
            :style="{
              backgroundColor:
                ruma.mining === 'UCHUCCHACUA'
                  ? '#8CBEB249'
                  : ruma.mining === 'YUMPAG'
                  ? '#9FE5C249'
                  : '',
            }"
          >
            <div class="c-r-body-info">
              <IRuma />
              <div class="c-r-b-i-text">
                <h5>
                  {{ ruma.mining }}
                </h5>
                <h3>COD-{{ ruma.cod_tableta }}</h3>
                <span> {{ ruma.ley_ag ? ruma.ley_ag.toFixed(2) : "0" }} </span>
              </div>
            </div>
            <div class="c-r-body-items">
              <span
                class="c-r-b-item"
                v-for="(rumaId, rumaIndex) in ruma.tajo"
                :key="rumaIndex"
              >
                {{ rumaId }}
              </span>
            </div>
          </div>
          <div class="c-ruma-footer">
            <div class="c-r-footer-ton">
              <h3>{{ ruma.tonh }}/tm</h3>
              <span>
                {{ ruma.dominio }}
              </span>
            </div>
            <div class="c-r-footer-btn">
              <button
                @click="openDeactivateRuma(ruma.ruma_Id)"
                :style="{
                  backgroundColor:
                    ruma.dominio === 'Polimetálico'
                      ? '#6666FF'
                      : ruma.dominio === 'Ag/Alabandita'
                      ? '#fb5663'
                      : '#FF9900',
                }"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="c-g-container-mining">
      <div class="container-mining-header">
        <span>Cancha 1</span><IOption />
      </div>
      <div class="container-mining-body">
        <div
          v-for="(ruma, index) in filteredDataCancha1"
          :key="index"
          class="card-ruma"
        >
          <span class="c-ruma-status"> </span>
          <div
            class="c-ruma-body"
            :style="{
              backgroundColor:
                ruma.mining === 'UCHUCCHACUA'
                  ? '#8CBEB249'
                  : ruma.mining === 'YUMPAG'
                  ? '#9FE5C249'
                  : '',
            }"
          >
            <div class="c-r-body-info">
              <IRuma />
              <div class="c-r-b-i-text">
                <h5>
                  {{ ruma.mining }}
                </h5>
                <h3>COD-{{ ruma.cod_tableta }}</h3>
                <span> {{ ruma.ley_ag ? ruma.ley_ag.toFixed(2) : "0" }} </span>
              </div>
            </div>
            <div
              class="c-r-body-items"
              :style="{ height: expanded ? 'auto' : '40px' }"
            >
              <span
                class="c-r-b-item"
                v-for="(rumaId, rumaIndex) in ruma.tajo"
                :key="rumaIndex"
              >
                {{ rumaId }}
              </span>
            </div>
            <span class="btn-more-items" @click="toggleExpand">Ver mas...</span>
          </div>
          <div class="c-ruma-footer">
            <div class="c-r-footer-ton">
              <h3>{{ ruma.tonh }}/tm</h3>
              <span>
                {{ ruma.dominio }}
              </span>
            </div>
            <div class="c-r-footer-btn">
              <button
                @click="openDeactivateRuma(ruma.ruma_Id)"
                :style="{
                  backgroundColor:
                    ruma.dominio === 'Polimetálico'
                      ? '#6666FF'
                      : ruma.dominio === 'Ag/Alabandita'
                      ? '#fb5663'
                      : '#FF9900',
                }"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Transition :duration="550" name="nested">
    <BindRuma v-if="showBindRuma" @cerrarModal="showBindRuma = false" />
  </Transition>
  <Transition :duration="550" name="nested">
    <DeactivateRuma
      v-if="showDeactivateRuma"
      @cerrarModal="showDeactivateRuma = false"
      :rumaIdToDeactivate="store.state.rumaIdToDeactivate"
    />
  </Transition>
</template>

<style lang="scss">
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

.c-global-container {
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  gap: 0.5rem;
  padding: 0 2.5rem 1.5rem 2.5rem;
  padding-bottom: 1rem;
  overflow: auto;
  flex: 1 1;
  .c-g-container-mining {
    background-color: var(--white);
    border: 1px solid var(--grey-light-22);
    border-radius: var(--br-xxl);
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: auto;
    flex-grow: 1;
    overflow-y: auto;
    .container-mining-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--grey-light-2);
      padding-bottom: 0.5rem;

      span {
        color: var(--grey-2);
        font-size: clamp(6px, 8vw, 14px);
        font-weight: 500;
        line-height: 0.8rem;
        position: relative;
        padding-left: 15px;
        &::before {
          content: "";
          background-color: var(--black);
          width: 7px;
          height: 7px;
          position: absolute;
          top: 50%;
          left: 0px;
          transform: translateY(-50%);
          border-radius: 50%;
          background-color: var(--primary);
        }
      }
      svg {
        fill: var(--grey-light-2);
        color: var(--grey-light-2);
        width: 1.5rem;
        height: 1.5rem;
        stroke-width: 1.5;
      }
    }
    .container-mining-body {
      width: 100%;
      flex: 1 1;
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      padding: 1rem 1rem 1rem 0;
    }
  }
}

.body-mining-2 {
  overflow: hidden !important;
  padding: 0 !important;
}

.c-m-body-item {
  width: 100%;
  height: 50%;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: .8rem;
  border: 1px solid var(--grey-light-22);
  border-radius: var(--br-xxl);
}

.btn-more-items{
  font-size: clamp(5px, 8vw, 10px);
    line-height: 0.6rem;
    font-weight: 500;
    color: var(--grey-1);
    text-align: left;
    width: 100%;
    padding-top: .5rem;
}
.btns {
  display: flex;
  gap: 1rem;
  button {
    padding: 0;
    width: auto;
    display: grid;
    place-items: center;
    background-color: var(--white);
    padding: 8px 14px;
    border-radius: 10px;
    color: var(--primary);
    border: 1px solid var(--primary);
    font-weight: 500;
    img {
      width: 1rem;
    }
    &:hover {
      background-color: var(--primary);
      color: var(--white);
    }
  }
}

.btn-unirRuma {
  background-color: var(--primary);
  color: var(--white);
  font-weight: 500;
  min-width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  &:hover {
    background-color: var(--secondary);
  }
}
.expanded {
  max-height: none; /* Establece la altura máxima a "ninguna" al expandirse */
  transition: max-height 0.3s ease; /* Agrega una transición suave al expandirse */
}

.card-ruma {
  flex: 1 1 200px;
  border-radius: 12px;
  background-color: var(--white);
  padding: 3px;
  
  border: 1px solid var(--grey-light-22);
  cursor: pointer;
  transition: all 0.3s ease-out;
  display: flex;
  flex-direction: column;
  position: relative;
  .c-ruma-status {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 2px 8px;
    font-size: clamp(7px, 8vw, 11px);
    line-height: 0.6rem;
    font-weight: 600;
    color: var(--primary);
    border: 1px solid var(--primary);
    border-radius: 8px;
  }

  .c-ruma-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 1rem .5rem 1rem;
    flex: 1 1;
    background-color: #c5e0b449;
    border-radius: 12px;
    .c-r-body-info {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 1rem;
      svg {
        width: 2rem;
        height: 2rem;
        stroke-width: 1.2;
        fill: transparent;
      }
      .c-r-b-i-text {
        flex: 1 1 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        h5 {
          font-weight: 500;
          line-height: 0.8rem;
          font-size: clamp(7px, 8vw, 11px);
        }
        h3 {
          font-weight: 600;
          font-size: clamp(7px, 8vw, 18px);
          padding: 2px 0 6px 0;
        }
        span {
          font-size: clamp(7px, 8vw, 12px);
          font-weight: 600;
          color: var(--red);
          line-height: 0.6rem;
          background-color: #FEE2E2;
          border-radius: 8px;
           padding: 4px 8px;
          width: auto;
        }
      }
    }
    .c-r-body-items {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: 0.3rem;
      padding: 1rem 0 0 0;

      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: height 0.3s ease;

      .c-r-b-item {
        font-size: clamp(7px, 8vw, 10px);
        line-height: 0.6rem;
        color: var(--black);
        border: 1px solid var(--grey-light-2);
        border-radius: 15px;
        padding: 6px 12px;
      }
    }
  }
  .c-ruma-footer {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    justify-content: space-between;
    .c-r-footer-ton {
      display: flex;
      flex-direction: column;

      span {
        font-size: clamp(7px, 8vw, 10px);
        font-weight: normal;
        color: var(--grey-2);
      }
      h3 {
        font-weight: 600;
        font-size: clamp(7px, 8vw, 15px);
      }
    }
    .c-r-footer-btn {
      button {
        background-color: var(--primary);
        color: var(--white);
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 30px;
        padding: 0 10px;
        font-size: clamp(7px, 8vw, 12px);
      }
    }
  }

  &:hover {
    z-index: 99;
    border: 1px solid var(--primary);
  }
}
</style>

<!-- <div v-for="(ruma, index) in dataRuma" :key="index" class="card-ruma">
  <div class="c-ruma-body">
   <IRuma/>
    <h3>{{ ruma.ruma_Id }}</h3>
    <span>
      <strong>{{
        ruma.rumas_united ? ruma.rumas_united.length : 0
      }}</strong>
      rumas unidas</span
    >
    <div class="c-r-body-items">
      <span
        class="c-r-b-item"
        v-for="(rumaId, rumaIndex) in ruma.rumas_united"
        :key="rumaIndex"
      >
        {{ rumaId }} /
      </span>
    </div>
    <div class="c-r-body-info">
      <div class="c-r-body-i-item">
        <span class="ton-total">{{
          ruma.tonh ? ruma.tonh.toFixed(1) : 0
        }}</span>
        <p>TMH</p>
      </div>
      <div class="c-r-body-i-item">
        <span class="ton-total">{{ ruma.travels || "0" }}</span>
        <p>viajes</p>
      </div>
      <div class="c-r-body-i-item">
        <button @click="openDeactivateRuma(ruma.ruma_Id)">Proceso</button>
      </div>
    </div>
  </div>
</div> -->
