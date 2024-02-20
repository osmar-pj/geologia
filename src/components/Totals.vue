<script setup>
import IPlus from "../icons/IPlus.vue";
import { onMounted, ref, computed} from "vue"
import { useStore } from "vuex"
import IPila from "../prueba/IPila.vue";
const store = useStore()

onMounted(async () => {
  // await store.dispatch("getWeights")
  await store.dispatch("get_list")
})

// const totalWeights = computed(() => store.state.weights)
const oreControl = computed(() => store.state.dataList)


</script>

<template>
  <div class="Container-totals">
    <div class="H-left-totals">
      <div class="Item-w-total">
      <IPila/>
        <h5 class="w-w-title">Total de Stock</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon"> <img src="../assets/img/i-total1.svg" alt=""></div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <!-- <h1> {{ (totalWeights.stock.total).toFixed(2) }} </h1> -->
              <h1> 488.82 </h1>
              <small>TMH</small>
            </div>
          </div>
        </div>
        <div class="w-w-calc">
          <!-- <h5>de un total de 13 pilas</h5> -->
        </div>
      </div>
      <div class="Item-w-total">
        <h5 class="w-w-title">Total Mineral Ingresado Dia</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon"> <img src="../assets/img/i-total1.svg" alt=""></div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <!-- <h1> {{ totalWeights.ton.toFixed(2) }} </h1> -->
              <h1> 463.44 </h1>
              <small>TMH</small>
            </div>
          </div>
        </div>
        <div class="w-w-calc">
          <!-- <h5>+ 3 leyes nuevas</h5> -->
        </div>
      </div>
      <div class="Item-w-total">
        <h5 class="w-w-title">Total Mineral Enviado a Planta</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon"> <img src="../assets/img/i-total1.svg" alt=""></div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <h1>254.56</h1>
              <small>TMH</small>
            </div>
          </div>
        </div>
        <div class="w-w-calc">
          <h5>+ 4 leyes nuevas</h5>
        </div>
      </div>
    </div>
    <div class="H-right-totals">
      <div class="Item-w-total">
        <h5 class="w-w-title">Ore Control</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon">
            <img src="../assets/img/i-total3.svg" alt="">
          </div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <h1>1</h1>
              <small>pila</small>
              <!-- <h1> {{ oreControl.data.length }} </h1> -->
              <!-- <small> {{ oreControl.data.length > 1 ? 'pilas' : 'pila' }} </small> -->
            </div>
          </div>
        </div>
        <div class="w-w-calc">
          <div class="calc-item">
            <span class="t-porcent t-min"> proc/ 55% </span>
          </div>
          <div class="calc-item">
            <div class="t-icon"></div>
            <span class="t-porcent t-max"> x proc/ 45% </span>
          </div>
        </div>
      </div>
      <div class="Item-w-total">
        <h5 class="w-w-title">Analisis</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon"> <img src="../assets/img/i-total2.svg" alt=""></div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <h1>5</h1>
              <small>pilas</small>
            </div>
          </div>
        </div>
        <div class="w-w-calc">
          <div class="calc-item">
            <span class="t-porcent t-min"> proc/ 55% </span>
          </div>
          <div class="calc-item">
            <div class="t-icon"></div>
            <span class="t-porcent t-max"> x proc/ 45% </span>
          </div>
        </div>
      </div>
      <div class="Item-w-total">
        <h5 class="w-w-title">Abastecimiento</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon"> <img src="../assets/img/i-total3.svg" alt=""></div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <h1>3</h1>
              <small>pilas</small>
            </div>
          </div>
        </div>
        <div class="w-w-calc">
          <div class="calc-item">
            <span class="t-porcent t-min"> proc/ 60% </span>
          </div>
          <div class="calc-item">
            <div class="t-icon"></div>
            <span class="t-porcent t-max"> x proc/ 40% </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "../mixins.scss";
.Container-totals {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 1rem;
  gap: 1rem;
  .H-left-totals {
    flex: 1 1 200px;
    width: 100%;
    display: flex;
    gap: 1rem;
    .Item-w-total {
      flex: 1 1 200px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.8rem;
      background-color: var(--white);
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
      border-radius: var(--br-xxl);
      padding: 1rem 1.5rem;
      position: relative;
      .w-w-title {
        color: var(--grey-light-3);
      }
      .w-w-brech {
        position: absolute;
        top: 12px;
        right: 15px;
        font-size: clamp(5px, 8vw, 12px);
        font-weight: 600;
        background: var(--secondary);
        color: var(--black);
        border-radius: var(--br-s);
        padding: 2px 8px;
      }
      .w-w-body {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        .w-w-cont-icon {
          display: grid;
          place-items: center;
          svg {
            width: 2.5rem;
            height: 2.5rem;
          }
          img {
            width: 2.5rem;
            height: 2.5rem;
          }
        }
        .w-w-cont-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          .w-w-value {
            display: flex;
            align-items: flex-end;
            gap: 0.3rem;
            h1 {
              color: var(--black);
              line-height: 1.2rem;
            }
            span {
              font-size: clamp(5px, 8vw, 14px);
              color: var(--grey);
            }
          }
        }
      }
      .w-w-calc {
        display: flex;
        align-items: center;
        gap: 1rem;
        .calc-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;

          .t-icon {
            display: grid;
            place-items: center;
          }
          img {
            width: 1.3rem;
            height: 1.3rem;
          }
          span {
            font-size: clamp(5px, 8vw, 13px);

            font-weight: 500;
          }
        }
      }
    }
  }
  .H-right-totals {
    width: 100%;
    display: flex;
    gap: 1rem;
    flex: 1 1 200px;
    .Item-w-total {
      flex: 1 1 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.8rem;
      background-color: var(--white);
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
      border-radius: var(--br-xxl);
      padding: 1rem 1.5rem;
      position: relative;
      .w-w-title {
        color: var(--grey-light-3);
      }
      .w-w-brech {
        position: absolute;
        top: 12px;
        right: 15px;
        font-size: clamp(5px, 8vw, 12px);
        font-weight: 600;
        background: var(--secondary);
        color: var(--black);
        border-radius: var(--br-s);
        padding: 2px 8px;
      }
      .w-w-body {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        .w-w-cont-icon {
          display: grid;
          place-items: center;
          svg {
            width: 2.5rem;
            height: 2.5rem;
          }
          img {
            width: 2.5rem;
            height: 2.5rem;
          }
        }
        .w-w-cont-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          .w-w-value {
            display: flex;
            align-items: flex-end;
            gap: 0.3rem;
            h1 {
              color: var(--black);
              line-height: 1.2rem;
            }
            span {
              font-size: clamp(5px, 8vw, 14px);
              color: var(--grey);
            }
          }
        }
      }
      .w-w-calc {
        display: flex;
        align-items: center;
        gap: 1rem;
        .calc-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;

          .t-icon {
            display: grid;
            place-items: center;
          }
          img {
            width: 1.3rem;
            height: 1.3rem;
          }
          span {
            font-size: clamp(5px, 8vw, 13px);

            font-weight: 500;
          }
        }
      }
    }
  }
}

.t-min {
  color: #33ba6b;
}
.t-max {
  color: #ff172a;
}
</style>
