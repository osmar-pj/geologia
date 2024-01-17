import { createStore } from 'vuex'
import { getLocalUser } from '../libs/storage'

const user = getLocalUser()
const url = import.meta.env.VITE_API_URL

const store = createStore({
    state: {
        name: 'Juan',
        user: user,
        dataList: [],
        dataListControl: [],
        dataListGeneral: [],
        rumaList: [],
        rumaTotal: [],
        tajoList: [],
        userModal: null,
        errior: null,
        loading: false
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
        }
    },
    actions: {
        auth_login: async ({ commit }, payload) => {
            const response = await fetch(`${url}/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({code: payload})
            })
            const data = await response.json()
            if (!data.status) return
            const user = Object.assign({}, data)
            localStorage.setItem('user', JSON.stringify(user))
            commit('authLogin', data)
        },
        auth_logout: ({ commit }) => {
            localStorage.removeItem('user')
            commit('authLogout')
        },
        get_list: async ({ commit }) => {
            try {
                // cargar el loading true
                const response = await fetch(`${url}/triplist`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "ngrok-skip-browser-warning": true
                    }
                })
                const data = await response.json()
                // quitar el loading false
                commit('getList', data)
            } catch (error) {
                // quitar el loadinng false
            }
        },
        get_listControl: async ({ commit }) => {
            const response = await fetch(`${url}/QualityControl`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "ngrok-skip-browser-warning": true
                }
            })
            const data = await response.json()     
             
            commit('getListControl', data)
        },
        get_listGeneral: async ({ commit }) => {
            const response = await fetch(`${url}/general`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "ngrok-skip-browser-warning": true
                }
            })
            const data = await response.json()
                                     
            commit('getListGeneral', data)
        },
        ruma_list: async ({ commit }) => {
            const response = await fetch(`${url}/ruma`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "ngrok-skip-browser-warning": true
                }
            }) 
            const data = await response.json()                      
               
            commit('getRuma', data)
        },
        ruma_total: async ({ commit }) => {
            const response = await fetch(`${url}/rumaList`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "ngrok-skip-browser-warning": true
                }
            }) 
            const data = await response.json()                      
               
            commit('getRumaTotal', data)
        },
        tajo_list: async ({ commit }) => {
            const response = await fetch(`${url}/tajoGeo`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "ngrok-skip-browser-warning": true
                }
            }) 
            const data = await response.json()
            commit('getTajo', data)
        },
    },
    modules: {}
})

export default store