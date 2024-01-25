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
    dataListFilters: [],
    dataFilterTable: [],
    dataSelectedFilters: [],
    dataAnalysis: [],
    rumaList: [],
    rumaTotal: [],
    tajoList: [],
    userModal: null,
    errior: null,
    loading: false,
  },
  getters: {
    get_data_analysis: (state) => {
      const dataAg = state.dataAnalysis.map((i) => {
        return {
          x: new Date(i.timestamp * 1000),
          y: i.Ag,
        };
      });
      const dataLey_prog = state.dataAnalysis.map((i) => {
        return {
          x: new Date(i.timestamp * 1000),
          y: i.ley_prog,
        };
      });
      const tonh = state.dataAnalysis.map((i) => {
        return {
          x: new Date(i.timestamp * 1000),
          y: i.tonh,
        };
      });
      const ton_prog = state.dataAnalysis.map((i) => {
        return {
          x: new Date(i.timestamp * 1000),
          y: i.ton_prog,
        };
      });
      const series = [
        {
          name: "Ley de Ag",
          type: "line",
          data: dataAg,
        },
        {
          name: "Ley de Ag Prog.",
          type: "line",
          data: dataLey_prog,
        },
        {
          name: "Tonelada",
          type: "column",
          data: tonh,
        },
        {
          name: "Tonelada Prog",
          type: "column",
          data: ton_prog,
        },
      ];
      return series;
    },
  },
  mutations: {
    authLogin(state, payload) {
      state.user = payload;
    },
    authLogout(state) {
      state.user = null;
    },
    getList(state, payload) {
      state.dataList = payload;
    },
    getListControl(state, payload) {
      state.dataListControl = payload;
    },
    getListGeneral(state, payload) {
      state.dataListGeneral = payload;
    },
    getRuma(state, payload) {
      state.rumaList = payload;
    },
    getTajo(state, payload) {
      state.tajoList = payload;
    },
    getRumaTotal(state, payload) {
      state.rumaTotal = payload;
    },
    getListFilters(state, payload) {
      state.dataListFilters = payload;
    },
    getFilterTable(state, payload) {
      state.dataFilterTable = payload;
    },
    getSelectedFilters(state, payload) {
      state.dataSelectedFilters = payload;
    },
    getDataAnalysis(state, payload) {
      state.dataAnalysis = payload;
    },
    loading(state, payload) {
      state.loading = payload;
    },
    addDataListOreControl(state, payload) {
      state.dataList.push(payload);
    },
    addDataListControlCalidad(state, payload) {
      state.dataListControl.push(payload);
    },
    lesstDataListControlCalidad(state, payload) {
      state.dataListControl.slice(payload, 1);
    },
  },
  actions: {
    auth_login: async ({ commit }, payload) => {
      try {
        commit("loading", true);
        const response = await fetch(`${url}/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: payload }),
        });
        const data = await response.json();
        console.log("Ingreso");
        if (data.status === true) {
          const user = Object.assign({}, data);
          localStorage.setItem("user", JSON.stringify(user));
          commit("authLogin", data);
        } else {
          commit("loading", false);
          return;
        }
      } catch {
        commit("loading", false);
      }
      
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
        console.log(data);
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
        commit("getListControl", data);
        commit("loading", false);
      } catch (error) {}
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
      } catch (error) {}
    },
    get_listFilters: async ({ commit }) => {
      try {
        commit("loading", true);
        const response = await fetch(`${url}/listgeology`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        });
        const data = await response.json();
        commit("getListFilters", data);
        commit("loading", false);
      } catch (error) {}
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
      } catch (error) {}
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
        console.log(data);
        commit("getRumaTotal", data.rumas);
      } catch (error) {}
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
      } catch (error) {}
    },
    filter_list: async ({ commit }, data) => {
      commit("getFilterTable", data);
    },
    selected_filters: async ({ commit }, data) => {
      commit("getSelectedFilters", data);
    },
    data_analysis: async ({ commit }, data) => {
      try {
        commit("getDataAnalysis", data);
      } catch (error) {
        console.log(error);
      }
    },
  },
  modules: {},
});

export default store;
