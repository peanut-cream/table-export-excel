import { createRouter, createWebHistory } from "vue-router"
import layout from "@/components/layout/index.vue"
import HomeView from "@/views/Home/index.vue"
import Login from "@/views/Login/index.vue"
import { getToken } from "@/utils/auth"
export const homeRouter = [
  {
    path: "/",
    component: layout,
    redirect: "/index",
    meta: {
      name: "货单",
      hidden:false
    },
    children: [
      {
        path: "index",
        name: "home",
        component: HomeView
      }
    ]
  }
]
export const LoginRouter = [
  {
    path: "/login",
    component: Login,
    name: "login",
    meta: {
      name: "登录页"
    }
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...homeRouter, ...LoginRouter]
})
const whitePath = ["/login"]
router.beforeEach((to) => {
  const token = getToken()
  if (!token && !whitePath.includes(to.path)) {
    return { path: "/login",replace: true}
  }
})

export default router
