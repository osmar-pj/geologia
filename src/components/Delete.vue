<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { useStore } from "vuex";
const store = useStore();
const url = import.meta.env.VITE_API_URL

const userModal = store.state.userModal;
const { showModal, showItem } = defineProps(["showItem", "showModal"]);
const emit = defineEmits();

const cerrarModal = () => {
  emit("cerrarModal");
};

const deleteTravel = async () => {
  console.log(userModal.travel_Id)
  try {
    userModal.validGeology = 0;
    const response = await fetch(`${url}/triplist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userModal),
    });

    const data = await response.json();
     if (data.status === true) {
       console.log("correcto");
       emit("cerrarModal");
     } else {
       console.log("error");
     }
  } catch (error) {
    console.error("Error al actualizar:", error);
  }
};

</script>

<template>
    <div class="modalCreate-backg">
      <form class="mCreate-2 ">
        <div class="mC-c-header">
          <div class="mC-h-title">
            <div class="mC-c-title-icon">
              <img src="../assets/img/i-compl.svg" alt="" />
            </div>
            <div class="mC-c-title-text">
              <h2>Eliminar a {{
                  userModal.operador
                    ? userModal.operador.split(" ").slice(0, 1).join(" ")
                    : ""
                }}</h2>
              <h4>Borrar un viaje</h4>
            </div>
          </div>
          <span @click="cerrarModal" class="mC-h-close" type="button">
            <img src="../assets/img/i-close.svg" alt="" />
          </span>
        </div>
        <div class="mC-c-body">
            <div class="mC-b-info ">
                <p>
                    ¿Está seguro que desea eliminar a <strong>"{{
                          userModal.operador
                            ? userModal.operador.split(" ").slice(0, 2).join(" ")
                            : ""
                        }}"</strong> de la lista de viajes?
                </p>
            </div>
        </div>
        <div class="mC-c-footer">
          <button @click="cerrarModal" class="btn-cancel" type="button">
            No
          </button>
          <button
            class="btn-delete"
            type="submit"
            @click.prevent="deleteTravel()"
          >
            Si
          </button>
        </div>
      </form>
    </div>
  </template>

<style lang="scss">
.modalCreate-backg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 12;
  display: grid;
  place-items: center;
  .mCreate-2 {
    background-color: var(--white);
    max-width: 330px;
    width: 100%;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);

    .mC-c-header {
      padding: 1.5rem 1.5rem 0 1.5rem;

      .mC-h-title {
        display: flex;
        align-items: center;
        gap: 1rem;
        .mC-c-title-icon {
          display: grid;
          place-items: center;
          img {
            width: 1.6rem;
            height: 1.6rem;
            // @include md {
            //   width: 2.5rem;
            // }
          }
        }
        .mC-c-title-text {
          text-align: left;
          h2 {
            font-size: clamp(6px, 8vw, 18px);
            color: var(--black);
            font-weight: 500;
            letter-spacing: -0.03em;
          }
          h4 {
            padding-top: 0.1rem;
            font-weight: normal;
            color: var(--grey-1);
            font-size: clamp(6px, 8vw, 13px);
          }
        }
      }
      .mC-h-close {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background-color: var(--grey-light-1);
        cursor: pointer;
        display: grid;
        place-items: center;
        transition: all 0.35s ease-in-out;
        img {
          width: 0.5rem;
          // @include md {
          //   width: 0.6rem;
          // }
        }
        padding: 0;
        &:hover {
          background-color: var(--grey-light-22);
        }
        // @include md {
        //   width: 30px;
        //   height: 30px;
        //   top: 20px;
        //   right: 40px;
        // }
      }
    }
    .mC-c-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.8rem 1.5rem;
      overflow: auto;
      max-height: 70vh;
    
      .mC-b-info {        
        p {

          strong {
            font-weight: 600;
          }
        }
      }
    }
    .mC-c-footer {
      padding: 0 1.5rem 1.5rem 1.5rem;

      display: flex;
      gap: 1rem;

      .btn-cancel{
        border-color: var(--grey-light-22);
        color: var(--grey-2);
        background-color: var(--grey-light-22);
        &:hover {
          background-color: rgb(236, 47, 47);
          color: var(--white);
        }
      }

      .btn-delete {
        transition: all 0.35s ease-out;
        background-color: rgb(243, 89, 89);
        &:hover {
          background-color: rgb(236, 47, 47);
        }
      }
    }
  }
}


</style>
