<script setup>
import { onMounted, ref, computed} from "vue"
import { useStore } from "vuex"

const store = useStore()

onMounted(async () => {
  await store.dispatch("pila_total")
  await store.dispatch("get_listPlanta")
})

// const totalWeights = computed(() => store.state.weights)
const pilas = computed(() => store.state.rumaTotal)
const todayAtZero = new Date().setHours(0, 0, 0, 0)
const trips = computed(() => store.state.dataTripsPlanta)
</script>

<template>
  {{ trips }}
  <div class="Container-totals">
    <div class="C-totals-items">
      <div class="Item-w-total primary-color">
        <h5 class="w-w-title">Total de Stock</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon"> <img src="../assets/img/i-totalP.svg" alt=""></div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <h1> {{ pilas.reduce((a, b) => a + b.stock, 0).toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} </h1>
              <small>TMH</small>
            </div>
          </div>
        </div>
        <div class="w-w-calc">
          <!-- <h5>de un total de 13 pilas</h5> -->
        </div>
      </div>
      <div class="Item-w-total one-color">
        <h5 class="w-w-title">Total Mineral Ingresado Dia</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon"> <img src="../assets/img/i-total1.svg" alt=""></div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <h1> {{ pilas.filter(i => new Date(i.createdAt).getTime() >= todayAtZero).reduce((a, b) => a + b.stock, 0).toFixed(1) }} </h1>
              <small>TMH</small>
            </div>
          </div>
        </div>
        <div class="w-w-calc">
          <!-- <h5>+ 3 leyes nuevas</h5> -->
        </div>
      </div>
      <div class="Item-w-total two-color">
        <h5 class="w-w-title">Total Mineral Enviado a Planta</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon"> <img src="../assets/img/i-total1.svg" alt=""></div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <h1> {{ trips.filter(i => new Date(i.date).getTime() >= todayAtZero).reduce((a, b) => a + b.tonh, 0).toFixed(1) }} </h1>
              <small>TMH</small>
            </div>
          </div>
        </div>
        <div class="w-w-calc">
          <h5>+ 4 leyes nuevas</h5>
        </div>
      </div>
      <div class="Item-w-total three-color">
        <h5 class="w-w-title">Ore Control</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon">
            <img src="../assets/img/i-total3.svg" alt="">
          </div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <h1>1</h1>
              <small>viajes</small>
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
      <div class="Item-w-total fouth-color">
        <h5 class="w-w-title">Analisis</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon"> <img src="../assets/img/i-total2.svg" alt=""></div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <h1> {{ pilas.filter(i => (i.statusPila === "Analizando" || i.statusPila === "")).length }} </h1>
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
      <div class="Item-w-total five-color">
        <h5 class="w-w-title">Abastecimiento</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon"> <img src="../assets/img/i-total3.svg" alt=""></div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <h1> {{ pilas.filter(i => i.statusPila === "waitBeginDespacho").length }} </h1>
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
  .C-totals-items {
    flex: 1 1 200px;
    width: 100%;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    .Item-w-total {
      flex: 1 1 200px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.5rem;
      border-radius: var(--br-xxl);
      padding: 1rem 1.5rem;
      position: relative;
      .w-w-title {
        color: var(--grey-2);
        font-size: clamp(5px, 8vw, 11px);
        font-weight: 500;
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
            width: 2.2rem;
            height: 2.2rem;
          }
          img {
            width: 2.2rem;
            height: 2.2rem;
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
            font-size: clamp(5px, 8vw, 12px);

            font-weight: 500;
          }
        }
      }
    }
  }
  // .H-right-totals {
  //   width: 100%;
  //   display: flex;
  //   gap: 1rem;
  //   flex: 1 1 200px;
  //   .Item-w-total {
  //     flex: 1 1 100px;
  //     display: flex;
  //     flex-direction: column;
  //     justify-content: center;
  //     gap: 0.8rem;
  //     background-color: var(--white);
  //     box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  //     border-radius: var(--br-xxl);
  //     padding: 1rem 1.5rem;
  //     position: relative;
  //     .w-w-title {
  //       color: var(--grey-light-3);
  //     }
  //     .w-w-brech {
  //       position: absolute;
  //       top: 12px;
  //       right: 15px;
  //       font-size: clamp(5px, 8vw, 12px);
  //       font-weight: 600;
  //       background: var(--secondary);
  //       color: var(--black);
  //       border-radius: var(--br-s);
  //       padding: 2px 8px;
  //     }
  //     .w-w-body {
  //       display: flex;
  //       align-items: center;
  //       gap: 0.5rem;
  //       .w-w-cont-icon {
  //         display: grid;
  //         place-items: center;
  //         svg {
  //           width: 2.5rem;
  //           height: 2.5rem;
  //         }
  //         img {
  //           width: 2.5rem;
  //           height: 2.5rem;
  //         }
  //       }
  //       .w-w-cont-content {
  //         display: flex;
  //         flex-direction: column;
  //         gap: 0.5rem;
  //         .w-w-value {
  //           display: flex;
  //           align-items: flex-end;
  //           gap: 0.3rem;
  //           h1 {
  //             color: var(--black);
  //             line-height: 1.2rem;
  //           }
  //           span {
  //             font-size: clamp(5px, 8vw, 14px);
  //             color: var(--grey);
  //           }
  //         }
  //       }
  //     }
  //     .w-w-calc {
  //       display: flex;
  //       align-items: center;
  //       gap: 1rem;
  //       .calc-item {
  //         display: flex;
  //         align-items: center;
  //         gap: 0.3rem;

  //         .t-icon {
  //           display: grid;
  //           place-items: center;
  //         }
  //         img {
  //           width: 1.3rem;
  //           height: 1.3rem;
  //         }
  //         span {
  //           font-size: clamp(5px, 8vw, 13px);

  //           font-weight: 500;
  //         }
  //       }
  //     }
  //   }
  // }
}

.t-min {
  color: #33ba6b;
}
.t-max {
  color: #ff172a;
}
.primary-color{
  background-color: #0f1217;
  .w-w-title{
    color: var(--grey-light-2) !important;
  }
  .w-w-value{
    color: var(--grey-light-3) !important;
    h1{
      color: var(--white) !important;
    }
  }
}

.one-color{
  background-color: #E5F6F6;
}
.two-color{
  background-color: #E1DAF9;
}
.three-color{
  background-color: #E0EFFF;
}
.fouth-color{
  background-color: #FFF7D0;
}
.five-color{
  background-color: #D7F2DD;
}
</style>
