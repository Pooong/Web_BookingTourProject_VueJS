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
import Customer from "@/views/Customer/Customer.vue";
import EditTour from "@/views/EditTour/EditTour.vue";
import RevenueStatistics from "@/views/RevenueStatistics/RevenueStatistics.vue";
import Chat from "../components/Chat/Chat.vue";
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
    path: "/admin/edit-tour/:id",
    component: EditTour,
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
  {
    path: "/admin/customer",
    component: Customer,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/admin/revenue-statistics",
    component: RevenueStatistics,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/chat",
    component: Chat,
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
