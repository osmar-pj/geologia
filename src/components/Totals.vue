<script setup>
import IPlus from "../icons/IPlus.vue";
</script>

<template>
  <div class="Container-totals">
    <div class="H-left-totals">
      <div class="Item-w-total">
        <h5 class="w-w-title">Total de Stock</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon"></div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <h1>123,223.4</h1>
              <small>TMH</small>
            </div>
          </div>
        </div>
        <div class="w-w-calc">
          <h5>de un total de 13 pilas</h5>
        </div>
      </div>
      <div class="Item-w-total">
        <h5 class="w-w-title">Total TMH</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon"></div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <h1>123,340</h1>
              <small>TMH</small>
            </div>
          </div>
        </div>
        <div class="w-w-calc">
          <h5>+ 3 leyes nuevas</h5>
        </div>
      </div>
      <div class="Item-w-total">
        <h5 class="w-w-title">Total Salida</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon"></div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <h1>123,340</h1>
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
            <IPlus />
          </div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <h1>65</h1>
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
        <h5 class="w-w-title">Control de Calidad</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon">i</div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <h1>65</h1>
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
        <h5 class="w-w-title">Control de Calidad</h5>
        <div class="w-w-body">
          <div class="w-w-cont-icon">i</div>
          <div class="w-w-cont-content">
            <div class="w-w-value">
              <h1>65</h1>
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
    </div>
  </div>
</template>

<style lang="scss">
@import "../mixins.scss";
.Container-totals {
  display: flex;
  flex-wrap: wrap;
  padding: 0 2rem 1rem 2rem;
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
