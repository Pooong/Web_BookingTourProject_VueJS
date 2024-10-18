<template>
  <div class="containPage">
    <div class="titlePage d-flex">
      <div class="groupSearch">
        <input
          class="inputSearch"
          v-model="searchQuery"
          type="search"
          placeholder="Tìm kiếm tour"
          aria-label="Search"
        />
        <span @click="searchTours" class="iconSearch">
          <i class="fa-solid fa-magnifying-glass"></i>
        </span>
      </div>

      <div class="ml-auto">
        <!-- Nút Thêm Tour -->
        <button v-if="isLogin" @click="showModalAdd" class="btnAdd">
          <i class="fa-solid fa-plus"></i> Thêm Tour
        </button>
        <router-link to="/admin/login" v-else>
          <button @click="showModalAdd" class="btnAdd">
            <i class="fa-solid fa-mug-hot"></i> Thêm
          </button>
        </router-link>
      </div>
    </div>

    <div class="contentPage">
      <div class="row" v-if="data.length > 0">
        <div class="col-md-4" v-for="(item, index) in data" :key="index">
          <div class="item">
            <div class="leftItem">
              <img :src="item.IMAGES[0]" alt="Tour Image" class="imageItem" />
            </div>
            <div class="rightItem">
              <div class="dataItem">
                <span class="title">Tên tour:</span>
                <span class="content">{{ item.TOUR_NAME }}</span>
              </div>
              <div class="dataItem">
                <span class="title">Số ngày:</span>
                <span class="content"
                  >{{ item.CALENDAR_TOUR[0].NumberOfDay }} ngày</span
                >
              </div>
              <div class="dataItem">
                <span class="title">Phương tiện:</span>
                <span class="content">{{ item.VEHICLE }}</span>
              </div>
              <div class="dataItem">
                <span class="title">Giá mỗi người:</span>
                <span class="content">{{ item.PRICE_PER_PERSON }} VND</span>
              </div>
            </div>
            <div class="actionItem gap">
              <button
                @click="showModalUpdate(item)"
                :style="`${isLogin ? '' : 'display: none'}`"
                class="edit"
              >
                <i class="fa-regular fa-pen-to-square"></i> Cập nhật
              </button>

              <button
                @click="showModalDelete(item)"
                :style="`${isLogin ? '' : 'display: none'}`"
                class="remove"
              >
                <i class="fa-solid fa-trash iconRemove"></i> Xóa
              </button>
              <a-modal
                style="top: 40px"
                v-model:open="isModalDelete"
                title="Xóa tour"
                @ok="handleOkDelete"
                @cancel="handleCancelDelete"
                :ok-button-props="okButtonProps"
                okText="Xác nhận"
                cancelText="Đóng"
              >
                <p>Bạn có chắc muốn xóa tour: {{ selectedItem.TOUR_NAME }}?</p>
              </a-modal>
              <a-modal
                style="top: 40px"
                v-model:open="isModalUpdate"
                title="Cập nhật Tour"
                @ok="handleOkDelete"
                @cancel="handleCancelDelete"
                :ok-button-props="okButtonProps"
                okText="Xác nhận"
                cancelText="Đóng"
              >
                <p>
                  Bạn sẽ được chuyển đến trang chỉnh sửa Tour:
                  {{ selectedItem.TOUR_NAME }}?
                </p>
              </a-modal>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="text-center"
        style="font-weight: bold; font-size: 18px"
      >
        <p>Không tìm thấy tour</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
const isModalDelete = ref(false);
const isModalUpdate = ref(false); // Điều khiển mở/đóng modal xóa
// Điều khiển mở/đóng modal xóa
const selectedItem = ref(null); // Lưu thông tin tour được chọn để xóa

onMounted(() => {});
// Hàm mở modal xóa
const showModalDelete = (item) => {
  isModalDelete.value = true;
  selectedItem.value = item; // Gán tour được chọn vào biến
};

const showModalUpdate = (item) => {
  isModalUpdate.value = true;
  selectedItem.value = item; // Gán tour được chọn vào biến
};
const data = ref([]); // Chứa danh sách tour
const searchQuery = ref(""); // Từ khóa tìm kiếm
const isLogin = localStorage.getItem("isLogin");
const handleCancelDelete = () => {
  isModalDelete.value = false;
};
// Hàm lấy danh sách tour từ API
const fetchData = () => {
  const token = localStorage.getItem("Token"); // Lấy token từ localStorage

  axios
    .get("http://localhost:3000/tours/", {
      headers: {
        Authorization: `Bearer ${token}`, // Truyền token vào header
      },
    })
    .then((res) => {
      data.value = res.data; // Gán dữ liệu tour vào data
    })
    .catch((err) => console.log(err));
};
const handleOkDelete = () => {
  const token = localStorage.getItem("Token"); // Lấy token từ localStorage

  axios
    .delete(`http://localhost:3000/tours/${selectedItem.value._id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Truyền token để xác thực
      },
    })
    .then((res) => {
      toast.success("Xóa tour thành công!");
      fetchData();
      handleCancelDelete();
    })
    .catch((err) => {
      toast.error("Xóa tour thất bại!");
      console.error(err);
    });
};

const okButtonProps = {
  style: {
    background: "red", // Đặt màu đỏ cho nút "OK"
  },
};
// Gọi hàm fetchData khi component được mounted
fetchData();

// Hàm xem chi tiết tour (chuyển đến trang chi tiết tour)
const viewTourDetail = (tour) => {
  // Chuyển đến trang chi tiết tour với tour ID
  console.log("Xem chi tiết tour:", tour._id);
};
const searchTours = async () => {
  const token = localStorage.getItem("Token"); // Lấy token từ localStorage
  if (searchQuery.value.trim() === "") {
    toast.warn("Vui lòng nhập tên tour");
    return;
  }

  try {
    const response = await axios.get("http://localhost:3000/tours/search", {
      headers: {
        Authorization: `Bearer ${token}`, // Truyền token để xác thực
      },
      params: {
        query: searchQuery.value, // Truyền query qua params
      },
    });

    if (response.data.success && response.data.data.length > 0) {
      data.value = response.data.data; // Gán dữ liệu trả về từ API vào biến data
    } else {
      data.value = []; // Nếu không có kết quả tìm kiếm, trả về mảng rỗng
    }
  } catch (error) {
    toast.error("Lỗi khi tìm kiếm tour");
    console.error("Lỗi khi nhận dữ liệu từ API", error);
  }
};
</script>
<style lang="scss" scoped>
@import "./AboutAdmin.scss";
</style>
