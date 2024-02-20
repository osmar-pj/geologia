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
    <form class="mCreate-content mCreate-details inner">
      <div class="mC-c-header">
        <div class="mC-h-title">
          <div class="mC-c-title-icon">
            <Edit />
          </div>
          <div class="mC-c-title-text">
            <h2>{{ data.pila }}</h2>
            <h4>Detalles de pila</h4>
          </div>
        </div>
        <span @click="cerrarModal" class="mC-h-close" type="button">
          <img src="../assets/img/i-close.svg" alt="" />
        </span>
      </div>

      <div class="mC-c-body">
        <!-- <div class="mC-b-info">
          <div v-for="(value, key) in data" :key="key" class="item-descrip">
            <h5>{{ key }}</h5>
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
        </div> -->
        {{ data.travels }}
        <div class="mC-b-samples">
          <div class="N-datatable">
            <table>
              <thead>
                <tr>
                  <th
                    v-for="(value, key) in data.travels[0]"
                    v-if="key !== 'id'"
                  >
                    {{ key }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(sample, index) in data.travels" :key="index">
                  <td v-for="(value, key) in sample" v-if="key !== 'id'">
                    {{ value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mC-b-history">
          <div>
            <h3>History</h3>
          </div>
          <div
            v-for="(value, key) in data.history"
            :key="key"
            class="mC-h-container"
          >
            <div class="mC-h-c-item">
              <div class="item-h-text">
                <h4>{{ value.work }}</h4>
                <h5>{{ value.user ? value.user : "--" }}</h5>
              </div>
              <h4 class="item-h-date">{{ formatDate(value.date) }}</h4>
            </div>
          </div>
        </div>

        <div class="mC-b-samples">
          <div class="N-datatable">
            <table>
              <thead>
                <tr>
                  <th
                    v-for="(value, key) in data.samples[0]"
                    v-if="key !== 'id'"
                  >
                    {{ key }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(sample, index) in data.samples" :key="index">
                  <td v-for="(value, key) in sample" v-if="key !== 'id'">
                    {{ value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="mC-c-footer">
        <!-- <button @click="cerrarModal" class="btn-cancel" type="button">
          Cancelar
        </button>
        <button class="btn-success" type="submit">Cerrar</button> -->
      </div>
    </form>
  </div>
</template>

<style lang="scss">
.mC-b-history {
  .mC-h-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-left: 20px;
    .mC-h-c-item {
      display: flex;
      justify-content: space-between;
      position: relative;
      .item-h-text {
        h4 {
          font-weight: 550;
        }
        h5 {
          padding-bottom: 15px;
        }
      }
      .item-h-date {
      }
      &::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        position: absolute;
        top: 4px;
        left: -15px;
        background-color: var(--black);
      }
      &::after {
        content: "";
        width: 1px;
        height: 100%;
        border-radius: 50%;
        position: absolute;
        top: 4px;
        left: -13px;
        background-image: repeating-linear-gradient(
          to bottom,
          var(--black),
          var(--black) 2px,
          transparent 2px,
          transparent 4px
        );
      }
    }
  }
}

.mCreate-details {
  max-width: 80% !important;
  flex-direction: row;
}
</style>
