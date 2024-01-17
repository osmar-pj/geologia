<script setup>
import { ref } from "vue";
import Alert from "../icons/Alert.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter();
const store = useStore();
const active = ref("/");
const goToPage = (page) => {
  router.push(page);
  active.value = page;
};
const name = ref("");
name.value = store.state.name;
const storedUser = JSON.parse(localStorage.getItem('user'));
const logout = async () => {
  try {
    await store.dispatch("auth_logout");
    router.push({ name: "Login" });
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div class="c-sidebar">
    <div class="sidebar-header">
      <div className="s-header-avatar"> {{ storedUser.user ? storedUser.user.trim().match(/\b\w/g).join('') : '' }}</div>
      <div className="s-header-name">
        <h4>{{ storedUser.user }}</h4>
        <span>Bienvenido, {{ storedUser.empresa }}</span>
      </div>
    </div>
    <div class="sidebar-search">
      <div class="c-c-filters-search">
        <img src="../assets/img/i-search.svg" alt="" />
        <input type="text" value="" placeholder="Buscar por nombre..." />
      </div>
    </div>
    <div class="sidebar-content">
      <div class="s-content-title">
        <div class="s-c-t-general">
          <h1>Menu</h1>
          <span>12</span>
        </div>
        <div class="s-c-t-info">
          <span> <strong>3</strong> items </span>
          <span> <strong>• 1</strong> item </span>
        </div>
      </div>
      <ul class="s-content-menu">
        <li
          @click.prevent="goToPage('/')"
          :class="active == '/' ? 'active' : ''"
        >
          <div class="nav-select"><Alert /></div>
          <span>Dashboard</span>
        </li>
        <li
          @click.prevent="goToPage('list')"
          :class="active == 'list' ? 'active' : ''"
        >
          <div class="nav-select"></div>
          <span>Lista</span>
        </li>
        <li
          @click.prevent="goToPage('oreControl')"
          :class="active == 'oreControl' ? 'active' : ''"
        >
          <div class="nav-select"></div>
          <span>Ore Control</span>
        </li>
        <li
          @click.prevent="goToPage('controlCalidad')"
          :class="active == 'controlCalidad' ? 'active' : ''"
        >
          <div class="nav-select"></div>
          <span>Control de Calidad</span>
        </li>
        <li
          @click.prevent="goToPage('programacion')"
          :class="active == 'programacion' ? 'active' : ''"
        >
          <div class="nav-select"></div>
          <span>Programación</span>
        </li>
        <li
          @click.prevent="goToPage('ruma')"
          :class="active == 'programacion' ? 'active' : ''"
        >
          <div class="nav-select"></div>
          <span>Control de Rumas</span>
        </li>
      </ul>
      <div class="s-content-msg">
        <div class="s-c-msg-header"><span>Mensajes</span></div>
        <div class="s-c-msg-items">
          <div class="msg-i-item">
            <h4>Envio de documentos</h4>
            <span>09.12.2023</span>
            <p>Send the document for the sale of the cart to vycharste</p>
          </div>
          <div class="msg-i-item">
            <h4>Reporte del supervisor</h4>
            <span>04.12.2023</span>
            <p>Send the document for the sale of the cart to vycharste</p>
          </div>
          <div class="msg-i-item">
            <h4>Reparaciones pendientes</h4>
            <span>31.11.2023</span>
            <p>Send the document for the sale of the cart to vycharste</p>
          </div>
        </div>
      </div>
    </div>
    <div class="sidebar-footer">
      <div className="s-footer-logout">
        <a href="" @click.prevent="logout">
          <Alert />
          <h4>Salir</h4>
        </a>
      </div>
      <span>Version: 1.1.10</span>
    </div>
  </div>
</template>

<style lang="scss">
.c-sidebar {
  width: 280px;
  background-color: #0f1217;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 20px;
  .sidebar-header {
    height: 80px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    padding: 1rem 1.8rem;
    .s-header-avatar {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background-color: #26d452;
      color: var(--white);
      font-size: clamp(5px, 8vw, 18px);
      font-weight: 500;
      // @include md {
      //   font-size: clamp(7px, 8vw, 20px);
      //   line-height: 1rem;
      // }
    }
    .s-header-name {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      h4 {
        color: var(--white);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 160px;
      }
      span {
        color: var(--grey-2);
        font-size: clamp(5px, 8vw, 12px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 160px;
      }
      // @include md {
      //   display: block;
      // }
    }
    .header-r-i-perfil {
      cursor: pointer;
      img {
        width: 0.8rem;
      }
    }
  }
  .sidebar-search {
    padding: 0.5rem 1.8rem;
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
      input {
        background-color: #1b1f22;
        border: 1px solid #1b1f22;
        color: var(--white);
        &:focus {
          border: 1px solid var(--grey-2);
        }
      }
    }
  }
  .sidebar-content {
    height: calc(100% - 160px);
    padding: 1rem 1.8rem;
    display: flex;
    flex-direction: column;
    .s-content-title {
      display: flex;
      flex-direction: column;
      .s-c-t-general {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        h1 {
          color: var(--white);
          font-weight: 500;
        }
        span {
          background-color: #fb5663;
          color: var(--white);
          padding: 2px 6px;
          border-radius: 8px;
          font-size: clamp(5px, 8vw, 12px);
        }
      }
      .s-c-t-info {
        span {
          font-size: clamp(5px, 8vw, 12px);
          color: var(--grey-2);
          strong {
            font-weight: normal;
            color: var(--white);
          }
        }
      }
    }
    .s-content-menu {
      flex: 1 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.3rem;
      padding-top: 2rem;
      li {
        border-radius: 10px;
        padding: 0.7rem 1rem;
        width: 100%;
        cursor: pointer;
        transition: all 0.5s ease-in-out;
        display: flex;
        align-items: center;
        gap: 1rem;
        height: 45px;
        .nav-select {
          display: grid;
          place-items: center;
          color: var(--secundary);
          svg {
            width: 1.4rem;
            fill: var(--white);
          }
        }

        &:hover {
          opacity: 1;
          background-color: var(--secondary);
        }
        span {
          color: var(--white);
          font-size: clamp(5px, 8vw, 14px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
        }
      }
    }
    .s-content-msg {
      .s-c-msg-header {
        color: var(--grey-2);
        padding: 2px 6px;
        border-radius: 8px;
        font-size: clamp(5px, 8vw, 12px);
        margin-bottom: 0.8rem;
      }
      .s-c-msg-items {
        height: 300px;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        overflow-x: auto;
        display: grid;
        gap: 0.5rem;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        padding-right: 0.3rem;
        &::-webkit-scrollbar-track {
          background: #0f1217;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #1b1f22;
        }
        .msg-i-item {
          background-color: #1b1f22;
          padding: 1.5rem;
          border-radius: 10px;
          h4 {
            color: var(--white);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 160px;
          }
          span {
            color: #b33e55;
            font-size: clamp(5px, 8vw, 12px);
            font-weight: 500;
          }
          p {
            margin-top: 0.8rem;
            color: var(--grey-2);
            font-size: clamp(5px, 8vw, 12px);
          }
        }
      }
    }
  }
  .sidebar-footer {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.8rem;
    .s-footer-logout {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      a {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 10px 18px 10px 12px;
        border-radius: 10px;
        h4 {
          color: var(--white);
          font-weight: normal;
        }
        svg {
          fill: var(--grey-2);
          width: 1.2rem;
          height: 1.2rem;
        }
        &:hover{
          background-color: #1b1f22;
        }
      }
    }
    span {
      color: var(--grey-2);
      font-size: clamp(5px, 8vw, 12px);
    }
  }
  //   @include md{
  //     display: flex;
  //   }
}

.sp-acti {
  background-color: var(--secondary);
}

.sp-desact {
  opacity: 0.4;
}
</style>
