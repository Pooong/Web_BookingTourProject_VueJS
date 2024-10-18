import { createWebHistory, createRouter } from "vue-router";
// Layouts
import AdminLayout from "../Layouts/AdminLayout/AdminLayout.vue";
// router Admin
import Admin from "@/views/Admin/Admin.vue";
import LoginAdmin from "@/views/LoginAdmin/LoginAdmin.vue";
import AuthLayout from "@/Layouts/AuthLayout/AuthLayout.vue";
import AboutAdmin from "@/views/AboutAdmin/AboutAdmin.vue";
import InfoAdmin from "@/views/InfoAdmin/InfoAdmin.vue";
import AddTour from "@/views/AddTourAdmin/AddTourAdmin.vue";

const routes = [
  // router Admin
  {
    path: "/admin/home",
    component: Admin,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/admin/login",
    component: LoginAdmin,
    meta: {
      layout: AuthLayout,
    },
  },
  {
    path: "/admin/about",
    component: AboutAdmin,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/admin/info",
    component: InfoAdmin,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/admin/add-tour",
    component: AddTour,
    meta: {
      layout: AdminLayout,
    },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
