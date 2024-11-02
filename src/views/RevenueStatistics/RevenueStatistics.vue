<template>
  <div class="revenue-statistics">
    <h1>Thống kê doanh thu</h1>

    <!-- Tổng doanh thu -->
    <div class="statistics-section">
      <button @click="toggleSection('totalRevenue')">Tổng Doanh Thu</button>
      <p v-if="showTotalRevenue && totalRevenue !== null">
        Tổng doanh thu: {{ formatCurrency(totalRevenue) }}
      </p>
    </div>

    <!-- Doanh thu theo tour -->
    <div class="statistics-section">
      <button @click="toggleSection('revenuePerTour')">
        Doanh Thu Theo Tour
      </button>
      <ul v-if="showRevenuePerTour && revenuePerTour.length">
        <li v-for="(tour, index) in revenuePerTour" :key="index">
          Tour: {{ tour.tourName }} - Doanh thu:
          {{ formatCurrency(tour.revenue) }}
        </li>
      </ul>
    </div>

    <!-- Doanh thu theo loại tour -->
    <div class="statistics-section">
      <button @click="toggleSection('revenueByType')">
        Doanh Thu Theo Loại Tour
      </button>
      <ul v-if="showRevenueByType && revenueByType.length">
        <li v-for="(type, index) in revenueByType" :key="index">
          Loại: {{ type._id }} - Doanh thu: {{ formatCurrency(type.revenue) }}
        </li>
      </ul>
    </div>

    <!-- Doanh thu theo tháng -->
    <div class="statistics-section">
      <button @click="toggleSection('monthlyRevenue')">
        Doanh Thu Theo Tháng
      </button>
      <ul v-if="showMonthlyRevenue && monthlyRevenue.length">
        <li v-for="(month, index) in monthlyRevenue" :key="index">
          Tháng: {{ month._id }} - Doanh thu:
          {{ formatCurrency(month.monthlyRevenue) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      totalRevenue: null,
      revenuePerTour: [],
      revenueByType: [],
      monthlyRevenue: [],
      showTotalRevenue: false,
      showRevenuePerTour: false,
      showRevenueByType: false,
      showMonthlyRevenue: false,
    };
  },
  methods: {
    async fetchTotalRevenue() {
      try {
        const response = await axios.get(
          "http://localhost:3000/tours/revenue/total"
        );
        this.totalRevenue = response.data.totalRevenue;
      } catch (error) {
        console.error("Error fetching total revenue:", error);
      }
    },
    async fetchRevenuePerTour() {
      try {
        const response = await axios.get(
          "http://localhost:3000/tours/revenue/per-tour"
        );
        this.revenuePerTour = response.data.data;
      } catch (error) {
        console.error("Error fetching revenue per tour:", error);
      }
    },
    async fetchRevenueByType() {
      try {
        const response = await axios.get(
          "http://localhost:3000/tours/revenue/by-type"
        );
        this.revenueByType = response.data.data;
      } catch (error) {
        console.error("Error fetching revenue by type:", error);
      }
    },
    async fetchMonthlyRevenue() {
      try {
        const response = await axios.get(
          "http://localhost:3000/tours/revenue/monthly"
        );
        this.monthlyRevenue = response.data.data;
      } catch (error) {
        console.error("Error fetching monthly revenue:", error);
      }
    },
    toggleSection(section) {
      if (section === "totalRevenue") {
        this.showTotalRevenue = !this.showTotalRevenue;
        if (this.showTotalRevenue && this.totalRevenue === null)
          this.fetchTotalRevenue();
      } else if (section === "revenuePerTour") {
        this.showRevenuePerTour = !this.showRevenuePerTour;
        if (this.showRevenuePerTour && !this.revenuePerTour.length)
          this.fetchRevenuePerTour();
      } else if (section === "revenueByType") {
        this.showRevenueByType = !this.showRevenueByType;
        if (this.showRevenueByType && !this.revenueByType.length)
          this.fetchRevenueByType();
      } else if (section === "monthlyRevenue") {
        this.showMonthlyRevenue = !this.showMonthlyRevenue;
        if (this.showMonthlyRevenue && !this.monthlyRevenue.length)
          this.fetchMonthlyRevenue();
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
  },
};
</script>

<style scoped>
/* Your existing styles */
.revenue-statistics {
  max-width: 100%;
  margin: 50px;
  padding: 30px;
  background-color: #f9fafb;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  color: #333;
}

.revenue-statistics h1 {
  text-align: center;
  color: #0056b3;
  font-size: 24px;
  margin-bottom: 20px;
}

.statistics-section {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #ffffff;
  transition: transform 0.2s, box-shadow 0.2s;
}

.statistics-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.statistics-section p,
.statistics-section ul {
  font-size: 18px;
  margin: 15px 0;
}

.statistics-section ul {
  list-style: none;
  padding: 0;
}

.statistics-section li {
  background-color: #f1f8ff;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistics-section li:last-child {
  margin-bottom: 0;
}

button {
  background-color: #007bff;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

button:active {
  background-color: #004494;
  transform: translateY(0);
}

ul li span {
  color: #007bff;
  font-weight: bold;
}

@media (max-width: 600px) {
  .revenue-statistics {
    padding: 20px;
  }

  button {
    width: 100%;
    padding: 12px;
    margin-top: 10px;
  }
}
</style>
