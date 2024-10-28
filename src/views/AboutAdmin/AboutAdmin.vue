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
        <button v-if="isLogin" @click="moveToAddTour" class="btnAdd">
          <i class="fa-solid fa-plus"></i> Thêm Tour
        </button>
        <router-link to="/admin/login" v-else>
          <button class="btnAdd">
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
              <!-- Update button -->
              <button
                v-if="isLogin"
                @click="redirectToUpdateTour(item)"
                class="edit"
              >
                <i class="fa-regular fa-pen-to-square"></i> Cập nhật
              </button>

              <!-- Delete button -->
              <button
                v-if="isLogin"
                @click="showModalDelete(item)"
                class="remove"
              >
                <i class="fa-solid fa-trash iconRemove"></i> Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No tours found -->
      <div
        v-else
        class="text-center"
        style="font-weight: bold; font-size: 18px"
      >
        <p>Không tìm thấy tour</p>
      </div>

      <!-- Delete Confirmation Modal -->
      <a-modal
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
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { toast } from "vue3-toastify";

// Define refs
const data = ref([]); // Chứa danh sách tour
const searchQuery = ref(""); // Từ khóa tìm kiếm
const isLogin = localStorage.getItem("isLogin") === "true"; // Check login status
const isModalDelete = ref(false); // Điều khiển mở/đóng modal xóa
const selectedItem = ref(null); // Lưu thông tin tour được chọn để xóa
const router = useRouter(); // Vue Router instance

// Fetch tour data from API
const fetchData = () => {
  const token = localStorage.getItem("Token"); // Get token from localStorage

  axios
    .get("http://localhost:3000/tours/", {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token in headers
      },
    })
    .then((res) => {
      data.value = res.data; // Assign data to 'data' ref
    })
    .catch((err) => console.log(err));
};

// Redirect to edit tour page
const redirectToUpdateTour = (tour) => {
  router.push(`/admin/edit-tour/${tour._id}`); // Navigate to the edit page with tour ID
};

// Show delete modal
const showModalDelete = (item) => {
  isModalDelete.value = true;
  selectedItem.value = item; // Assign selected item to 'selectedItem'
};

// Delete tour handler
const handleOkDelete = () => {
  const token = localStorage.getItem("Token"); // Get token from localStorage

  axios
    .delete(`http://localhost:3000/tours/${selectedItem.value._id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token for authentication
      },
    })
    .then(() => {
      toast.success("Xóa tour thành công!");
      fetchData(); // Refresh tour list
      handleCancelDelete(); // Close delete modal
    })
    .catch((err) => {
      toast.error("Xóa tour thất bại!");
      console.error(err);
    });
};

// Cancel delete modal
const handleCancelDelete = () => {
  isModalDelete.value = false;
};

// Redirect to add tour page
const moveToAddTour = () => {
  router.push("/admin/add-tour");
};

// Search tours
const searchTours = async () => {
  if (searchQuery.value.trim() === "") {
    fetchData(); // Fetch all tours if search query is empty
    return;
  }

  try {
    const token = localStorage.getItem("Token");
    const response = await axios.get("http://localhost:3000/tours/search", {
      params: { query: searchQuery.value },
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.success && response.data.data.length > 0) {
      data.value = response.data.data; // Assign response data to 'data'
      toast.success("Tìm tour thành công");
    } else {
      data.value = [];
      toast.warn("Không tìm thấy tour phù hợp");
    }
  } catch (error) {
    toast.error("Lỗi khi tìm kiếm tour.");
    console.error(error);
  }
};

// OK button style
const okButtonProps = { style: { background: "red" } };

// Fetch data when component is mounted
onMounted(fetchData);
</script>

<style lang="scss" scoped>
@import "./AboutAdmin.scss";
</style>
