import { createStore } from "vuex";
import { getLocalUser } from "../libs/storage";

const user = getLocalUser();
const url = import.meta.env.VITE_API_URL;

const store = createStore({
  state: {
    user: user,
    dataList: [],
    dataListControl: [],
    dataListGeneral: [],
    rumaList: [],
    rumaTotal: [],
    tajoList: [],
    userModal: null,
    errior: null,
    loading: false,
  },
  mutations: {
    authLogin(state, payload) {
      state.user = payload
    },
    authLogout(state) {
      state.user = null
    },
    getList(state, payload) {
      state.dataList = payload
    },
    getListControl(state, payload) {
      state.dataListControl = payload
    },
    getListGeneral(state, payload) {
      state.dataListGeneral = payload
    },
    getRuma(state, payload) {
      state.rumaList = payload
    },
    getTajo(state, payload) {
      state.tajoList = payload
    },
    getRumaTotal(state, payload) {
      state.rumaTotal = payload
    },
    loading(state, payload) {
      state.loading = payload
    },
  },
  actions: {
    auth_login: async ({ commit }, payload) => {
      const response = await fetch(`${url}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: payload }),
      });
      const data = await response.json();
      if (!data.status) return;
      const user = Object.assign({}, data);
      localStorage.setItem("user", JSON.stringify(user));
      commit("authLogin", data);
    },
    auth_logout: ({ commit }) => {
      localStorage.removeItem("user");
      commit("authLogout");
    },
    get_list: async ({ commit }) => {
      try {
        commit("loading", true);
        const response = await fetch(`${url}/triplist`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        });
        const data = await response.json();
        commit("getList", data);
        commit("loading", false);
      } catch (error) {
        // quitar el loadinng false
      }
    },
    get_listControl: async ({ commit }) => {
      try {
        commit("loading", true);
        const response = await fetch(`${url}/QualityControl`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        });
        const data = await response.json();
        console.log(data);
        commit("getListControl", data);
        commit("loading", false);
      } catch (error) {
      
      }
    },
    get_listGeneral: async ({ commit }) => {
      try {
        commit("loading", true);
        const response = await fetch(`${url}/general`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        });
        const data = await response.json();
  
        commit("getListGeneral", data);
        commit("loading", false);
      }  catch (error) {
      
      }
    },
    ruma_list: async ({ commit }) => {
      try {
        const response = await fetch(`${url}/ruma`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        });
        const data = await response.json();
  
        commit("getRuma", data);
      }  catch (error) {
      
      }
    },
    ruma_total: async ({ commit }) => {
      try {
        const response = await fetch(`${url}/rumaList`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        });
        const data = await response.json();
  
        commit("getRumaTotal", data);
      }  catch (error) {
      
      }
    },
    tajo_list: async ({ commit }) => {
      try {
        const response = await fetch(`${url}/tajoGeo`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        });
        const data = await response.json();
        commit("getTajo", data);
      }  catch (error) {
      
      }
    },
  },
  modules: {},
});

export default store;
