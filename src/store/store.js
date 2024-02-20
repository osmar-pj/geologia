import { createStore } from "vuex"
import { getLocalUser } from "../libs/storage"

const user = getLocalUser()
const url = import.meta.env.VITE_API_URL

const store = createStore({
  state: {
    user: user,
    weights: [],
    // canvas: null,
    dataList: [],
    dataListControl: [],
    dataListGeneral: [],
    dataListFilters: [],
    dataFilterPlanta: [],
    dataFilterTable: [],
    dataSelectedFilters: [],
    dataAnalysis: [],
   
    tajoList: [],
    pilaList: [],
    rumaTotal: [],
    userModal: null,
    errior: null,
    loading: false,
    colquicocha_stock: 0,
    cancha1_stock: 0,
    cancha2_stock: 0,
  },
  getters: {
    get_data_analysis: (state) => {
      const dataAg = state.dataAnalysis.map((i) => {
        return {
          x: new Date(i.timestamp * 1000),
          y: i.Ag,
        }
      })
      const dataLey_prog = state.dataAnalysis.map((i) => {
        return {
          x: new Date(i.timestamp * 1000),
          y: i.ley_prog,
        }
      })
      const tonh = state.dataAnalysis.map((i) => {
        return {
          x: new Date(i.timestamp * 1000),
          y: i.tonh,
        }
      })
      const ton_prog = state.dataAnalysis.map((i) => {
        return {
          x: new Date(i.timestamp * 1000),
          y: i.ton_prog,
        }
      })
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
      ]
      return series
    },
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
    getPila(state, payload) {
      state.pilaList = payload
    },
    getTajo(state, payload) {
      state.tajoList = payload
    },
    getRumaTotal(state, payload) {
      state.rumaTotal = payload
    },
    getListFilters(state, payload) {
      state.dataListFilters = payload
    },
    getFilterTable(state, payload) {
      state.dataFilterTable = payload
    },
    getFilterPlanta(state, payload) {
      state.dataFilterPlanta = payload
    },
    getSelectedFilters(state, payload) {
      state.dataSelectedFilters = payload
    },
    getDataAnalysis(state, payload) {
      state.dataAnalysis = payload
    },
    loading(state, payload) {
      state.loading = payload
    },
    // ADD to list of trips
    addDataGeneralList(state, payload) {
      state.dataFilterTable.data.unshift(payload)
    },
    addDataListOreControl(state, payload) {
      state.dataList.data.push(payload)
    },
    addDataListControlCalidad(state, payload) {
      state.dataListControl.push(payload)
    },
    lesstDataListControlCalidad(state, payload) {
      state.dataListControl.slice(payload, 1)
    },
    setWeights(state, payload) {
      state.colquicocha_stock = payload.filter(i => i.ubication === "Cancha Colquicocha").reduce((acc, i) => acc + i.stock, 0)
      state.cancha1_stock = payload.filter(i => i.ubication === "Cancha 1").reduce((acc, i) => acc + i.stock, 0)
      state.cancha2_stock = payload.filter(i => i.ubication === "Cancha 2").reduce((acc, i) => acc + i.stock, 0)
    },
    // ADD to general list of pilas
    addDataPilaList(state, payload) {
      state.pilaList.data.unshift(payload)
    },
    // ADD to ruma list of pilas inMap
    addDataRumaList(state, payload) {
      state.rumaTotal.unshift(payload)
    },
    lessDataRumaList(state, payload) {
      state.rumaTotal.slice(payload, 1)
    }
  },
  actions: {
    auth_login: async ({ commit }, payload) => {
      try {
        commit("loading", true)
        const response = await fetch(`${url}/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: payload }),
        })
        const data = await response.json()
        console.log("Ingreso")
        if (data.status === true) {
          const user = Object.assign({}, data)
          localStorage.setItem("user", JSON.stringify(user))
          commit("authLogin", data)
        } else {
          commit("loading", false)
          return
        }
      } catch {
        commit("loading", false)
      }
      
    },
    auth_logout: ({ commit }) => {
      localStorage.removeItem("user")
      commit("authLogout")
    },
    get_list: async ({ commit }) => {
      try {
        commit("loading", true)
        const response = await fetch(`${url}/OreControl`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        })
        const data = await response.json()
        console.log(data)  
        commit("getList", data)
        commit("loading", false)
      } catch (error) {commit("loading", false)}
    },
    get_listControl: async ({ commit }) => {
      try {
        commit("loading", true)
        const response = await fetch(`${url}/QualityControl`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        })
        const data = await response.json()
        console.log(data)       
        commit("getListControl", data)
        commit("loading", false)
      } catch (error) {commit("loading", false)}
    },
    get_listGeneral: async ({ commit }) => {
      try {
        commit("loading", true)
        const response = await fetch(`${url}/general`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        })
        const data = await response.json()
        console.log(data)      
        commit("getListGeneral", data)
        commit("loading", false)
      } catch (error) {commit("loading", false)}
    },
    get_listFilters: async ({ commit }) => {
      try {
        commit("loading", true)
        const response = await fetch(`${url}/listgeology`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        })
        const data = await response.json()
        commit("getListFilters", data)
          console.log(data)
        commit("loading", false)
      } catch (error) {commit("loading", false)}
    },
    pila_list: async ({ commit }) => {
      try {
        commit("loading", true)
        const response = await fetch(`${url}/pila`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        })
        const data = await response.json()
        console.log(data)       
        commit("getPila", data)
        commit("loading", false)
      } catch (error) { commit("loading", false)}
    },
    pila_total: async ({ commit }) => {
      try {
        const response = await fetch(`${url}/pila`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        })
        const data = await response.json()
        commit("getRumaTotal", data.pilasToMap)
        commit("setWeights", data.pilasToMap)
      } catch (error) {commit("loading", false)}
    },
    ruma_update: async ({ commit }, data) => {
      try {
        const response = await fetch(`${url}/pilamap/${data.pila._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data.data),
        })
        const dataResponse = await response.json()
        // commit("getRumaTotal", dataResponse.rumas)
      } catch (error) {commit("loading", false)}
    },
    tajo_list: async ({ commit }) => {
      try {
        const response = await fetch(`${url}/tajo`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        })
        const data = await response.json()
        commit("getTajo", data)
      } catch (error) {commit("loading", false)}
    },
    filter_list: async ({ commit }, data) => {
      commit("getFilterTable", data)
    },
    filter_Planta: async ({ commit }, data) => {
      commit("getFilterPlanta", data)
    },
    selected_filters: async ({ commit }, data) => {
      commit("getSelectedFilters", data)
    },
    data_analysis: async ({ commit }, data) => {
      try {
        commit("getDataAnalysis", data)
      } catch (error) {commit("loading", false)}
    },
    get_listPlanta: async ({ commit }) => {
      try {
        const response = await fetch(`${url}/planta`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        })
        const data = await response.json()
        commit("getListPlanta", data)
      } catch (error) {commit("loading", false)}
    }
  },
  modules: {},
})

export default store
