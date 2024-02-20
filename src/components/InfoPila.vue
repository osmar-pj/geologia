<script setup>
import { defineEmits, defineProps, ref } from "vue";
import Edit from "../icons/Edit.vue";
import IHelp from "../icons/IHelp.vue";
import {
  formatDate,
  formatFixed,
  formatHour,
  formatDateAbas,
} from "../libs/utils";

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
            <h4>Información detallada</h4>
          </div>
        </div>
        <span @click="cerrarModal" class="mC-h-close" type="button">
          <img src="../assets/img/i-close.svg" alt="" />
        </span>
      </div>

      <div class="mC-c-body">
        <div class="mC-b-samples">
          <h2 class="mC-b-title">Lista de viajes </h2>
          <div class="N-datatable">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Mina</th>
                  <th>Vehículo</th>
                  <th>Turno</th>
                  <th>Id</th>
                  <th>Tajo</th>
                  <th>Dominio</th>
                  <th>Toneladas</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(travel, rowIndex) in data.travels" :key="rowIndex">
                  <td>
                    <div class="td-user">
                      <div class="t-name">
                        <h5>#{{ rowIndex + 1 }}</h5>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="t-name">
                      <h4>
                        {{ formatDateAbas(travel.date) }}
                      </h4>
                      <div class="t-hour">
                        <img src="../assets/img/i-time.svg" alt="" />
                        <h5 class="text-hour">
                          {{ formatHour(travel.date) }}
                        </h5>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="t-name">
                      <h4>
                        {{ travel.mining }}
                      </h4>
                      <h5>
                        {{ travel.ubication }}
                      </h5>
                    </div>
                  </td>

                  <td>
                    <div class="t-vehiculo">
                      <img
                        :src="
                          travel.carriage === 'Vagones'
                            ? 'src/assets/img/i-wagon.svg'
                            : 'src/assets/img/i-truck.svg'
                        "
                        alt=""
                      />
                      <div class="t-name">
                        <h4>
                          {{ travel.tag }}
                        </h4>
                        <h5 v-if="travel.vagones">
                          {{ travel.vagones }} vagones
                        </h5>
                        <h5 class="t-2" v-else>---</h5>
                      </div>
                    </div>
                  </td>
                  <td>
                    <h4>{{ travel.turn }}</h4>
                  </td>
                  <td>
                    <h4>{{ travel.id_trip }}</h4>
                  </td>
                  <td>
                    <h4>{{ travel.tajo }}</h4>
                  </td>
                  <td>
                    <h4>{{ travel.dominio }}</h4>
                  </td>
                  <td>
                    <div class="t-name">
                      <h4>
                        {{ travel.tonh.toFixed(2) }}
                      </h4>
                      <h5>toneladas</h5>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mC-b-history">
          <h2 class="mC-b-title">Historial</h2>
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

        <!-- <div class="mC-b-samples">
          <div class="N-datatable">
            <table>
              <thead>
                <tr>
                  <th
                    v-for="(value, samp) in data.samples[0]"
                    v-if="samp !== 'id'"
                  >
                    {{ samp }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(sample, index) in data.samples" :samp="index">
                  <td v-for="(value, samp) in sample" v-if="key !== 'id'">
                    {{ value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> -->
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
  padding-top: 1rem;
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
  max-width: 1100px !important;
  flex-direction: row;
}
.mC-b-title{
  padding-bottom: 1rem;
}
</style>
