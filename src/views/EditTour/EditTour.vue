<template>
  <div class="create-tour">
    <h1>Chỉnh sửa Tour</h1>
    <form @submit.prevent="updateTour">
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
            <input type="file" multiple @change="onChaneFile" />
          </div>
        </div>

        <h3>Ảnh đã chọn:</h3>
        <ul style="display: flex; list-style: none; flex-wrap: wrap">
          <li
            v-for="(image, index) in tour.IMAGES"
            :key="index"
            style="position: relative; margin: 5px"
          >
            <img
              :src="typeof image === 'string' ? image : image.url"
              alt="Selected Image"
              class="selected-image"
            />
            <button
              type="button"
              class="delete-image-btn"
              @click="removeImage(index)"
            >
              X
            </button>
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
                date-format="MM-dd-yyyy"
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
                :min="calendar.NumberOfDay - 1"
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
              v-model="tour.CUSTOM_ATTRIBUTES.VISIT_PLACE"
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
                @change="toggleSupervisor(user._id)"
                :checked="isChecked(user._id)"
                class="checkbox-small"
              />
            </td>
            <td>
              <label :for="user._id" class="label-small">
                {{ user.FULLNAME }}
              </label>
            </td>
          </tr>
        </tbody>
      </table>

      <button type="submit" class="createTour">Cập nhật</button>
    </form>
  </div>
</template>

<script setup>
// Existing imports...
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { ref, onMounted, reactive } from "vue";

// Khai báo các biến và hàm
const route = useRoute();
const router = useRouter();
const tourId = route.params.id; // Lấy ID từ URL
console.log(tourId);
// Initial tour data to compare changes
let initialTourData = reactive({});

// Existing tour object
const tour = ref({
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
  IMAGES: [],
  CUSTOM_ATTRIBUTES: {
    HOTEL: "",
    RESTAURANT: "",
    VISIT_PLACE: [],
    VEHICLE_PERSENAL: "",
    NOTE: "",
  },
  DEPOSIT_PERCENTAGE: 30,
});
const userRoles = ref([]);
const ID_TOUR_GUIDE_SUPERVISOR = ref([]);
const ID_TOUR_CHECKED = ref([]);
const selectedFiles = ref([]);
// Hàm kiểm tra sự thay đổi của dữ liệu
const getChangedData = (currentData, initialData) => {
  const changedData = {};

  Object.keys(currentData).forEach((key) => {
    if (JSON.stringify(currentData[key]) !== JSON.stringify(initialData[key])) {
      changedData[key] = currentData[key];
    }
  });

  return changedData;
};
const toggleSupervisor = (userId) => {
  const index = ID_TOUR_GUIDE_SUPERVISOR.value.indexOf(userId);
  if (index > -1) {
    // Nếu đã tồn tại, xóa ID
    ID_TOUR_GUIDE_SUPERVISOR.value.splice(index, 1);
    console.log(ID_TOUR_GUIDE_SUPERVISOR.value);
  } else {
    // Nếu chưa tồn tại, thêm ID
    console.log(ID_TOUR_GUIDE_SUPERVISOR.value);

    ID_TOUR_GUIDE_SUPERVISOR.value.push(userId);
  }
};
// Hàm xử lý cập nhật tour chỉ với các trường đã thay đổi
const updateTour = async () => {
  try {
    const token = localStorage.getItem("Token");

    // Lấy dữ liệu đã thay đổi so với dữ liệu ban đầu
    const changedData = getChangedData(tour.value, initialTourData);

    if (
      Object.keys(changedData).length === 0 &&
      selectedFiles.value.length === 0
    ) {
      toast.info("Không có thay đổi nào!");
      return;
    }

    // Chuẩn bị FormData cho các trường đã thay đổi
    const formData = new FormData();
    formData.append("ID_TOUR", tourId);

    Object.keys(changedData).forEach((key) => {
      if (key === "IMAGES") {
        changedData[key].forEach((image) => {
          // Đính kèm mỗi tệp đã chọn vào formData với tên là 'IMAGES[]'
          if (selectedFiles.value.length > 0) {
            selectedFiles.value.forEach((file) => {
              formData.append("IMAGES[]", file);
            });
          } else {
            changedData[key].forEach((image) => {
              formData.append("IMAGES[]", image);
            });
          }
        });
      } else if (key === "CALENDAR_TOUR") {
        changedData[key].forEach((calendar, index) => {
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
            `CALENDAR_TOUR[${index}][AVAILABLE_SLOTS]`,
            calendar.AVAILABLE_SLOTS
          );
          formData.append(
            `CALENDAR_TOUR[${index}][NumberOfDay]`,
            calendar.NumberOfDay
          );
          formData.append(
            `CALENDAR_TOUR[${index}][NumberOfNight]`,
            calendar.NumberOfNight
          );
        });
      } else if (key === "CUSTOM_ATTRIBUTES") {
        Object.keys(changedData[key]).forEach((subKey) => {
          formData.append(
            `CUSTOM_ATTRIBUTES[${subKey}]`,
            changedData[key][subKey]
          );
        });
      } else {
        formData.append(key, changedData[key]);
      }
    });

    await axios.put(`http://localhost:3000/tours/edit/${tourId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Cập nhật tour thành công!");
    router.push("/admin/about");
  } catch (error) {
    console.error("Lỗi khi cập nhật tour:", error);
    toast.error("Cập nhật tour thất bại!");
  }
};

const getRoleUser = async () => {
  try {
    const token = localStorage.getItem("Token");
    const body = { role: true };
    const response = await axios.post(
      "http://localhost:3000/users/role",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Gán dữ liệu trả về vào userRoles
    userRoles.value = response.data.data;

    // Lọc các user có ít nhất một role là true và thêm vào ID_TOUR_GUIDE_SUPERVISOR
    ID_TOUR_GUIDE_SUPERVISOR.value = userRoles.value
      .filter((user) => Object.values(user.ROLE).some((role) => role))
      .map((user) => user._id.toString());

    console.log("ID_TOUR_GUIDE_SUPERVISOR:", ID_TOUR_GUIDE_SUPERVISOR.value);
  } catch (error) {
    console.error("Error fetching user roles:", error);
  }
};
const removeImage = (index) => {
  if (tour.value.IMAGES.length > 1) {
    tour.value.IMAGES.splice(index, 1);
  } else {
    toast.error("Cần ít nhất 1 ảnh!");
  }
};
const isChecked = (userId) => {
  ID_TOUR_GUIDE_SUPERVISOR.value = ID_TOUR_CHECKED.value;
  return ID_TOUR_GUIDE_SUPERVISOR.value.includes(userId);
};
// Hàm xử lý thay đổi file
// Hàm xử lý thay đổi tệp
const onChaneFile = (event) => {
  selectedFiles.value = Array.from(event.target.files);
  const newImages = selectedFiles.value.map((file) => ({
    name: file.name,
    url: URL.createObjectURL(file),
  }));

  // Cập nhật ảnh trong tour.IMAGES
  tour.value.IMAGES = [...tour.value.IMAGES, ...newImages];
};
// Hàm lấy chi tiết tour và gán vào initialTourData
const getTourDetails = async () => {
  try {
    const token = localStorage.getItem("Token");

    const response = await axios.get(`http://localhost:3000/tours/${tourId}`, {
      params: {
        id: tourId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Gán dữ liệu ban đầu cho initialTourData
    initialTourData = { ...response.data.tour };

    // Gán lại dữ liệu tour hiện tại
    tour.value = {
      ...response.data.tour,
      IMAGES: response.data.tour.IMAGES,
      CALENDAR_TOUR: response.data.tour.CALENDAR_TOUR.map((calendar) => ({
        ...calendar,
        START_DATE: new Date(calendar.START_DATE).toISOString().split("T")[0],
        END_DATE: new Date(calendar.END_DATE).toISOString().split("T")[0],
      })),
    };

    ID_TOUR_CHECKED.value =
      response.data.tour.ID_TOUR_GUIDE_SUPERVISOR.map((e) => e._id) || [];
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tour:", error);
    toast.error("Không thể tải thông tin tour.");
  }
};

// Gọi các hàm khi component được mounted
onMounted(() => {
  getTourDetails();
  getRoleUser();
});
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
.selected-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  position: relative;
}

.delete-image-btn {
  position: absolute;
  top: -5px;
  right: 5px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  margin: 0;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1;
}

.delete-image-btn:hover {
  background-color: darkred;
}
</style>
