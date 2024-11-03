<template>
  <div class="containPage">
    <h2>Quản lý doanh thu</h2>
    <div class="contentPage" v-if="isLogin">
      <!-- Bộ lọc chọn tháng và năm cho doanh thu hàng tháng -->
      <div v-if="activeKey === '1'" class="filter-container pt-4">
        <a-date-picker
          v-model="selectedDate"
          picker="month"
          placeholder="Chọn tháng và năm"
          @change="handleDateChange"
        />
        <a-button type="primary" @click="fetchMonthlyRevenue">
          Thống kê
        </a-button>
      </div>

      <!-- Bộ lọc chọn năm cho tổng doanh thu -->
      <div v-if="activeKey === '3'" class="filter-container pt-4">
        <a-date-picker
          v-model="selectedYearDate"
          picker="year"
          placeholder="Chọn năm"
          @change="handleYearChange"
        />
        <a-button type="primary" @click="fetchTotalRevenue">
          Thống kê
        </a-button>
      </div>

      <!-- Bộ lọc chọn ngày/tháng/năm cho doanh thu theo ngày -->
      <div v-if="activeKey === '4'" class="filter-container pt-4">
        <a-date-picker
          v-model="selectedFullDate"
          placeholder="Chọn ngày, tháng, năm"
          @change="handleFullDateChange"
        />
        <a-button type="primary" @click="fetchDailyRevenue">
          Thống kê
        </a-button>
      </div>

      <a-tabs v-model:activeKey="activeKey">
        <!-- Tab Doanh thu hàng tháng -->
        <a-tab-pane key="1" tab="Doanh thu hàng tháng">
          <a-table
            :dataSource="[monthlyRevenue]"
            :columns="monthlyColumns"
            rowKey="month"
          />
        </a-tab-pane>

        <!-- Tab Doanh thu từng tour -->
        <a-tab-pane key="2" tab="Doanh thu từng tour">
          <a-table
            :dataSource="perTourRevenue"
            :columns="perTourColumns"
            rowKey="_id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'tourImage'">
                <div class="tour-image-cell">
                  <img
                    v-for="image in record.tourImage"
                    :key="image"
                    :src="image"
                    alt="Tour Image"
                  />
                </div>
              </template>
              <template v-else-if="column.key === 'totalRevenue'">
                {{ formatCurrency(record.totalRevenue) }}
              </template>
              <template v-else>
                {{ record[column.dataIndex] }}
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <!-- Tab Tổng doanh thu -->
        <a-tab-pane key="3" tab="Tổng doanh thu">
          <div class="total-revenue">
            <h3>Tổng doanh thu: {{ formatCurrency(totalRevenue) }}</h3>
          </div>
        </a-tab-pane>

        <!-- Tab Doanh thu theo ngày -->
        <a-tab-pane key="4" tab="Doanh thu theo ngày">
          <a-table
            :dataSource="dailyRevenue"
            :columns="dailyColumns"
            rowKey="day"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const activeKey = ref("1");
const isLogin = ref(localStorage.getItem("isLogin"));
const token = localStorage.getItem("Token");

// Dữ liệu cho bảng
const monthlyRevenue = ref({});
const perTourRevenue = ref([]);
const totalRevenue = ref(0);
const dailyRevenue = ref([]);

// Lựa chọn của người dùng
const selectedDate = ref(null); // Ngày/tháng cho doanh thu hàng tháng
const selectedYearDate = ref(null); // Năm cho tổng doanh thu
const selectedFullDate = ref(null); // Ngày/tháng/năm cho doanh thu theo ngày
const selectedMonth = ref(null);
const selectedYear = ref(null);
const selectedDay = ref(null);

// Cấu hình cột cho bảng
const monthlyColumns = [
  { title: "Tháng", dataIndex: "month", key: "month" },
  { title: "Năm", dataIndex: "year", key: "year" },
  {
    title: "Doanh thu",
    dataIndex: "revenue",
    key: "revenue",
    customRender: ({ text }) => formatCurrency(text),
  },
];

const perTourColumns = [
  { title: "Tên tour", dataIndex: "tourName", key: "tourName" },
  {
    title: "Ảnh",
    dataIndex: "tourImage",
    key: "tourImage",
    scopedSlots: { customRender: "tourImage" },
  },
  {
    title: "Tổng doanh thu",
    dataIndex: "totalRevenue",
    key: "totalRevenue",
    customRender: ({ text }) => formatCurrency(text),
  },
];

const dailyColumns = [
  {
    title: "Ngày",
    key: "day",
    customRender: ({ record }) => record._id.day,
  },
  {
    title: "Tháng",
    key: "month",
    customRender: ({ record }) => record._id.month,
  },
  {
    title: "Năm",
    key: "year",
    customRender: ({ record }) => record._id.year,
  },
  {
    title: "Doanh thu",
    dataIndex: "totalRevenue",
    key: "totalRevenue",
    customRender: ({ text }) => formatCurrency(text),
  },
];

// Hàm gọi API để lấy dữ liệu doanh thu hàng tháng
const fetchMonthlyRevenue = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/tours/revenue/monthly?month=${selectedMonth.value}&year=${selectedYear.value}`
    );
    monthlyRevenue.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu doanh thu hàng tháng:", error);
  }
};

// Hàm gọi API để lấy dữ liệu doanh thu từng tour
const fetchPerTourRevenue = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/tours/revenue/per-tour"
    );
    perTourRevenue.value = response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu doanh thu từng tour:", error);
  }
};

// Hàm gọi API để lấy tổng doanh thu
const fetchTotalRevenue = async () => {
  try {
    const url = selectedYear.value
      ? `http://localhost:3000/tours/revenue/total?year=${selectedYear.value}`
      : "http://localhost:3000/tours/revenue/total";

    const response = await axios.get(url);
    dailyRevenue.value = response.data.data;
    totalRevenue.value = response.data.totalRevenue;
  } catch (error) {
    console.error("Lỗi khi lấy tổng doanh thu:", error);
  }
};

// Hàm gọi API để lấy dữ liệu doanh thu theo ngày
const fetchDailyRevenue = async () => {
  try {
    let url = "http://localhost:3000/tours/revenue/dailyrevenue";
    if (selectedYear.value) url += `?year=${selectedYear.value}`;
    if (selectedMonth.value) url += `&month=${selectedMonth.value}`;
    if (selectedDay.value) url += `&day=${selectedDay.value}`;

    const response = await axios.get(url, {
      params: {
        year: selectedYear.value,
        month: selectedMonth.value,
        day: selectedDay.value,
      },
    });
    dailyRevenue.value = response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu doanh thu theo ngày:", error);
  }
};

// Xử lý thay đổi năm cho tổng doanh thu
const handleYearChange = (date) => {
  selectedYear.value = date ? date.year() : null;
};

// Xử lý thay đổi ngày/tháng/năm cho doanh thu theo ngày
const handleFullDateChange = (date) => {
  if (date) {
    selectedDay.value = date.date();
    selectedMonth.value = date.month() + 1; // Tháng bắt đầu từ 0 nên cần +1
    selectedYear.value = date.year();
    console.log("Ngày đã chọn:", selectedDay.value);
    console.log("Tháng đã chọn:", selectedMonth.value);
    console.log("Năm đã chọn:", selectedYear.value);
  } else {
    selectedDay.value = null;
    selectedMonth.value = null;
    selectedYear.value = null;
  }
};

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// Gọi các hàm lấy dữ liệu khi component được mount
onMounted(() => {
  fetchPerTourRevenue();
});
</script>

<style lang="scss" scoped>
.containPage {
  padding: 20px 30px;
  .contentPage {
    padding: 0 20px 20px 20px;
    border-radius: 10px;
    background-color: #eae2e24a;
  }
}

/* Định dạng cho bộ lọc */
.filter-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;

  .ant-select {
    width: 200px;
  }
}

/* Định dạng ảnh cho cột hình ảnh trong tour */
.tour-image-cell {
  display: flex;
  gap: 8px;
  justify-content: center;

  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
    }
  }
}

/* Định dạng bảng và nút */
.ant-table {
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.ant-table-thead > tr > th {
  background-color: #6d4c41;
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
}

.ant-table-tbody > tr > td {
  background-color: #f7f7f7;
  color: #333;
  text-align: center;
  padding: 10px;
}

/* Định dạng tiêu đề và phân trang */
.ant-table-title {
  font-size: 18px;
  font-weight: bold;
  color: #6d4c41;
  margin: 16px 0;
}

.ant-pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;

  .ant-pagination-item-active {
    background-color: #6d4c41;
    border-color: #6d4c41;
    a {
      color: #ffffff;
    }
  }
}
</style>
