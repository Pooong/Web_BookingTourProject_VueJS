<template>
  <aside :class="`${is_expanded ? 'is-expanded' : ''}`">
    <div class="logo">
      <img :src="logoURL" alt="Vue" />
      <span class="titleWeb">GO<span class="text-dark">ADMIN</span></span>
    </div>
    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="ToggleMenu">
        <span class="material-icons"
          ><i class="fa-solid fa-angles-right fa-xs"></i
        ></span>
      </button>
    </div>
    <h3>Menu</h3>
    <div class="menu">
      <router-link to="/admin/home" class="button">
        <span class="material-icons"
          ><i class="fa-solid fa-house icon"></i
        ></span>
        <span class="text">Trang chủ</span>
      </router-link>
      <router-link to="/admin/about" class="button">
        <span class="material-icons"
          ><i class="fa-solid fa-bell-concierge"></i
        ></span>
        <span class="text">Danh sách Tour</span>
      </router-link>
      <router-link to="/admin/customer" class="button">
        <span class="material-icons"><i class="fa-solid fa-users"></i></span>
        <span class="text">Khách hàng</span>
      </router-link>
      <router-link to="/admin/history" class="button">
        <span class="material-icons"><i class="fa-solid fa-clock"></i></span>
        <span class="text">Doanh thu</span>
      </router-link>
      <router-link v-if="isLogin" to="/admin/info" class="button">
        <span class="material-icons"><i class="fa-solid fa-user"></i></span>
        <span class="text">Profile</span>
      </router-link>
      <router-link v-else to="/admin/login" class="button">
        <span class="material-icons"><i class="fa-solid fa-user"></i></span>
        <span class="text">Trang cá nhân</span>
      </router-link>
    </div>
    <div class="flex"></div>
    <div class="menu" @click="showModal">
      <div class="button">
        <span class="material-icons"
          ><i class="fa-solid fa-right-from-bracket"></i
        ></span>
        <span class="text">Logout</span>
      </div>
      <a-modal
        title="Đăng xuất"
        :open="isModal"
        @ok="handleOk"
        @cancel="handleCancel"
        :ok-button-props="okButtonProps"
        okText="Đăng xuất"
        cancelText="Hủy"
      >
        <p>Bạn có chắc muốn đăng xuất khỏi hệ thống?</p>
      </a-modal>
    </div>
  </aside>
</template>
<script setup>
import { ref } from "vue";
import logoURL from "../../assets/logo.png";
import { Modal, Button } from "ant-design-vue";
import { useRouter } from "vue-router";
const router = useRouter();
const isLogin = localStorage.getItem("isLogin");
const is_expanded = ref(localStorage.getItem("is_expanded") === "true");
const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value;
  localStorage.setItem("is_expanded", is_expanded.value);
};
// Modal andt vue
const isModal = ref(false);
const okButtonProps = {
  style: {
    background: "red", // Đặt màu đỏ cho nút "OK"
  },
};
const showModal = () => {
  isModal.value = true;
};
const handleOk = () => {
  localStorage.clear();
  // localStorage.removeItem("isLogin");
  // localStorage.removeItem("Token");
  // localStorage.removeItem("Role");
  // localStorage.removeItem("PhoneNumber");
  // localStorage.removeItem("Avatar");
  // localStorage.removeItem("ID_User");
  // localStorage.removeItem("Username");
  // localStorage.removeItem("Position");
  // localStorage.removeItem("Address");
  isModal.value = false;
  router.push("/admin/login");
};
const handleCancel = () => {
  isModal.value = false;
};
</script>
<style lang="scss" scoped>
@import "SideBarAdmin.scss";
</style>
