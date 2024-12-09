<template>
  <div class="containPage" v-if="isLogin">
    <h2>Dashboard</h2>
    <div class="contentPage">
      <div class="listCard">
        <!-- Card Section -->
        <div class="row pl-3">
          <div class="col" v-for="(card, index) in cards" :key="index">
            <div class="cardInfo">
              <div class="leftCard">
                <div
                  class="iconCard"
                  :style="{ backgroundColor: card.bgColor }"
                >
                  <i :class="card.icon" :style="{ color: card.color }"></i>
                </div>
              </div>
              <div class="rightCard">
                <div class="numberCard">{{ card.value }}</div>
                <div class="nameCard">{{ card.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Booking List Section -->
      <h3 class="px-4 mt-2 mb-0">Các đơn đặt</h3>
      <div class="ordersCustomer mt-1">
        <table class="table table-hover text-center">
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Tên khách hàng</th>
              <th scope="col">Ngày đặt</th>
              <th scope="col">Tổng giá</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Xem chi tiết</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="data.length === 0">
              <td colspan="7">
                <div class="imageOrderEmpty">
                  <p>Danh sách order trống</p>
                </div>
              </td>
            </tr>
            <tr v-for="(order, index) in data" :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ order.CUSTOMER_NAME }}</td>
              <td>{{ formatDateTime(order.CREATE_AT) }}</td>
              <td>{{ formatCurrency(order.TOTAL_PRICE) }}</td>
              <td :class="getStatusClass(order.STATUS)">{{ order.STATUS }}</td>
              <td>
                <button @click="openDetailModal(order)" class="eye">
                  <i class="fa-solid fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Detail Modal -->
      <div
        v-if="showDetailModal"
        class="modal-overlay"
        @click.self="closeDetailModal"
      >
        <div class="modal-detail slide-in-right">
          <div class="modal-content">
            <button class="close-modal" @click="closeDetailModal">X</button>
            <h3 class="modal-title">Chi tiết đơn hàng</h3>

            <!-- Thông tin khách hàng -->
            <div class="customer-info">
              <p><strong>Mã đơn:</strong> {{ selectedOrder._id }}</p>
              <div class="customer-name">
                <i class="fa-solid fa-user"></i>
                <span>Họ và Tên: {{ selectedOrder.CUSTOMER_NAME }}</span>
              </div>
              <div class="customer-name">
                <i class="fa-solid fa-phone"></i>
                <span>SDT: {{ selectedOrder.CUSTOMER_PHONE }}</span>
              </div>
              <div class="customer-name">
                <i class="fa-solid fa-envelope"></i>
                <span>Email: {{ selectedOrder.USER_ID.EMAIL }}</span>
              </div>
            </div>

            <!-- Danh sách sản phẩm -->
            <div
              v-for="(tour, index) in selectedOrder.LIST_TOURS"
              :key="index"
              class="product-item"
            >
              <div class="product-image">
                <img :src="tour.TOUR_ID.IMAGES[0]" alt="Tour Image" />
              </div>
              <div class="product-info">
                <p class="product-name">{{ tour.TOUR_ID.TOUR_NAME }}</p>
                <p>
                  {{ tour.SLOT }} x
                  {{ " " }}
                  {{
                    formatCurrency(parseFloat(tour.TOUR_ID.PRICE_PER_PERSON))
                  }}
                </p>
                <p>
                  Thành tiền:
                  {{ " " }}
                  {{
                    formatCurrency(
                      parseFloat(tour.SLOT * tour.TOUR_ID.PRICE_PER_PERSON)
                    )
                  }}
                </p>
              </div>
            </div>

            <!-- Ngày đặt và tổng cộng -->
            <div class="order-summary">
              <p>
                <span>Ngày đặt hàng:</span>
                {{ formatDateTime(selectedOrder.CREATE_AT) }}
              </p>
              <p class="total-price">
                <span>Tổng cộng:</span>
                {{ formatCurrency(selectedOrder.TOTAL_PRICE) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Login Denied Section -->
  <div v-else class="denied">
    <img
      class="d-flex mt-5 ml-auto mr-auto mb-5"
      src="../../../public/Illustration/denied.png"
      alt=""
    />
    <h3 class="text-center">Vui lòng đăng nhập để sử dụng dịch vụ</h3>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import moment from "moment";
import { toast } from "vue3-toastify";

// Reactive variables
const data = ref([]);
const totalOrder = ref(0);
const totalPending = ref(0);
const totalCustomer = ref(0);
const totalStaff = ref(0);
const showDetailModal = ref(false);
const selectedOrder = ref({});
const isLogin = localStorage.getItem("isLogin");
const totalBooking = ref(0);
// Card information
const cards = [
  {
    name: "Đơn đặt tour",
    value: totalBooking,
    icon: "fa-solid fa-cart-shopping",
    bgColor: "",
    color: "",
  },
  {
    name: "Đơn đang chờ",
    value: totalPending,
    icon: "fa-solid fa-hourglass-half",
    bgColor: "#cbe2ff",
    color: "#007bff",
  },
  {
    name: "Tổng nhân viên",
    value: totalStaff,
    icon: "fa-solid fa-user-tie",
    bgColor: "#cdf1ef",
    color: "#05b9aa",
  },
  {
    name: "Tổng khách hàng",
    value: totalCustomer,
    icon: "fa-solid fa-user",
    bgColor: "#e5cff7",
    color: "#bc7af9",
  },
];

const fetchTotalBooking = () => {
  axios
    .get("http://localhost:3000/booking/total-bookings")
    .then((res) => {
      if (res.data.success) {
        totalBooking.value = res.data.data;
        console.log(totalBooking.value);
      }
    })
    .catch((err) => console.log(err));
};
// Fetch booking data
const fetchData = () => {
  axios
    .get("http://localhost:3000/booking/all-bookings")
    .then((res) => {
      if (res.data.success) {
        data.value = res.data.data;
      }
    })
    .catch((err) => console.log(err));
};

// Fetch dashboard data
const dashBoard = () => {
  const token = localStorage.getItem("Token");
  axios
    .get("http://localhost:3000/users/getAllUsers?tabStatus=4", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      if (res.data.success) {
        const users = res.data.data;

        // Đếm tổng khách hàng và nhân viên
        totalCustomer.value = users.filter((user) =>
          Object.values(user.ROLE).every((role) => !role)
        ).length;

        totalStaff.value = users.filter(
          (user) =>
            user.ROLE.BRANCH_MANAGER || user.ROLE.STAFF || user.ROLE.ADMIN
        ).length;

        console.log("Total Customers:", totalCustomer.value);
        console.log("Total Staff:", totalStaff.value);
      }
    })
    .catch((err) => console.log(err));
};

// Open detail modal
const openDetailModal = (order) => {
  selectedOrder.value = order;
  showDetailModal.value = true;

  // Thêm hiệu ứng trượt cho modal
  setTimeout(() => {
    document.querySelector(".modal-overlay").classList.add("show");
    document.querySelector(".modal-detail").classList.add("slide-in-right");
  }, 10); // Chờ một chút để CSS kịp thực hiện
};

// Close detail modal
const closeDetailModal = () => {
  const modalDetail = document.querySelector(".modal-detail");
  modalDetail.classList.remove("slide-in-right");

  // Gỡ bỏ lớp show sau khi hiệu ứng kết thúc
  setTimeout(() => {
    showDetailModal.value = false;
    document.querySelector(".modal-overlay").classList.remove("show");
  }, 500); // Chờ thời gian tương ứng với transition
};

// Format date and time
const formatDateTime = (dateTime) =>
  moment(dateTime).format("DD-MM-YYYY HH:mm:ss");

// Format currency
const formatCurrency = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price
  );

// Get status class for styling
const getStatusClass = (status) => {
  return status === "SUCCESS"
    ? "text-success"
    : status === "Pending"
    ? "text-warning"
    : "text-danger";
};

// Initial data fetch
fetchData();
dashBoard();
fetchTotalBooking();
</script>

<style scoped>
p {
  margin: 0;
}
.containPage {
  padding: 20px;
}
.listCard {
  margin-bottom: 20px;
}
.cardInfo {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.leftCard {
  margin-right: 10px;
}
.iconCard {
  font-size: 24px;
  padding: 10px;
  border-radius: 5px;
}
.rightCard .numberCard {
  font-size: 18px;
  font-weight: bold;
}
.text-success {
  color: green;
}
.text-warning {
  color: orange;
}
.text-danger {
  color: red;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out;
}
.modal-overlay.show {
  opacity: 1;
  visibility: visible;
}
.modal-detail {
  width: 400px;
  height: 100%;
  background: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  padding: 20px;
  overflow-y: auto;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}
.modal-detail.slide-in-right {
  transform: translateX(0);
}
.modal-content {
  position: relative;
  border: none;
}
.close-modal {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}
.modal-title {
  text-align: center;
  font-size: 24px;
  color: #2979ff;
  margin-bottom: 20px;
}
.customer-info {
  margin-bottom: 20px;
}
.customer-name {
  display: flex;
  align-items: center;
  gap: 15px;
}
.product-item {
  display: flex;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
}
.product-image img {
  width: 60px;
  height: 60px;
  border-radius: 5px;
}
.product-info {
  margin-left: 10px;
}
.total-price {
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
}
.order-summary {
  margin-top: 20px;
}
</style>
