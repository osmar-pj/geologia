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
const isRouteActive = (routePath) => {
  // console.log("Ruta actual:", route.path);
  // console.log("Ruta comparada:", routePath);
  return route.path === routePath;
};

const store = useStore();
const active = ref("/");
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
    route: "analysis",
    items: [
      {
        name: "analysis",
        label: "Análisis",
        route: "analysis",
      },
      {
        name: "analysisP",
        label: "Análisis Planta",
        route: "analysisP",
      },
    ],
  },
  {
    name: "oreControl",
    label: "Ore Control",
    icon: IControl,
    route: "oreControl",
  },
  {
    name: "controlCalidad",
    label: "Control de Calidad",
    icon: CQuality,
    route: "controlCalidad",
  },
  {
    name: "list",
    label: "Viajes a Cancha",
    icon: IList,
    route: "list",
  },
  {
    name: "planta",
    label: "Viajes a Planta",
    icon: CQuality,
    route: "planta",
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

const items = ref([
  {
    label: "Mapa de Stock Piles",
    icon: markRaw(CRuma),
    command: () => {
      router.push("/");
    },
  },
  {
    label: "Análisis",
    icon: markRaw(IControl),
    items: [
      {
        label: "Producción",

        route: "/analysis",
      },
      {
        label: "Planta",

        route: "/analysisP",
      },
    ],
  },
  {
    label: "Completar",
    icon: markRaw(IList),
    items: [
      {
        label: "Ore Control",

        route: "/oreControl",
      },
      {
        label: "Control de Calidad",

        route: "/controlCalidad",
      },
    ],
  },
  {
    label: "Viajes",
    icon: markRaw(IList),
    items: [
      {
        label: "Cancha",
        route: "/list",
      },
      {
        label: "Planta",
        route: "/planta",
      },
    ],
  },
  {
    label: "Stock Piles de Cancha",
    icon: markRaw(CQuality),
    command: () => {
      router.push("/pila");
    },
  },
  {
    label: "Configuración",
    icon: markRaw(ISetting),
    command: () => {
      router.push("/setting");
    },
  },
]);
const goToPage = (page) => {
  router.push(page);
  active.value = page;
};
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
            <strong>{{ items.length }}</strong> items
          </span>
          <span> <strong>• 3</strong> principales </span>
        </div>
      </div>

      <ul class="s-content-menu">
        <li v-for="menuItem in menuItems" :key="menuItem.name">
          <router-link v-if="!menuItem.items" :to="menuItem.route">
            <div class="nav-select">
              <component :is="menuItem.icon" />
            </div>
            <span>{{ menuItem.label }}</span>
          </router-link>
          <div v-else>
            <div class="nav-select">
              <component :is="menuItem.icon" />
            </div>
            <span>{{ menuItem.label }}</span>
            <ul>
              <li v-for="subItem in menuItem.items" :key="subItem.name">
                <router-link :to="subItem.route">
                  {{ subItem.label }}
                </router-link>
              </li>
            </ul>
          </div>
        </li>
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
        font-size: clamp(7px, 8vw, 16px);
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

.sp-acti {
  background-color: var(--secondary);
}

.active {
  background-color: rebeccapurple;
}

.sp-desact {
  opacity: 0.4;
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
    padding: 0.7rem 1.2rem;
    width: 100%;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    min-height: 40px;
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
      opacity: 1;
      background-color: var(--secondary);
    }
  }
}
</style>
