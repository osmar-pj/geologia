<script setup>
import { ref, markRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import IDash from "../icons/IDash.vue";
import IControl from "../icons/IControl.vue";
import CQuality from "../icons/CQuality.vue";
import CRuma from "../icons/CRuma.vue";
import IList from "../icons/IList.vue";
import ILogout from "../icons/ILogout.vue";
import ISetting from "../icons/ISetting.vue";

const router = useRouter();
const route = useRoute();

const store = useStore();

const menuItems = [
  {
    name: "/",
    label: "Mapa de Stock Piles",
    icon: CRuma,
    route: "/",
  },
  {
    name: "analysis",
    label: "Análisis",
    icon: IDash,

    items: [
      {
        name: "analysis",
        label: "Producción",
        route: "analysis",
      },
      {
        name: "analysisP",
        label: "Planta",
        route: "analysisP",
      },
    ],
  },

  {
    name: "Gestión",
    label: "Gestión",
    icon: IControl,

    items: [
      {
        name: "oreControl",
        label: "Ore Control",
        route: "oreControl",
      },
      {
        name: "controlCalidad",
        label: "Control de Calidad",
        route: "controlCalidad",
      },
    ],
  },
  {
    name: "analysis",
    label: "Lista de viajes",
    icon: IList,

    items: [
      {
        name: "cancha",
        label: "Cancha",
        route: "cancha",
      },
      {
        name: "planta",
        label: "Planta",
        route: "planta",
      },
    ],
  },
  {
    name: "pila",
    label: "Stock Piles de Cancha",
    icon: CQuality,
    route: "pila",
  },
  {
    name: "setting",
    label: "Configuración",
    icon: ISetting,
    route: "setting",
  },
];

const name = ref("");
name.value = store.state.name;
const storedUser = JSON.parse(localStorage.getItem("user"));
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
      <div className="s-header-avatar">
        {{
          storedUser.name ? storedUser.name.trim().match(/\b\w/g).join("") : ""
        }}
      </div>
      <div className="s-header-name">
        <h4>{{ storedUser.name }}</h4>
        <span>Bienvenido, a GUNJOP</span>
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
          <span>
            <strong>{{ menuItems.length }}</strong> items
          </span>
          <span> <strong>• 3</strong> principales </span>
        </div>
      </div>

      <ul class="s-content-menu">
        <details
          open
          v-for="menuItem in menuItems"
          :key="menuItem.name"
          class="s-c-menu-details"
        >
          <template v-if="!menuItem.items">
            <summary>
              <router-link :to="menuItem.route" class="nav-select-only">
                <component :is="menuItem.icon" />
                <span>{{ menuItem.label }}</span>
              </router-link>
            </summary>
          </template>
          <template v-else>
            <summary class="nav-select-grouped">
              <component :is="menuItem.icon" />
              <span>{{ menuItem.label }}</span>
            </summary>
            <ul class="nav-subitems">
              <li v-for="subItem in menuItem.items" :key="subItem.name">
                <router-link :to="subItem.route" class="nav-subitems-item">
                  <span>{{ subItem.label }}</span>
                </router-link>
              </li>
            </ul>
          </template>
        </details>
      </ul>

      <!-- <PanelMenu :model="items">
        <template #item="{ item }">
          <router-link
            v-if="item.route"
            v-slot="{ href, navigate }"
            :to="item.route"
            custom
          >
            <a
              :class="{ active: isRouteActive(item.route) }"
              :href="href"
              @click="navigate"
            >
              <span class="nav-select">{{ item.label }}</span>
            </a>
          </router-link>
          <a
            v-else
            class="s-content-menu"
            :href="item.url"
            :target="item.target"
          >
            <span class="nav-select">
              <component
                :is="
                  typeof item.icon === 'object' ? markRaw(item.icon) : 'span'
                "
              />
            </span>

            <span>{{ item.label }}</span>
            <span v-if="item.items" class="hola"></span>
          </a>
        </template>
      </PanelMenu> -->

      <!-- <div class="s-content-msg">
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
      </div>  -->
    </div>
    <div class="s-content-welcome">
      <div class="msg-i-item">
        <img src="" alt="" />
        <h4>Bienvenido</h4>

        <p>Send the document for the sale of the cart to vycharste</p>
      </div>
    </div>
    <div class="sidebar-footer">
      <div className="s-footer-logout">
        <a href="" @click.prevent="logout">
          <ILogout />
          <h4>Salir</h4>
        </a>
      </div>
      <span>Version: 1.1.10</span>
    </div>
  </div>
</template>

<style lang="scss">
@import "../mixins.scss";
.c-sidebar {
  width: 280px;
  background-color: #0f1217;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 0 5px 5px 0;
  height: 100vh;
  position: absolute;
  z-index: 2;
  left: -100%;
  .sidebar-header {
    height: 80px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    padding: 1rem 1.8rem;
    .s-header-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background-color: var(--primary);
      color: var(--white);
      font-size: clamp(5px, 8vw, 18px);
      font-weight: 500;
      text-transform: uppercase;
      @include md {
        font-size: clamp(7px, 8vw, 14px);
        line-height: 1rem;
      }
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
        text-transform: capitalize;
      }
      span {
        color: var(--grey-light-3);
        font-size: clamp(5px, 8vw, 12px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 160px;
      }
      //  @include md {
      //    display: block;
      //  }
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
        height: 40px;
        &:focus {
          border: 1px solid var(--grey-2);
        }
      }
    }
  }
  .sidebar-content {
    flex: 1 1;
    padding: 1rem 1.8rem;
    display: flex;
    flex-direction: column;
    .s-content-title {
      display: flex;
      flex-direction: column;
      .s-c-t-general {
        display: flex;
        align-items: flex-end;
        gap: 0.5rem;
        h1 {
          color: var(--white);
          font-weight: 450;
        }
        span {
          background-color: #fb5663;
          color: var(--white);
          padding: 2px 4px;
          border-radius: 5px;
          font-size: clamp(5px, 8vw, 12px);
          line-height: 1rem;
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

    .s-content-msg {
      display: none;
      .s-c-msg-header {
        color: var(--grey-2);
        padding: 2px 6px;
        border-radius: 8px;
        font-size: clamp(5px, 8vw, 12px);
        margin-bottom: 0.8rem;
      }
      .s-c-msg-items {
        height: 200px;
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
      @include md {
        display: block;
      }
    }
  }
  .s-content-welcome {
    height: 180px;
    padding: 1rem 1.8rem;
   
    .msg-i-item {
      height: 100%;
      background-color: #1b1f22;
      padding: 1.5rem;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    
      h4 {
        color: var(--white);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 160px;
      }      
      p {
        margin-top: 0.8rem;
        color: var(--grey-2);
        font-size: clamp(5px, 8vw, 12px);
      }
    }
  }
  .sidebar-footer {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1.8rem 0.5rem 1.8rem;
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
        transition: all 0.25s ease-out;
        h4 {
          color: var(--white);
          font-weight: normal;
        }
        svg {
          fill: transparent;
          stroke-width: 1.7;
          width: 1.4rem;
          height: 1.4rem;
        }
        &:hover {
          background-color: #1b1f22;
        }
      }
    }
    span {
      color: var(--grey-2);
      font-size: clamp(5px, 8vw, 12px);
    }
  }
  @include md {
    display: flex;
    border-radius: 20px;
    position: sticky;
    height: calc(100vh - 4px);
  }
}

.nav-select {
  display: grid;
  place-items: center;
  color: var(--secundary);

  svg {
    width: 1.4rem;
    height: 1.4rem;
    color: var(--grey-light-3);
    fill: transparent;
    stroke-width: 1.7;
  }
}

.router-link-active,
.router-link-exact-active {
  background-color: var(--primary) !important;
  svg {
    color: var(--white) !important;
  }
  span {
    color: var(--white) !important;
  }
}

.s-content-menu {
  flex: 1 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  padding-top: 2rem;
  .s-c-menu-details {
    width: 100%;
    .nav-select-grouped {
      display: flex;
      align-items: center;
      color: var(--secundary);
      padding: 0.7rem 1rem;
      gap: 0.8rem;
      height: 40px;
      cursor: pointer;
      border-radius: 8px;
      position: relative;
      svg {
        width: 1.4rem;
        height: 1.4rem;
        color: var(--grey-light-3);
        fill: transparent;
        stroke-width: 1.7;
      }
      span {
        color: var(--grey-light-3);
        font-size: clamp(5px, 8vw, 13px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 160px;
        font-weight: 400;
      }
      &::before {
        content: "";
        position: absolute;
        right: 20px;
        top: 50%;
        width: 0.3em;
        height: 0.3em;
        border: solid var(--grey-light-3);
        border-width: 0 0.1em 0.1em 0;
        transform: rotate(45deg) translate(-50%, -50%);
      }
      &:hover {
        background-color: var(--secondary);
        svg {
          color: var(--white) !important;
        }
        span {
          color: var(--white) !important;
        }
      }
    }
    .nav-subitems {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      position: relative;
      z-index: 2;
      li {
        width: calc(100% - 40px);

        .nav-subitems-item {
          width: 100%;
          height: 40px;
          cursor: pointer;
          border-radius: 8px;
          padding: 0.7rem 1rem;
          transition: all 0.25s ease-in-out;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background-color: #0f1217;

          span {
            color: var(--grey-light-3);
            font-size: clamp(5px, 8vw, 13px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 160px;
            font-weight: 400;
          }
          &:hover {
            background-color: var(--secondary);
            span {
              color: var(--white) !important;
            }
          }
        }
      }
      &::before {
        content: "";
        position: absolute;
        z-index: -1;
        left: 25px;
        top: 0;
        width: 20px;
        height: calc(100% - 20px);
        border-radius: 0 0 0 8px;
        border: solid var(--grey-light-3);
        border-width: 0 0 0.1em 0.1em;
        opacity: 0.4;
      }
    }
    .nav-select-only {
      width: 100%;
      height: 40px;
      cursor: pointer;
      border-radius: 8px;
      padding: 0.7rem 1rem;
      transition: all 0.25s ease-in-out;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      svg {
        width: 1.4rem;
        height: 1.4rem;
        color: var(--grey-light-3);
        fill: transparent;
        stroke-width: 1.7;
      }
      span {
        color: var(--grey-light-3);
        font-size: clamp(5px, 8vw, 13px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 160px;
        font-weight: 400;
      }
      &:hover {
        background-color: var(--secondary);
        svg {
          color: var(--white) !important;
        }
        span {
          color: var(--white) !important;
        }
      }
    }
  }
}

details,
summary {
  list-style: none;
}
</style>
