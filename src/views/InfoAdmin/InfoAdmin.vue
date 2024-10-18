<template>
  <div class="containPage">
    <div class="titlePage">
      <!-- <h2>Profile</h2> -->
    </div>
    <div class="contentPage">
      <section class="h-100 gradient-custom-2">
        <div class="h-100">
          <div
            class="row d-flex justify-content-center align-items-center h-100"
          >
            <div class="col">
              <div class="card">
                <div class="rounded-top text-white d-flex flex-row bgProfile">
                  <div
                    class="mt-5 d-flex flex-column"
                    style="width: 100px; height: 100px; margin-left: 20px"
                  >
                    <img
                      :src="data.PHOTO_URL"
                      alt="Generic placeholder image"
                      class="img-fluid img-thumbnail mt-4 mb-2"
                      style="width: 100%; z-index: 1"
                    />

                    <router-link
                      to="/admin/editprofile"
                      style="z-index: 1"
                      class="btn btn-edit"
                    >
                      <button type="button" data-mdb-ripple-color="dark">
                        Chỉnh sửa
                      </button>
                    </router-link>
                  </div>
                  <div class="" style="margin-top: 130px; margin-left: 10px">
                    <h5>{{ data.FULLNAME }}</h5>
                    <!-- <p>{{ data.DiaChi }}</p> -->
                  </div>
                </div>
                <div class="p-3 text-black" style="background-color: #f8f9fa">
                  <div class="d-flex justify-content-end text-center py-1">
                    <!-- {{ data.ChucVu }} -->
                  </div>
                </div>
                <div class="card-body text-black">
                  <div class="mb-5">
                    <p class="lead fw-normal mb-1">Thông tin cá nhân</p>
                    <div class="" style="background-color: #f8f9fa">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-sm-3">
                            <p class="mb-0">Họ tên</p>
                          </div>
                          <div class="col-sm-9">
                            <p class="text-muted mb-0">
                              {{ data.FULLNAME }}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div class="row">
                          <div class="col-sm-3">
                            <p class="mb-0">Số điện thoại</p>
                          </div>
                          <div class="col-sm-9">
                            <p class="text-muted mb-0">
                              {{ data.PHONE_NUMBER }}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div class="row">
                          <div class="col-sm-3">
                            <p class="mb-0">Email</p>
                          </div>
                          <div class="col-sm-9">
                            <p class="text-muted mb-0">{{ data.EMAIL }}</p>
                          </div>
                        </div>
                        <hr />
                        <div class="row">
                          <div class="col-sm-3">
                            <p class="mb-0">Chức Vụ</p>
                          </div>
                          <div class="col-sm-9">
                            <p class="text-muted mb-0">
                              {{ activeRoles.join(", ") }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/userStore";

const data = ref({});
const userStore = useUserStore();
const router = useRouter();
const token = localStorage.getItem("Token");
// Biến chứa các vai trò đang hoạt động (có giá trị true)
const activeRoles = ref([]);

// Hàm để lọc các vai trò có giá trị true
const getActiveRoles = (roles) => {
  return Object.keys(roles).filter((key) => roles[key] === true);
};
const fetchUserProfile = () => {
  if (!token) {
    toast.error("Không tìm thấy token, vui lòng đăng nhập lại.");
    router.push("/login");
    return;
  }

  // Gọi API lấy thông tin người dùng với token từ localStorage
  axios
    .post("http://localhost:3000/users/profileUser", null, {
      headers: {
        Authorization: `Bearer ${token}`, // Truyền token vào header
      },
    })
    .then((res) => {
      if (res.data) {
        data.value = res.data;
        activeRoles.value = getActiveRoles(data.value.ROLE); // Lọc các vai trò
        console.log(data.value.FULLNAME);
        const ID_User = data._id;
        const Fullname = data.FULLNAME;
        const Email = data.EMAIL;
        const Avatar = data.PHOTO_URL;
        const Role = data.ROLE;
        const PhoneNumber = data.PHONE_NUMBER;

        // Lưu thông tin vào localStorage nếu cần
        localStorage.setItem("ID_User", ID_User);
        localStorage.setItem("Fullname", Fullname);
        localStorage.setItem("Email", Email);
        localStorage.setItem("Avatar", Avatar);
        localStorage.setItem("Role", JSON.stringify(Role));
        localStorage.setItem("PhoneNumber", PhoneNumber);

        toast.success("Lấy thông tin người dùng thành công!");
      }
    })
    .catch((error) => {
      toast.error("Lỗi khi lấy thông tin người dùng!");
      console.error("Error fetching user profile:", error);
    });
};

// Gọi API lấy profile khi component được mounted
onMounted(() => {
  fetchUserProfile();
});

const showPassword = ref(false);
const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const phoneOrEmail = ref("");
const password = ref("");

const login = () => {
  const formData = {
    password: password.value,
  };

  const isPhoneNumber = /^\d+$/.test(phoneOrEmail.value);

  if (isPhoneNumber) {
    formData.phone = phoneOrEmail.value;
  } else {
    formData.email = phoneOrEmail.value;
  }

  axios
    .post("http://localhost:3000/users/loginUser", formData)
    .then((res) => {
      if (!res.data.success) {
        toast.error("Đăng nhập thất bại!");
      } else {
        const ID_User = data._id;
        const Fullname = data.FULLNAME;

        const Email = data.EMAIL;
        const Avatar = data.PHOTO_URL;
        const Role = data.ROLE;
        const token = res.data.metadata;

        // Lưu thông tin vào localStorage
        localStorage.setItem("ID_User", ID_User);
        localStorage.setItem("Fullname", Fullname);
        localStorage.setItem("Email", Email);
        localStorage.setItem("Avatar", Avatar);
        localStorage.setItem("Role", JSON.stringify(Role));
        localStorage.setItem("Token", token);

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
@import "./InfoAdmin.scss";
</style>
