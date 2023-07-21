import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        // 设置初始页面
        path: '',
        redirect: '/cesium-gis',
    },
    {
        path: '/cesium-gis',
        name: 'resource',
        title: '3D地图',
        meta: {
            title: '3D地图',
            auth: true
        },
        component: () => import('@/views'),
    },
]

const router = new VueRouter({
    mode: 'history',
    routes,
});

export default router;
