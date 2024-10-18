<template>
  <nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <div class="infoUser d-flex ml-auto">
        <div v-if="isUserLoggedIn()" class="contentInfo">
          <img :src="imageUser" class="imageUser" alt="" />
          <span class="nameUser ml-1">
            {{ username }}
          </span>
          <i class="fa-solid fa-user-tie iconHeader"></i>
          <span class="nameUser mr-0 ml-1">
            {{ position }}
          </span>
        </div>
        <div v-else>
          <router-link to="/admin/login" class="text-decoration-none">
            <button class="btnLogin">Đăng nhập</button>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const isUserLoggedIn = () => {
  return localStorage.getItem("isLogin") === "true";
};
const username = localStorage.getItem("Username");
const avatar = localStorage.getItem("Avatar");
const position = localStorage.getItem("Position");
const imageUser = `http://localhost:8082/${avatar}`;
</script>

<style lang="scss" scoped>
@import "AppHeaderAdmin.scss";
</style>
