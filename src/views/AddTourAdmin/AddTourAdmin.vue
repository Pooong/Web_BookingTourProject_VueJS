<template>
  <div class="create-tour">
    <h1>Create New Tour</h1>
    <form @submit.prevent="createTour">
      <div class="form-row">
        <div class="form-group">
          <label for="tourName">Tour Name:</label>
          <input type="text" v-model="tour.TOUR_NAME" required />
        </div>
        <div class="form-group">
          <label for="type">Type:</label>
          <input type="text" v-model="tour.TYPE" required />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="isActive">Active:</label>
          <select v-model="tour.IS_ACTIVE" required>
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
        </div>
        <div class="form-group">
          <label for="pricePerPerson">Price Per Person:</label>
          <input type="number" v-model="tour.PRICE_PER_PERSON" required />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea v-model="tour.DESCRIPTION" required></textarea>
        </div>
        <div class="form-group">
          <label for="vehicle">Vehicle:</label>
          <input type="text" v-model="tour.VEHICLE" required />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="location">Location:</label>
          <input type="text" v-model="tour.LOCATION" required />
        </div>
        <div class="form-group">
          <label for="images">Images (Select multiple files):</label>
          <input type="file" multiple @change="onFileChange" />
        </div>
      </div>

      <h3>Selected Images:</h3>
      <ul>
        <li v-for="(image, index) in IMAGES" :key="index">{{ image.name }}</li>
      </ul>

      <h3>Calendar Tour</h3>
      <div v-for="(calendar, index) in tour.CALENDAR_TOUR" :key="index">
        <div class="form-row">
          <div class="form-group">
            <label>Start Date:</label>
            <input type="date" v-model="calendar.START_DATE" required />
          </div>
          <div class="form-group">
            <label>End Date:</label>
            <input type="date" v-model="calendar.END_DATE" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Start Time:</label>
            <input type="time" v-model="calendar.START_TIME" required />
          </div>
          <div class="form-group">
            <label>Available Slots:</label>
            <input type="number" v-model="calendar.AVAILABLE_SLOTS" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Number of Days:</label>
            <input type="number" v-model="calendar.NumberOfDay" required />
          </div>
          <div class="form-group">
            <label>Number of Nights:</label>
            <input type="number" v-model="calendar.NumberOfNight" required />
          </div>
        </div>
        <button type="button" @click="removeCalendar(index)">Remove</button>
      </div>

      <button type="button" @click="addCalendar">Add New Calendar</button>

      <h3>Custom Attributes</h3>
      <div class="form-row">
        <div class="form-group">
          <label for="hotel">Hotel:</label>
          <input type="text" v-model="tour.CUSTOM_ATTRIBUTES.HOTEL" required />
        </div>
        <div class="form-group">
          <label for="restaurant">Restaurant:</label>
          <input
            type="text"
            v-model="tour.CUSTOM_ATTRIBUTES.RESTAURANT"
            required
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="visitPlace">Visit Places (Separate by commas):</label>
          <input
            type="text"
            v-model="visitPlaces"
            placeholder="Enter visit places"
            required
          />
        </div>
        <div class="form-group">
          <label for="vehiclePersenal">Personal Vehicle:</label>
          <input
            type="text"
            v-model="tour.CUSTOM_ATTRIBUTES.VEHICLE_PERSENAL"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="note">Note:</label>
          <input type="text" v-model="tour.CUSTOM_ATTRIBUTES.NOTE" />
        </div>
        <div class="form-group">
          <label for="depositPercentage">Deposit Percentage:</label>
          <input type="number" v-model="tour.DEPOSIT_PERCENTAGE" required />
        </div>
      </div>

      <h3>Select Tour Guides</h3>
      <!-- <div class="scrollable">
        <div
          v-for="(user, index) in userRoles"
          :key="user._id"
          class="form-checkbox"
        >
          <label :for="user._id">{{ user.FULLNAME }}</label>
          <input
            type="checkbox"
            :id="user._id"
            :value="user._id"
            v-model="ID_TOUR_GUIDE_SUPERVISOR"
          />
        </div>
      </div> -->
      <table class="guide-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Tour Guide Name</th>
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
              />
            </td>
            <td>
              <label :for="user._id">{{ user.FULLNAME }}</label>
            </td>
          </tr>
        </tbody>
      </table>
      <button type="submit">Create Tour</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

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
      visitPlaces: "",
      IMAGES: [],
      userRoles: [],
      selectedFiles: [],
      ID_TOUR_GUIDE_SUPERVISOR: [], // Mảng để lưu ID của tour guide
    };
  },
  mounted() {
    this.getRoleUser(); // Gọi hàm getRoleUser khi component được mount
  },
  methods: {
    async getRoleUser() {
      try {
        const token = localStorage.getItem("Token");
        const body = {
          role: "ADMIN",
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
    onFileChange(event) {
      this.selectedFiles = Array.from(event.target.files);
      this.IMAGES = [...this.selectedFiles];
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
    async createTour() {
      try {
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
          formData.append("ID_TOUR_GUIDE_SUPERVISOR[]", id); // Đính kèm từng ObjectId
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
        alert("Tour created successfully!");
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
  height: 40px; /* Chiều cao cố định cho các ô input */
}

.create-tour textarea {
  max-height: 80px; /* Chiều cao cố định cho textarea */
  resize: none; /* Ngăn không cho người dùng thay đổi kích thước textarea */
}

.guide-table {
  width: 100%;
  border-collapse: collapse; /* Hợp nhất các đường viền */
  margin-bottom: 15px; /* Khoảng cách dưới cùng */
}

.guide-table th,
.guide-table td {
  border: 1px solid #ccc; /* Đường viền cho bảng */
  padding: 8px; /* Khoảng cách bên trong ô */
  text-align: left; /* Canh lề trái */
}

.guide-table th {
  background-color: #f5f5f5; /* Màu nền cho header */
}

.scrollable {
  max-height: 150px; /* Chiều cao tối đa cho danh sách cuộn (nhỏ lại) */
  overflow-y: auto; /* Cho phép cuộn dọc */
  border: 1px solid #ccc; /* Thêm viền để phân biệt khu vực */
  border-radius: 4px; /* Bo tròn góc */
  padding: 10px; /* Thêm khoảng cách bên trong */
}

.scrollable input[type="checkbox"] {
  transform: scale(0.8); /* Nhỏ lại kích thước checkbox */
  margin-right: 5px; /* Khoảng cách giữa checkbox và label */
}

button {
  padding: 10px 20px;
  background-color: #6d4c41;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 10px;
  width: 100%; /* Chiều rộng 100% cho nút */
}

button:hover {
  background-color: #5d4037;
}
</style>
