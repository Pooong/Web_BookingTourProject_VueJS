<template>
  <div class="containPage" v-if="isLogin">
    <h2>Dashboard</h2>
    <div class="contentPage">
      <div class="listCard">
        <div class="row pl-3">
          <div class="col">
            <div class="cardInfo">
              <div class="leftCard">
                <div class="iconCard">
                  <i class="fa-solid fa-cart-shopping"></i>
                </div>
              </div>
              <div class="rightCard">
                <div class="numberCard">
                  {{ totalOrder }}
                </div>
                <div class="nameCard">Đơn mượn</div>
              </div>
            </div>
          </div>
          <div class="col d-flex">
            <div class="cardInfo">
              <div class="leftCard">
                <div class="iconCard" style="background-color: #cbe2ff">
                  <i
                    class="fa-solid fa-hourglass-half"
                    style="color: #007bff"
                  ></i>
                </div>
              </div>
              <div class="rightCard">
                <div class="numberCard">
                  {{ totalPending }}
                </div>
                <div class="nameCard">Đơn mượn chờ</div>
              </div>
            </div>
          </div>
          <div class="col d-flex">
            <div class="cardInfo">
              <div class="leftCard">
                <div class="iconCard" style="background-color: #cdf1ef">
                  <!-- <i class="fa-solid fa-money-bill-wave" style="color: #05B9AA;"></i> -->
                  <i class="fa-solid fa-user-tie" style="color: #05b9aa"></i>
                </div>
              </div>
              <div class="rightCard">
                <div class="numberCard">
                  {{ totalStaff }}
                </div>
                <div class="nameCard">Tổng nhân viên</div>
              </div>
            </div>
          </div>
          <div class="col d-flex">
            <div class="cardInfo">
              <div class="leftCard">
                <div class="iconCard" style="background-color: #e5cff7">
                  <i class="fa-solid fa-user" style="color: #bc7af9"></i>
                </div>
              </div>
              <div class="rightCard">
                <div class="numberCard">
                  {{ totalCustomer }}
                </div>
                <div class="nameCard">Tổng độc giả</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3 class="px-4 mt-2 mb-0">Đơn mượn sách</h3>
      <div class="ordersCustomer mt-1">
        <table class="table table-hover text-center">
          <thead>
            <tr>
              <th scope="col">Mã đơn mượn</th>
              <th scope="col">Tên độc giả</th>
              <th scope="col">Ngày mượn</th>
              <th scope="col">Ngày trả</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <td colspan="5" v-if="data.length === 0">
              <div class="imageOrderEmpty">
                <img src="" alt="Image" />
                <p>Danh sách order trống</p>
              </div>
            </td>
            <tr v-for="(order, index) in data" :key="index">
              <th scope="row">{{ order._id }}</th>
              <td>{{ order.MSKH[0].HoTenKH }}</td>
              <td>{{ formatDateTime(order.NgayDH) }}</td>
              <td>
                <input
                  class="inputDate"
                  type="datetime-local"
                  v-model="order.NgayGH"
                />
              </td>
              <td class="d-flex justify-content-center">
                <button @click="handleAccess(order)" class="accept">
                  <i class="fa-solid fa-check"></i>
                </button>
                <button class="reject" @click="handleDenied(order)">
                  <i class="fa-solid fa-x"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div v-else class="denied">
    <img
      class="d-flex mt-5 ml-auto mr-auto mb-5"
      src="../../../public/Illustration/denied.png"
      alt=""
    />
    <h3 class="text-center">Vui lòng đăng nhập để xử dụng dịch vụ</h3>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import moment from "moment";
const idStaff = ref("");
const data = ref([]);
const NgayGH = ref();
const idOrder = ref("");
const totalCustomer = ref("");
const totalOrder = ref("");
const totalPending = ref("");
const totalStaff = ref("");
const isLogin = localStorage.getItem("isLogin");
const fetchData = () => {
  axios
    .get("http://localhost:3000/order")
    .then((res) => {
      console.log("Data", res.data);
      data.value = res.data;
      data.value = res.data.map((item) => ({
        ...item,
        NgayGH: "",
      }));
      console.log("Data moiw", data.value);
    })
    .catch((err) => console.log(err));
};
fetchData();
const dashBoard = () => {
  axios
    .get("http://localhost:3000/customer/dashboard")
    .then((res) => {
      totalCustomer.value = res.data.user;
      totalStaff.value = res.data.staff;
      totalOrder.value = res.data.order.length;
      totalPending.value = res.data.orderPending.length;
    })
    .catch((err) => console.log(err));
};
dashBoard();
const formatDateTime = (dateTime) => {
  return moment(dateTime).format("DD-MM-YYYY HH:mm:ss");
};
const handleAccess = (order) => {
  idOrder.value = order._id;
  NgayGH.value = order.NgayGH;
  idStaff.value = localStorage.getItem("ID_User");
  console.log("ID_Order", idOrder.value);
  console.log("Ngay GH", order.NgayGH);
  if (NgayGH.value === "") {
    toast.error("Vui lòng chọn ngày giao hàng");
  } else {
    axios
      .put("http://localhost:3000/order", { idStaff, idOrder, NgayGH })
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.error);
        } else {
          fetchData();
          dashBoard();
          toast.success(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  }
};
const handleDenied = (order) => {
  idOrder.value = order._id;
  axios
    .delete("http://localhost:3000/order/admin/" + idOrder.value)
    .then((res) => {
      if (res.data.error) {
        toast.error(res.data.error);
      } else {
        fetchData();
        toast.success(res.data.message);
        dashBoard();
      }
    })
    .catch((err) => console.log(err));
};
</script>
<style lang="scss" scoped>
@import "./Admin.scss";
</style>
