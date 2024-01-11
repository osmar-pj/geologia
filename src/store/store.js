import { createStore } from 'vuex'
import { getLocalUser } from '../libs/storage'

const user = getLocalUser()
const url = import.meta.env.VITE_API_URL

const store = createStore({
    state: {
        name: 'Juan',
        user: user,
        dataList: []
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
            const response = await fetch(`${url}/oreControl`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "ngrok-skip-browser-warning": true
                }
            }) // cambiar la ruta a list
            const data = await response.json()
            commit('getList', data)
            console.log(data)
            // return data
        },
    },
    modules: {}
})

export default store