import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store/store'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/login', name: 'Login', component: () => import('../auth/Login.vue')},
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound.vue') },
        { path: '/home', name: 'Home', component: () => import('../views/Home.vue'), children: [
            { path: '/analysis', name: 'analysis', component: () => import('../views/Analysis.vue'), meta: { requireAuth: true } },
            { path: '/cancha', name: 'Cancha', component: () => import('../views/Cancha.vue'), meta: { requireAuth: true } },
            { path: '/oreControl', name: 'OreControl', component: () => import('../views/OreControl.vue'), meta: { requireAuth: true } },
            { path: '/controlCalidad', name: 'ControlCalidad', component: () => import('../views/ControlCalidad.vue'), meta: { requireAuth: true } },
            { path: '/pila', name: 'Pila', component: () => import('../views/Pila.vue'), meta: { requireAuth: true } },
            { path: '/', name: 'Map', component: () => import('../views/Map.vue'), meta: { requireAuth: true } },
            { path: '/planta', name: 'Planta', component: () => import('../views/planta.vue'), meta: { requireAuth: true } },
            { path: '/setting', name: 'Configuracion', component: () => import('../views/setting.vue'), meta: { requireAuth: true } },
            { path: '/analysisP', name: 'Analisis Planta', component: () => import('../views/analysisP.vue'), meta: { requireAuth: true } },
        ] },
    ]
})

 router.beforeEach((to, from, next) => {
     const requireAuth = to.matched.some(record => record.meta.requireAuth)
     const user = store.state.user
     if (requireAuth && !user) {
         next('/login')
     } else if (to.path == '/login' && user) {
         next('/')
     } else {
         next()
     }
 })

export default router