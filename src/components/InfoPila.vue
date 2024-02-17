<script setup>
import { defineEmits, defineProps, ref } from "vue";
import Edit from "../icons/Edit.vue";
import IHelp from "../icons/IHelp.vue";
import { formatDate, formatFixed, formatArrayField } from "../libs/utils";

const props = defineProps(["data"]);
const emit = defineEmits();
const cerrarModal = () => {
  emit("cerrarModal");
};
const data = ref(props.data);
</script>

<template>
  <div class="modalCreate-backg">
    <form class="mCreate-content mCreate-3 inner">
      <div class="mC-c-header">
        <div class="mC-h-title">
          <div class="mC-c-title-icon">
            <Edit />
          </div>
          <div class="mC-c-title-text">
            <h2>Información detallada</h2>
            <h4>Información detallada</h4>
          </div>
        </div>
        <span @click="cerrarModal" class="mC-h-close" type="button">
          <img src="../assets/img/i-close.svg" alt="" />
        </span>
      </div>

      <div class="mC-c-body">
        <div class="mC-b-info">
          <div v-for="(value, key) in data" :key="key" class="item-descrip">
            <h5>{{ key }}</h5>
            <h4 v-if="key === 'history'">
              <ul>
                <li v-for="(item, index) in value" :key="index">
                  <strong>{{ item.work }}</strong
                  >: {{ formatDate(item.date) }} - {{ item.user }}
                </li>
              </ul>
            </h4>
            <h4 v-if="key === 'travels'">
              <ul>
                <li v-for="(item, index) in value" :key="index">
                  <strong>{{ item._id }}</strong
                  >: {{ formatDate(item.tonh) }}
                </li>
              </ul>
            </h4>
            <h4 v-else-if="Array.isArray(value)">
              <span v-for="(item, index) in value" :key="index">{{
                item
              }}</span>
            </h4>
            <h4 v-else-if="typeof value === 'object'">
              <span v-for="(val, k) in value" :key="k">
                <strong>{{ k }}:</strong> {{ val }}
              </span>
            </h4>
            <h4 v-else>{{ value }}</h4>
          </div>
        </div>
      </div>
      <div class="mC-c-footer">
        <button @click="cerrarModal" class="btn-cancel" type="button">
          Cancelar
        </button>
        <button class="btn-success" type="submit">Guardar</button>
      </div>
    </form>
  </div>
</template>

<style lang="scss">
.inputs-change {
  position: relative;
  .btn-change {
    position: absolute;
    color: var(--grey-2);
    background-color: var(--grey-light-22);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    padding: 0;
    display: grid;
    place-items: center;
    svg {
      fill: transparent;
      color: var(--grey-2);
      width: 1.5rem;
      height: 1.5rem;
      stroke-width: 1.5;
    }
    &:active {
      transform: translate(-50%, -50%) scale(0.85);
    }
  }
}

.input-pila {
  flex: 1 1 130px !important;
}
.t-nulo {
  padding: 2px 6px;
  background-color: #fee2e2b4;
  border-radius: 5px;
  display: flex;
  place-items: center;
  gap: 0.25rem;
  font-size: clamp(6px, 8vw, 12px);
  color: var(--red);
  svg {
    fill: transparent;
    color: var(--red);
    width: 15px;
    height: 15px;
    stroke-width: 1.5;
  }
}
.container-count {
  flex: 1 1 150px;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  gap: 1rem;
  padding: 15px 20px;
  border: 1px solid var(--grey-light-2);
  border-radius: 10px;
  .count-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    .count-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 5rem;
        height: 3rem;
      }
      span {
        color: var(--black);
        transition: 0.375s ease;
        text-align: left;
        font-size: clamp(6px, 8vw, 14px);
        line-height: 1.2rem;
        font-weight: 500;
      }
    }
    .count-input {
      display: flex;
      justify-content: center;
      align-items: center;

      border: 1.5px solid var(--grey-light-2);
      border-radius: 5px;
      .input-number {
        width: 35px;
        height: 35px;
        color: var(--black);
        padding: 0;
        text-align: center;
        font-size: clamp(6px, 8vw, 14px);
        border-radius: 0;
        border: none;
      }
      .button-number {
        width: 35px;
        height: 35px;
        color: var(--grey-2);
        background-color: var(--grey-light-22);
        padding: 0;
        display: grid;
        place-items: center;

        svg {
          fill: transparent;
          color: var(--grey-2);
          width: 1.2rem;
          height: 1.2rem;
          stroke-width: 2;
        }
        &:hover {
          background-color: var(--primary);
          svg {
            color: var(--white);
          }
        }
        &:active {
          transform: scale(0.85);
        }
        &:nth-child(1) {
          border-radius: 5px 0 0 5px;
        }
        &:nth-child(3) {
          border-radius: 0 5px 5px 0;
        }
      }
    }
  }
}
.label-error {
  font-size: clamp(6px, 8vw, 12px);
  color: rgb(243, 89, 89);
  font-weight: 600;
  line-height: 0.8rem;
  margin-top: 0.1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.mCreate-3 {
  max-width: 650px !important;
}

.no-spinners::-webkit-inner-spin-button,
.no-spinners::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
