<template>
  <div class="create-tour">
    <h1>Tạo tour mới</h1>
    <form @submit.prevent="createTour">
      <div class="groupAttribute">
        <div class="form-row">
          <div class="form-group">
            <label for="tourName">Tên tour:</label>
            <input type="text" v-model="tour.TOUR_NAME" required />
          </div>
          <div class="form-group">
            <label for="type">Loại:</label>
            <select v-model="tour.TYPE" required>
              <option value="" disabled>Chọn</option>
              <option value="Núi">Núi</option>
              <option value="Biển">Biển</option>
              <option value="Thác nước">Thác nước</option>
              <option value="Du Thuyền">Du Thuyền</option>
              <option value="Hang động">Hang động</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="isActive">Đang hoạt động:</label>
            <select v-model="tour.IS_ACTIVE" required>
              <option :value="true">Có</option>
              <option :value="false">Không</option>
            </select>
          </div>
          <div class="form-group">
            <label for="pricePerPerson">Giá/người:</label>
            <input type="number" v-model="tour.PRICE_PER_PERSON" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="description">Mô tả:</label>
            <textarea v-model="tour.DESCRIPTION" required></textarea>
          </div>
          <div class="form-group">
            <label for="vehicle">Phương tiện di chuyển:</label>
            <input type="text" v-model="tour.VEHICLE" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="location">Địa điểm:</label>
            <input type="text" v-model="tour.LOCATION" required />
          </div>
          <div class="form-group">
            <label for="images">Chọn ảnh:</label>
            <input type="file" multiple @change="onFileChange" />
          </div>
        </div>

        <h3>Ảnh đã chọn:</h3>
        <ul>
          <li v-for="(image, index) in IMAGES" :key="index">
            {{ image.name }}
          </li>
        </ul>
      </div>

      <div class="groupAttribute">
        <h3>Các lịch tour</h3>
        <div v-for="(calendar, index) in tour.CALENDAR_TOUR" :key="index">
          <div class="form-row">
            <div class="form-group">
              <label>Ngày bắt đầu:</label>
              <input
                type="date"
                date-format="dd-MM-yyyy"
                :min="minDate"
                v-model="calendar.START_DATE"
                @input="updateEndDate(index)"
                required
              />
            </div>
            <div class="form-group">
              <label>Ngày kết thúc:</label>
              <input
                type="date"
                date-format="dd-MM-yyyy"
                style="background-color: #ccc"
                :value="calendar.END_DATE"
                disabled
                required
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Giờ bắt đầu:</label>
              <input type="time" v-model="calendar.START_TIME" required />
            </div>
            <div class="form-group">
              <label>Số vé:</label>
              <input
                type="number"
                v-model="calendar.AVAILABLE_SLOTS"
                min="1"
                required
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Số ngày:</label>
              <input
                type="number"
                min="1"
                v-model="calendar.NumberOfDay"
                @input="updateEndDate(index)"
                required
              />
            </div>
            <div class="form-group">
              <label>Số đêm:</label>
              <input
                type="number"
                min="1"
                :max="calendar.NumberOfDay"
                v-model="calendar.NumberOfNight"
                required
              />
            </div>
          </div>
          <div class="groupBtnCalendar">
            <button
              type="button"
              class="btnDelete"
              @click="removeCalendar(index)"
              :disabled="tour.CALENDAR_TOUR.length === 1"
            >
              Xóa lịch
            </button>
            <button type="button" class="btnAdd" @click="addCalendar">
              Thêm lịch
            </button>
          </div>
        </div>
      </div>

      <div class="groupAttribute">
        <h3>Thêm tiện ích</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="hotel">Khách sạn:</label>
            <input
              type="text"
              v-model="tour.CUSTOM_ATTRIBUTES.HOTEL"
              required
            />
          </div>
          <div class="form-group">
            <label for="restaurant">Nhà hàng:</label>
            <input
              type="text"
              v-model="tour.CUSTOM_ATTRIBUTES.RESTAURANT"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="visitPlace">Địa điểm tham quan:</label>
            <input
              type="text"
              v-model="visitPlaces"
              placeholder="Nhập các địa điểm"
              required
            />
          </div>
          <div class="form-group">
            <label for="vehiclePersenal">Phương tiện cá nhân (cấp thêm):</label>
            <input
              type="text"
              v-model="tour.CUSTOM_ATTRIBUTES.VEHICLE_PERSENAL"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="note">Ghi chú:</label>
            <input type="text" v-model="tour.CUSTOM_ATTRIBUTES.NOTE" />
          </div>
          <div class="form-group">
            <label for="depositPercentage">Phần trăm tiền cọc:</label>
            <input type="number" v-model="tour.DEPOSIT_PERCENTAGE" required />
          </div>
        </div>
      </div>

      <h3>Chọn hướng dẫn viên</h3>
      <table class="guide-table">
        <thead>
          <tr>
            <th>Chọn</th>
            <th>Tên hướng dẫn viên</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in userRoles" :key="user._id">
            <td>
              <input
                type="checkbox"
                :id="user._id"
                :value="user._id"
                v-model="ID_TOUR_GUIDE_SUPERVISOR"
                class="checkbox-small"
              />
            </td>
            <td>
              <label :for="user._id" class="label-small">{{
                user.FULLNAME
              }}</label>
            </td>
          </tr>
        </tbody>
      </table>

      <button type="submit" class="createTour">Tạo tour</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
export default {
  data() {
    return {
      tour: {
        TOUR_NAME: "",
        TYPE: "",
        IS_ACTIVE: true,
        PRICE_PER_PERSON: "",
        DESCRIPTION: "",
        VEHICLE: "",
        LOCATION: "",
        CALENDAR_TOUR: [
          {
            START_DATE: "",
            END_DATE: "",
            START_TIME: "",
            AVAILABLE: true,
            AVAILABLE_SLOTS: 30,
            NumberOfDay: 3,
            NumberOfNight: 2,
          },
        ],
        CUSTOM_ATTRIBUTES: {
          HOTEL: "",
          RESTAURANT: "",
          VISIT_PLACE: [],
          VEHICLE_PERSENAL: "",
          NOTE: "",
        },
        DEPOSIT_PERCENTAGE: 30,
      },
      minDate: new Date().toISOString().split("T")[0],
      visitPlaces: "",
      IMAGES: [],
      userRoles: [],
      selectedFiles: [],
      ID_TOUR_GUIDE_SUPERVISOR: [],
    };
  },
  mounted() {
    this.getRoleUser();
  },
  methods: {
    async getRoleUser() {
      try {
        const token = localStorage.getItem("Token");
        const body = {
          role: true,
        };

        const response = await axios.post(
          "http://localhost:3000/users/role",
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.userRoles = response.data.data; // Lưu danh sách user roles
      } catch (error) {
        console.error("Error fetching user roles:", error);
      }
    },
    updateEndDate(index) {
      const calendar = this.tour.CALENDAR_TOUR[index];
      if (calendar.START_DATE && calendar.NumberOfDay) {
        const startDate = new Date(calendar.START_DATE);
        startDate.setDate(startDate.getDate() + calendar.NumberOfDay);
        calendar.END_DATE = startDate.toISOString().split("T")[0];
      }
    },
    addCalendar() {
      this.tour.CALENDAR_TOUR.push({
        START_DATE: "",
        END_DATE: "",
        START_TIME: "",
        AVAILABLE: true,
        AVAILABLE_SLOTS: 30,
        NumberOfDay: 3,
        NumberOfNight: 2,
      });
    },
    removeCalendar(index) {
      this.tour.CALENDAR_TOUR.splice(index, 1);
    },

    onFileChange(event) {
      this.selectedFiles = Array.from(event.target.files);
      this.IMAGES = [...this.selectedFiles];
    },
    async createTour() {
      try {
        this.loading = true;
        const token = localStorage.getItem("Token");

        this.tour.CUSTOM_ATTRIBUTES.VISIT_PLACE = this.visitPlaces
          .split(",")
          .map((place) => place.trim());

        const formData = new FormData();

        // Đính kèm các trường văn bản vào formData
        formData.append("TOUR_NAME", this.tour.TOUR_NAME);
        formData.append("TYPE", this.tour.TYPE);
        formData.append("IS_ACTIVE", this.tour.IS_ACTIVE);
        formData.append("PRICE_PER_PERSON", this.tour.PRICE_PER_PERSON);
        formData.append("DESCRIPTION", this.tour.DESCRIPTION);
        formData.append("VEHICLE", this.tour.VEHICLE);
        formData.append("LOCATION", this.tour.LOCATION);
        formData.append("DEPOSIT_PERCENTAGE", this.tour.DEPOSIT_PERCENTAGE);

        formData.append(
          "CUSTOM_ATTRIBUTES[HOTEL]",
          this.tour.CUSTOM_ATTRIBUTES.HOTEL
        );
        formData.append(
          "CUSTOM_ATTRIBUTES[RESTAURANT]",
          this.tour.CUSTOM_ATTRIBUTES.RESTAURANT
        );
        formData.append(
          "CUSTOM_ATTRIBUTES[VISIT_PLACE]",
          this.tour.CUSTOM_ATTRIBUTES.VISIT_PLACE
        );
        formData.append(
          "CUSTOM_ATTRIBUTES[VEHICLE_PERSENAL]",
          this.tour.CUSTOM_ATTRIBUTES.VEHICLE_PERSENAL
        );
        formData.append(
          "CUSTOM_ATTRIBUTES[NOTE]",
          this.tour.CUSTOM_ATTRIBUTES.NOTE
        );

        // Gửi từng CALENDAR_TOUR
        this.tour.CALENDAR_TOUR.forEach((calendar, index) => {
          formData.append(
            `CALENDAR_TOUR[${index}][START_DATE]`,
            calendar.START_DATE
          );
          formData.append(
            `CALENDAR_TOUR[${index}][END_DATE]`,
            calendar.END_DATE
          );
          formData.append(
            `CALENDAR_TOUR[${index}][START_TIME]`,
            calendar.START_TIME
          );
          formData.append(
            `CALENDAR_TOUR[${index}][AVAILABLE]`,
            calendar.AVAILABLE
          );
          formData.append(
            `CALENDAR_TOUR[${index}][AVAILABLE_SLOTS]`,
            Number(calendar.AVAILABLE_SLOTS)
          );
          formData.append(
            `CALENDAR_TOUR[${index}][NumberOfDay]`,
            Number(calendar.NumberOfDay)
          );
          formData.append(
            `CALENDAR_TOUR[${index}][NumberOfNight]`,
            Number(calendar.NumberOfNight)
          );
        });

        // Đính kèm mỗi tệp đã chọn vào formData với tên là 'IMAGES[]'
        if (this.selectedFiles.length > 0) {
          this.selectedFiles.forEach((file) => {
            formData.append("IMAGES[]", file);
          });
        }

        // Đính kèm ID_TOUR_GUIDE_SUPERVISOR
        this.ID_TOUR_GUIDE_SUPERVISOR.forEach((id) => {
          formData.append("ID_TOUR_GUIDE_SUPERVISOR[]", id);
        });

        const response = await axios.post(
          "http://localhost:3000/tours/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Tạo tour thành công!!!");
        console.log(response.data);
      } catch (error) {
        console.error("Error creating tour:", error);
        alert("Failed to create tour. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.groupAttribute {
  border-radius: 5px;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: #ccc 0px 0px 10px;
  margin-bottom: 20px;
}
.groupBtnCalendar {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
}
.btnDelete {
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  padding: 10px 20px;
  margin-top: 10px;
  width: 30%;
}
.btnAdd {
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  padding: 10px 20px;
  margin-top: 10px;
  width: 30%;
}
.create-tour {
  max-width: 600px;
  margin: 0 auto;
}

.create-tour h1 {
  text-align: center;
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
  margin-right: 10px;
}

.form-group:last-child {
  margin-right: 0;
}

.create-tour input,
.create-tour textarea,
.create-tour select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 40px;
}

.create-tour textarea {
  max-height: 80px;
  resize: none;
}

.guide-table {
  width: 50%;
  border-collapse: collapse;
  margin-bottom: 15px;
  input {
    width: 20px;
    height: 20px;
  }
}

.guide-table th,
.guide-table td {
  border: 1px solid #ccc;
  padding: 4px;
  text-align: left;
  font-size: 14px;
}

.guide-table th {
  background-color: #f5f5f5;
}

.scrollable {
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
}

.scrollable input[type="checkbox"] {
  transform: scale(0.8);
  margin-right: 5px;
}

button {
  padding: 10px 20px;
  background-color: #6d4c41;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 10px;
  width: 100%;
}

button:hover {
  background-color: rgb(33, 53, 119);
  transition: 0.3s linear all;
}
.createTour {
  background-color: rgba(13, 139, 236, 0.8);
  margin-bottom: 20px;
}
</style>
