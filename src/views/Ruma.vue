<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import URModal from "../components/URModal.vue";
import Delete from "../components/Delete.vue";

const data= [
    {mina:"yumpag", operador:"Carlos", statusGeology: "QualityControl", tipo:""},
    {mina:"yumpag", operador:"Pedro", statusGeology: "OreControl", tipo:""},
    {mina:"yumpag", operador:"Ricardo", statusGeology: "QualityControl", tipo:""},
    {mina:"yumpag", operador:"Lucas", statusGeology: "QualityControl", tipo:""},
]

const store = useStore();
const showModalDelete = ref(false);

const showOCModal = ref(false);

const openModal = () => {
  showOCModal.value = true;
};

const openDelete = (e) => {
  
  showModalDelete.value = true;
};

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

</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <h1>Control de Rumas</h1>
      <span>{{ formattedDate }} | Dia terminado en Mina </span>
    </div>
    <div class="global-h-button">
      <button class="btn-ruma" @click="openModal()">Unir Rumas</button>
    </div>
  </div>

  <div class="c-global-c-content">
    <DataTable      
      :value="data"
      dataKey="travel_Id"
      paginator
      :rows="20"
      scrollable
      tableStyle="width: 100%"
      paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Página {currentPage} de {totalPages}"
    >
      <Column selectionMode="multiple" headerStyle="width: 2.5rem"></Column>
      
      <Column field="fecha" header="Fecha" sortable>
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.fecha }} {{ slotProps.data.hora }}</h4>
              <h5>Fecha de llegada</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="mina" header="Mina" sortable>
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.mina }}</h4>
              <h5>mina</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="ruma" header="Nro Ruma">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.ruma }}</h4>
              <h5>{{ slotProps.data.ruma ? "#ruma" : "" }}</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="ley_ag" header="Ley Ag">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.ley_ag }}</h4>
              <h5>valor</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="ley_fe" header="Ley Fe">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.ley_fe }}</h4>
              <h5>valor</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="ley_mn" header="Ley Mn">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.ley_mn }}</h4>
              <h5>valor</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="ley_pb" header="Ley Pb">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.ley_pb }}</h4>
              <h5>valor</h5>
            </div>
          </div>
        </template>
      </Column>
      <Column field="ley_zn" header="Ley Zn">
        <template #body="slotProps">
          <div class="td-user">
            <div class="t-name">
              <h4>{{ slotProps.data.ley_zn }}</h4>
              <h5>valor</h5>
            </div>
          </div>
        </template>
      </Column>
     
      <Column field="Acciones" header="Acciones">
        <template #body="slotProps">
          <div className="btns">           
            <button @click="openDelete(slotProps.data)">X</button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <URModal v-if="showOCModal" @cerrarModal="showOCModal = false" />
  <Delete  v-if="showModalDelete"
    @cerrarModal="showModalDelete = false"      
    />
</template>

<style lang="scss">
.c-global-header {
  width: 100%;
  padding: 1.5rem 2.5rem;
  display: flex;
  flex-wrap: wrap;
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
      border-radius: 12px;
      background-color: var(--grey-light-1);
      box-sizing: border-box;
      padding: 6px;
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
      border-radius: 8px;
      border: none;
      padding: 0.5rem 0;
      color: var(--grey-1);
      transition: all 0.15s ease-in-out;
    }

    .radio-inputs .radio input:checked + .name {
      background-color: var(--primary);
      color: var(--white);
      font-weight: 500;
    }
  }
  //   @include md {
  //     padding: 1.5rem 5rem;
  //   }
}

.c-global-c-content {
  display: flex;
  flex-direction: column;
  padding: 0 2.5rem;
  padding-bottom: 1rem;
  gap: 1rem;
  flex: 1 1;
  overflow: hidden;
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
