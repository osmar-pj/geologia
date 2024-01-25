import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store/store'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/login', name: 'Login', component: () => import('../auth/Login.vue')},
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound.vue') },
        { path: '/home', name: 'Home', component: () => import('../views/Home.vue'), children: [
            { path: '/', name: 'Dashboard', component: () => import('../views/Dashboard.vue'), meta: { requireAuth: true } },
            { path: '/list', name: 'List', component: () => import('../views/List.vue'), meta: { requireAuth: true } },
            { path: '/oreControl', name: 'OreControl', component: () => import('../views/OreControl.vue'), meta: { requireAuth: true } },
            { path: '/controlCalidad', name: 'ControlCalidad', component: () => import('../views/ControlCalidad.vue'), meta: { requireAuth: true } },
            // { path: '/programacion', name: 'Programacion', component: () => import('../views/Programacion.vue'), meta: { requireAuth: true } },
            { path: '/ruma', name: 'Ruma', component: () => import('../views/Ruma.vue'), meta: { requireAuth: true } },
            { path: '/map', name: 'Map', component: () => import('../views/Map.vue'), meta: { requireAuth: true } },
            { path: '/planta', name: 'Planta', component: () => import('../views/planta.vue'), meta: { requireAuth: true } },
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