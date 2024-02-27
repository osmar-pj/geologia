import { createStore } from "vuex"
import { getLocalUser } from "../libs/storage"
import { calculus } from "../libs/utils"

const user = getLocalUser()
const url = import.meta.env.VITE_API_URL

const store = createStore({
  state: {
    user: user,
    weights: [],
    // canvas: null,
    filtroAplicado: false,
    dataListOControl: [],
    dataListQControl: [],
    dataListGeneral: [],
    dataListCancha: [],
    dataFilterPlanta: [],
    dataFilterTable: [],
    dataSelectedFilters: [],
    dataTripsPlanta: [],
    dataAnalysis: [],
    tajoList: [],
    pilaList: [],
    rumaTotal: [],
    userModal: null,
    error: null,
    loading: false,
    config: [],
    panels: [],
  },
  mutations: {
    authLogin(state, payload) {
      state.user = payload
    },
    authLogout(state) {
      state.user = null
    },
    getOreControl(state, payload) {
      state.dataListOControl = payload
    },
    getQualityControl(state, payload) {
      state.dataListQControl = payload
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
    getListCancha(state, payload) {
      state.dataListCancha = payload
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
    filtroAplicado(state, payload) {
      state.filtroAplicado = payload
    },
    // ADD to list of trips
    addDataGeneralList(state, payload) {
      state.dataFilterTable.data.unshift(payload)
    },
    addDataListOreControl(state, payload) {
      state.dataListOControl.data.push(payload)
    },
    addDataListControlCalidad(state, payload) {
      state.dataListQControl.push(payload)
    },
    lesstDataListControlCalidad(state, payload) {
      state.dataListQControl.slice(payload, 1)
    },
    setWeights(state, payload) {
      const ubications = [
        "Cancha Colquicocha",
        "Cancha 1",
        "Cancha 2",
      ]
      const weights = ubications.map((u, index) => {
        return {
          ubication: u,
          total: calculus(payload.filter(i => (i.ubication === u && (i.statusPila === "waitBeginDespacho" || i.statusPila === "waitDateAbastecimiento"))), state.config.vp_ag, state.config.vp_pb, state.config.vp_zn),
          index: index
        }
      })
      state.panels = weights
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
    },
    getListPlanta(state, payload) {
      state.dataTripsPlanta = payload
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
    get_config: async ({ commit }) => {
      try {
        const response = await fetch(`${url}/config`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        })
        const data = await response.json()
        console.log(data)
        localStorage.setItem("config", JSON.stringify(data[0]))
        commit("config", data[0])
      } catch (error) {commit("loading", false)}
    },
    get_listOControl: async ({ commit }) => {
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
        commit("getOreControl", data)
       console.log(data)
        commit("loading", false)
      } catch (error) {commit("loading", false)}
    },
    get_listQControl: async ({ commit }) => {
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
        commit("getQualityControl", data)
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
    get_listCancha: async ({ commit }) => {
      try {
        commit("loading", true)
        const response = await fetch(`${url}/listGeneral`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        })
        const data = await response.json()
        commit("getListCancha", data)
          // console.log(data)
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
        commit("getPila", data.pilasToOreControl)
        
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
        return data.weights
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
