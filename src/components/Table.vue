<script setup>
import { ref, onMounted } from "vue";
import Modal from "../components/Modal.vue";
const selectedCity = ref(null);
const showModal = ref(false);
const cities = ref([
  { name: "City1", value: "city1" },
  { name: "City2", value: "city2" },
  { name: "City1", value: "city3" },
  { name: "City2", value: "city4" },
  { name: "City1", value: "city5" },
  { name: "City2", value: "city6" },
  { name: "City1", value: "city7" },
  { name: "City2", value: "city8" },
  { name: "City1", value: "city9" },
  { name: "City2", value: "city10" },
  { name: "City1", value: "city11" },
  { name: "City2", value: "city12" },
]);

const props = defineProps(["showActionsColumn", "title", "data"]);
const formattedDate = ref("");

onMounted(() => {
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
});

// onMounted(() => {
//     CustomerService.getCustomersMedium().then((data) => (customers.value = data));
// });
// const customers = ref();


</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <h1>{{ props.title || "Viajes realizados, Listos" }}</h1>
      <span>{{ formattedDate }} | Dia terminado en Mina </span>
    </div>
    <div class="global-h-button">
      <div class="radio-inputs">
        <label class="radio">
          <input type="radio" name="radio" checked="" />
          <span class="name">Semana</span>
        </label>
        <label class="radio">
          <input type="radio" name="radio" />
          <span class="name">Mes</span>
        </label>

        <label class="radio">
          <input type="radio" name="radio" />
          <span class="name">Año</span>
        </label>
      </div>
    </div>
  </div>

  <div class="c-global-c-content">
    <div class="users-c-c-filters">
      <div class="c-c-filters-search">
        <img src="../assets/img/i-search.svg" alt="" />
        <input type="text" value="" placeholder="Buscar por nombre..." />
      </div>
      <div class="c-c-filters-items">
        <Dropdown
          class="p-dropdown"
          v-model="selectedCity"
          :options="cities"
          optionLabel="name"
          placeholder="Seleccionar"
        />
        <Dropdown
          class="p-dropdown"
          v-model="selectedCity"
          :options="cities"
          optionLabel="name"
          placeholder="Seleccionar"
        />
        <Dropdown
          class="p-dropdown"
          v-model="selectedCity"
          :options="cities"
          optionLabel="name"
          placeholder="Seleccionar"
        />
      </div>
    </div>

    <div class="users-c-c-table">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Turno</th>
            <th>Mina</th>
            <th>Operador</th>
            <th>Placa</th>
            <th>Vagones</th>
            <th>Tonelada</th>
            <th>TMH</th>
            <th>Tajo</th>
            <th>Tableta</th>
            <th v-if="props.showActionsColumn">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(d, index) in props.data" :key="index">
            <td>
              <div class="td-user">
                <div class="t-name">
                  <h4>#{{ index + 1}}</h4>
                </div>
              </div>
            </td>
            <td>
              <div class="td-user">
                <div class="t-name">
                  <h4>{{ d.fecha }}</h4>
                  <h5>Fecha de llegada</h5>
                </div>
              </div>
            </td>
           <td>
              <div class="td-user">
                <div class="t-name">
                  <h4>{{ d.turno }}</h4>
                  <h5>turno</h5>
                </div>
              </div>
            </td>
            <td>
              <div class="td-user">
                <div class="t-name">
                  <h4>{{ d.mina }}</h4>
                  <h5>mina</h5>
                </div>
              </div>
            </td>
            <td>
              <div class="td-user">
                <span class="t-siglas">{{ d.operador ? d.operador.split(' ').slice(0, 2).map(word => word.charAt(0)).join('') : '' }}</span>
                <div class="t-name">
                  <h4>{{ d.operador ? d.operador.split(' ').slice(0,2).join(' ') : ''}}</h4>
                  <h5 class="t-2">{{ d.operador ? d.operador.split(' ').slice(2).join(' ') : ''}}</h5>                  
                </div>
              </div>
            </td>
            <td>
              <div class="td-user">
                <div class="t-name">
                  <h4>{{ d.vehiculo }}</h4>
                  <h5>vehiculo</h5>
                </div>
              </div>
            </td>
            <td>
              <div class="td-user">
                <div class="t-name">
                  <h4>{{ d.vagones }}</h4>
                  <h5>vagones</h5>
                </div>
              </div>
            </td>
            <td>
              <div class="td-user">
                <div class="t-name">
                  <h4>{{ d.ton }}</h4>
                  <h5>toneladas</h5>
                </div>
              </div>
            </td>
            <td>
              <div class="td-user">
                <div class="t-name">
                  <h4>{{ d.tonh }}</h4>
                  <h5>toneladas</h5>
                </div>
              </div>
            </td>
            <td>
              <div class="td-user">
                <div class="t-name">
                  <h4>{{ d.tajo }}</h4>
                  <h5>{{ d.tipo }}</h5>
                </div>
              </div>
            </td>
            <td>
              <div class="td-user">
                <div class="t-name">
                  <h4>{{ d.tableta }}</h4>
                  <h5>{{ d.tableta ? "#tableta" : "" }}</h5>
                </div>
              </div>
            </td>
            <td v-if="showActionsColumn">
              <div className="btns">
                <button @click="showModal = true">Completar ></button>
              </div>
            </td>
          </tr>
          
        </tbody>
      </table>  
      <!-- <DataTable :value="data" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem"
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}">
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" text />
            </template>
            <template #paginatorend>
                <Button type="button" icon="pi pi-download" text />
            </template>
            <Column field="fecha" header="Fecha" style="width: 25%">
              <div>
                fecha
              </div>
            </Column>
            <Column field="country.name" header="Country" style="width: 25%"></Column>
            <Column field="company" header="Company" style="width: 25%"></Column>
            <Column field="representative.name" header="Representative" style="width: 25%"></Column>
        </DataTable> -->

    </div>

    <div class="users-c-c-footer">
      <div class="c-c-footer-item"></div>
      <div class="c-c-footer-page">
        <button>
          <!-- <img src="imgs/i-drop.svg" alt="" /> -->
        </button>
        <span class=""> Página <strong> 2 de 10 </strong> </span>
        <button>
          <!-- <img src="imgs/i-drop.svg" alt="" /> -->
        </button>
      </div>
    </div>
  </div>
  <Modal v-if="showModal" @cerrarModal="showModal = false" />

</template>

<style lang="scss">
.c-global-header {
  width: 100%;
  padding: 1.5rem 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  .global-h-title {
    span {
      color: var(--grey-1);
      font-size: clamp(6px, 8vw, 14px);
      line-height: 1.1rem;
      font-weight: 400;
    }
  }
  .global-h-button {
    .radio-inputs {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      border-radius: 0.5rem;
      background-color: var(--grey-light-1);
      box-sizing: border-box;

      padding: 0.25rem;
      width: 300px;
      font-size: 14px;
    }

    .radio-inputs .radio {
      flex: 1 1 auto;
      text-align: center;
    }

    .radio-inputs .radio input {
      display: none;
    }

    .radio-inputs .radio .name {
      display: flex;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      border: none;
      padding: 0.5rem 0;
      color: var(--grey-1);
      transition: all 0.15s ease-in-out;
    }

    .radio-inputs .radio input:checked + .name {
      background-color: var(--primary);
      color: var(--white);
      font-weight: 600;
    }
  }
  //   @include md {
  //     padding: 1.5rem 5rem;
  //   }
}

.c-global-c-content {
  display: flex;
  flex-direction: column;
  padding: 2.5rem;
  padding-top: 0;
  gap: 1rem;
  flex: 1 1;
  overflow: auto;
  .users-c-c-filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    .c-c-filters-search {
      display: flex;
      position: relative;
      max-width: 300px;
      width: 100%;
      img {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 15px;
        width: 1rem;
      }
    }
    .c-c-filters-type {
      flex: 1 1 250px;
      label {
        font-size: clamp(5px, 8vw, 10px);
        font-weight: 500;
        //   @include md {
        //     font-size: clamp(6px, 8vw, 12px);
        //   }
      }
      .imputs-i-input {
        position: relative;
        img {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 15px;
          width: 1rem;
        }
      }
    }
    .c-c-filters-items {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: clamp(6px, 8vw, 14px);
      // @include md {
      //   font-size: clamp(6px, 8vw, 13px);
      // }
    }
  }
  .users-c-c-table {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow: auto;

    table {
      width: 100%;
      color: var(--black);
      font-size: clamp(6px, 8vw, 14px);
      line-height: 0.7rem;
      font-weight: 500;
      border-collapse: collapse;
      white-space: nowrap;
      // @include md {
      //   font-size: clamp(6px, 8vw, 14px);
      //   line-height: 1.1rem;
      // }
    }

    thead {
      color: var(--grey-1);
      text-align: left;
      background-color: var(--grey-light-1);
      font-size: clamp(6px, 8vw, 11px);
      position: sticky;
      top: 0;
      z-index: 1;
      // @include md {
      //   font-size: clamp(6px, 8vw, 12px);
      // }
    }

    th {
      padding: 15px 12px;
      font-weight: normal !important;
      div {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        img {
          width: 0.5rem;
          // @include md {
          //   width: 0.6rem;
          // }
        }
        //   @include md {
        //     gap: 0.5rem;
        //   }
      }
    }

    td {
      padding: 9px 12px;

      // @include md {
      //   padding: 15px;
      // }
    }

    tbody tr {
      z-index: 99;
      background-color: var(--white);
    }
  }
  .users-c-c-footer {
    display: flex;
    justify-content: space-between;
    .c-c-footer-page {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      button {
        height: 30px;
        width: 30px;
        padding: 0;
        border: 0.5px solid var(--grey-light-2);
        display: grid;
        place-items: center;
        border-radius: 5px;
        img {
          width: 0.7rem;
        }
        &:nth-child(1) {
          img {
            transform: rotate(90deg);
          }
        }
        &:nth-child(3) {
          img {
            transform: rotate(270deg);
          }
        }
        &:hover {
          background-color: #f3f3f4;
        }
      }
      span {
        display: flex;
        gap: 0.5rem;
        font-size: clamp(6px, 8vw, 12px);
        //   @include md {
        //     font-size: clamp(6px, 8vw, 13px);
        //   }
      }
    }
  }
  // @include md {
  //   padding: 3rem;
  // }
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

.td-user {
  display: flex;
  align-items: center;
  gap: 1rem;
  .t-siglas {
    width: 35px;
    height: 35px;
    background-color: #00b47e;
    color: var(--white);
    text-transform: uppercase;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: clamp(7px, 8vw, 16px);
  }
  .t-name {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    h4 {
      text-transform: capitalize;
    }
    h5 {
      text-transform: lowercase;
      font-size: clamp(6px, 8vw, 12px);
      line-height: 0.8rem;
      color: var(--grey-1);
      //   @include md {
      //     font-size: clamp(6px, 8vw, 12px);
      //   }
    }
    h4 {
      font-weight: 500;
      font-size: clamp(6px, 8vw, 14px);
      //   @include md {
      //     font-size: clamp(6px, 8vw, 14px);
      //   }
    }
    .t-2 {
      text-transform: capitalize;
    }
  }
}

.td-cot {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  img {
    width: 1.1rem;
  }
  h4 {
    text-transform: uppercase;
    font-weight: 500;
    font-size: clamp(6px, 8vw, 12px);
    // @include md {
    //   font-size: clamp(6px, 8vw, 14px);
    // }
  }
}

.t-cort {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
  font-size: clamp(6px, 8vw, 14px);
}
</style>
