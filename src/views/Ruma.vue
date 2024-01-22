<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import BindRuma from "../components/BindRuma.vue";
import DeactivateRuma from "../components/DeactivateRuma.vue";
import Bind from "../icons/Bind.vue";
import IRuma from "../icons/IRuma.vue";

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

const dataRuma = computed(() => {
  return store.state.rumaTotal;
});
</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Control de Rumas</h1>
        <span>{{ dataRuma.length }}</span>
      </div>
      <span>{{ formattedDate }} | Dia terminado en Mina </span>
    </div>
    <div class="global-h-button">
      <button class="btn-unirRuma" @click="openBindRuma()">
        <Bind /> Unir Rumas
      </button>
    </div>
  </div>
  <div class="c-global-c-rumas">
    <div v-for="(ruma, index) in dataRuma" :key="index" class="card-ruma">
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

.c-global-c-rumas {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1.5rem 2.5rem;
  padding-bottom: 1rem;
  overflow: auto;
  .card-ruma {
    border-radius: 12px;
    background-color: var(--white);
    padding: 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--white);
    cursor: pointer;
    transition: all 0.3s ease-out;
    display: flex;
    flex-direction: column;
    .c-ruma-header {
      padding: 0.5rem 1.5rem 0.5rem 1.5rem;
      font-size: clamp(7px, 8vw, 12px);
      color: var(--grey-2);
      text-align: right;
    }

    .c-ruma-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem 1.5rem 1.5rem 1.5rem;
      flex: 1 1;
      svg {
        width: 2rem;
        height: 2rem;
        stroke-width: 1.5;
        fill: transparent;
      }
      h3 {
        font-weight: 600;
        font-size: clamp(7px, 8vw, 16px);
        padding: 0.5rem 0 0 0;
      }
      span {
        font-size: clamp(7px, 8vw, 11px);
        font-weight: 500;
        color: var(--grey-2);
      }
      .c-r-body-items {
        margin: 1rem 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        background-color: var(--grey-light-1);
        border-radius: 15px;
        padding: 3px 10px;
        .c-r-b-item {
          font-size: clamp(7px, 8vw, 12px);
          color: var(--grey-2);
        }
      }
      .c-r-body-info {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border-top: 1px solid var(--grey-light-2);
        padding-top: 1rem;
        .c-r-body-i-item {
          flex: 1 1 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .ton-total {
            font-size: clamp(7px, 8vw, 16px);
            font-weight: 600;
            letter-spacing: -0.03rem;
            color: var(--black);
            line-height: 1rem;
          }
          p {
            font-size: clamp(7px, 8vw, 11px);
            font-weight: normal;
            color: var(--grey-2);
          }
          button {
            transition: all 0.35s ease-out;
            background-color: var(--primary);
            height: 40px;
            padding: 0;
          }
        }
      }
    }

    &:hover {
      border: 1px solid var(--primary);
    }
  }
}
//   @include md {
//     gap: 1.5rem;
//     padding: 1.5rem 5rem;
//   }

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
</style>
