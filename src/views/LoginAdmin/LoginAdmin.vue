<template>
  <div class="containPage">
    <section>
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col col-xl-10">
            <div class="card loginForm">
              <div class="row g-0">
                <div class="col-md-6 col-lg-6 d-flex align-items-center">
                  <div class="card-body p-4 p-lg-5 text-black">
                    <form @submit.prevent="login">
                      <div class="d-flex align-items-center mb-3 pb-1">
                        <div class="logo">
                          <img src="../../assets/plane.png" alt="" />
                          <span class="titleWeb"
                            >GO<span class="text-dark">EXPLORE</span></span
                          >
                        </div>
                      </div>

                      <div class="fw-normal pb-2 desLogin">
                        Bạn đang đăng nhập với quyền Admin !!!
                      </div>

                      <div class="group">
                        <label for="phoneOrEmail"
                          ><i class="fa-solid fa-phone iconForm"></i
                        ></label>
                        <input
                          type="text"
                          id="phoneOrEmail"
                          class="groupInput"
                          v-model="phoneOrEmail"
                          name="phoneOrEmail"
                          autocomplete="off"
                          placeholder="Nhập số điện thoại hoặc Email"
                          required
                        />
                      </div>

                      <div class="group2">
                        <label for="password"
                          ><i class="fa-solid fa-lock iconForm"></i
                        ></label>
                        <input
                          :type="showPassword ? 'text' : 'password'"
                          v-model="password"
                          name="PASSWORD"
                          id="PASSWORD"
                          class="groupInput"
                          autocomplete="off"
                          placeholder="Nhập mật khẩu"
                          required
                        />
                        <div @click="toggleShowPassword" class="iconPassword">
                          <div v-if="showPassword">
                            <i class="fa-solid fa-eye"></i>
                          </div>
                          <div v-else>
                            <i class="fa-solid fa-eye-slash"></i>
                          </div>
                        </div>
                      </div>
                      <div class="pt-1 mb-4">
                        <button class="btnPay">Login</button>
                      </div>
                    </form>
                  </div>
                </div>
                <div class="col-md-6 col-lg-6 d-none d-md-block m-auto">
                  <img
                    src="../../assets/travelbanner.jpg"
                    alt="login form"
                    class="imageLogin"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup>
import axios from "axios";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/userStore";

const userStore = useUserStore();
const router = useRouter();
const phoneOrEmail = ref("");
const password = ref("");
const showPassword = ref(false);

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const login = () => {
  const formData = {
    PASSWORD: password.value,
  };

  // Kiểm tra nếu phoneOrEmail chứa số thì là số điện thoại, ngược lại là email
  const isPhoneNumber = /^\d+$/.test(phoneOrEmail.value);

  if (isPhoneNumber) {
    formData.PHONE_NUMBER = phoneOrEmail.value;
  } else {
    formData.EMAIL = phoneOrEmail.value;
  }

  axios
    .post("http://localhost:3000/users/loginUser", formData)
    .then((res) => {
      if (!res.data.success) {
        toast.error("Đăng nhập thất bại!");
      } else {
        const data = res.data.message;
        const ID_User = data._id;
        const Fullname = data.FULLNAME;
        const Email = data.EMAIL;
        const Avatar = data.PHOTO_URL;
        const Role = data.ROLE;
        const token = res.data.metadata;
        const isLogin = true;
        // Lưu thông tin vào localStorage
        localStorage.setItem("ID_User", ID_User);
        localStorage.setItem("Fullname", Fullname);
        localStorage.setItem("Email", Email);
        localStorage.setItem("Avatar", Avatar);
        localStorage.setItem("Role", JSON.stringify(Role));
        localStorage.setItem("isLogin", isLogin);
        localStorage.setItem("Token", token);

        // Chuyển hướng về trang quản lý Admin
        router.push("/admin/home");
      }
    })
    .catch((error) => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      console.error("Error during login:", error);
    });
};
</script>
<style lang="scss" scoped>
@import "./LoginAdmin.scss";
</style>
