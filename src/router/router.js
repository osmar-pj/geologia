import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/login', name: 'Login', component: () => import('../auth/Login.vue')},
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound.vue') },
        { path: '/home', name: 'Home', component: () => import('../views/Home.vue'), children: [
            { path: '/', name: 'Dashboard', component: () => import('../views/Dashboard.vue')},
            { path: '/list', name: 'List', component: () => import('../views/List.vue'),  },
            { path: '/oreControl', name: 'OreControl', component: () => import('../views/OreControl.vue') },
            { path: '/controlCalidad', name: 'ControlCalidad', component: () => import('../views/ControlCalidad.vue') },
            { path: '/programacion', name: 'Programacion', component: () => import('../views/Programacion.vue') },
        ] },
    ]
})

export default router