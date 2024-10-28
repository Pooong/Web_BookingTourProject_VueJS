<template>
  <div class="containPage">
    <h2>Quản lí người dùng</h2>
    <div class="contentPage" v-if="isLogin">
      <a-tabs v-model:activeKey="activeKey">
        <!-- Tab cho khách hàng -->
        <a-tab-pane key="1" tab="Khách hàng">
          <h4>Danh sách người dùng</h4>
          <a-table :dataSource="data" :columns="columns" rowKey="_id">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'PHOTO_URL'">
                <img
                  :src="record.PHOTO_URL"
                  alt="User Photo"
                  class="user-photo"
                />
              </template>
              <template v-else-if="column.key === 'IS_BLOCKED'">
                <span>
                  {{ record.IS_BLOCKED?.CHECK ? "Đã khóa" : "Đang hoạt động" }}
                </span>
              </template>
              <template v-else-if="column.key === 'action'">
                <button
                  @click="openConfirmModal(record)"
                  :class="[
                    'block-btn',
                    { 'unblock-btn': !record.IS_BLOCKED?.CHECK },
                  ]"
                >
                  {{ record.IS_BLOCKED?.CHECK ? "Mở khóa" : "Khóa" }}
                </button>
              </template>
              <template v-else>
                {{ record[column.dataIndex] }}
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <!-- Tab cho nhân viên -->
        <a-tab-pane key="2" tab="Nhân viên">
          <h4>Danh sách nhân viên</h4>
          <a-table :dataSource="dataStaff" :columns="columnsStaff" rowKey="_id">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'PHOTO_URL'">
                <img
                  :src="record.PHOTO_URL"
                  alt="User Photo"
                  class="user-photo"
                />
              </template>
              <template v-else-if="column.key === 'ROLE'">
                <span>
                  {{ renderRole(record.ROLE) }}
                </span>
              </template>
              <template v-else-if="column.key === 'IS_BLOCKED'">
                <span>
                  {{ record.IS_BLOCKED?.CHECK ? "Đã khóa" : "Đang hoạt động" }}
                </span>
              </template>
              <template v-else-if="column.key === 'action'">
                <button
                  @click="openConfirmModal(record)"
                  :class="[
                    'block-btn',
                    { 'unblock-btn': !record.IS_BLOCKED?.CHECK },
                  ]"
                >
                  {{ record.IS_BLOCKED?.CHECK ? "Mở khóa" : "Khóa" }}
                </button>
              </template>
              <template v-else>
                {{ record[column.dataIndex] }}
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- Modal xác nhận -->
    <a-modal
      v-model:visible="isModalVisible"
      title="Xác nhận"
      @ok="confirmToggleBlockUser"
      @cancel="closeModal"
    >
      <p>
        Bạn có chắc chắn muốn
        {{ selectedUser?.IS_BLOCKED?.CHECK ? "mở khóa" : "khóa" }} người dùng
        này không?
      </p>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const activeKey = ref("1");
const data = ref([]);
const dataStaff = ref([]);
const isLogin = ref(localStorage.getItem("isLogin"));
const token = localStorage.getItem("Token");

// Trạng thái modal và người dùng được chọn
const isModalVisible = ref(false);
const selectedUser = ref(null);

// Cấu hình cột cho bảng
const columns = [
  { title: "Ảnh đại diện", dataIndex: "PHOTO_URL", key: "PHOTO_URL" },
  { title: "Họ tên", dataIndex: "FULLNAME", key: "FULLNAME" },
  { title: "Email", dataIndex: "EMAIL", key: "EMAIL" },
  { title: "Số điện thoại", dataIndex: "PHONE_NUMBER", key: "PHONE_NUMBER" },
  { title: "Trạng thái", dataIndex: "IS_BLOCKED", key: "IS_BLOCKED" },
  { title: "Thao tác", key: "action" },
];

const columnsStaff = [
  ...columns.slice(0, 2),
  { title: "Chức vụ", dataIndex: "ROLE", key: "ROLE" },
  ...columns.slice(3),
];

// Hàm mở modal xác nhận
const openConfirmModal = (user) => {
  selectedUser.value = user;
  isModalVisible.value = true;
};

// Đóng modal
const closeModal = () => {
  isModalVisible.value = false;
  selectedUser.value = null;
};

// Xác nhận khóa/mở khóa người dùng
const confirmToggleBlockUser = () => {
  if (selectedUser.value) {
    toggleBlockUser(selectedUser.value);
  }
  closeModal();
};

// Thay đổi trạng thái Block/Unblock User
const toggleBlockUser = (user) => {
  const payload = {
    userId: user._id,
    IS_BLOCKED: !user.IS_BLOCKED?.CHECK,
  };

  axios
    .post("http://localhost:3000/users/blockUser", payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      if (res.data) {
        user.IS_BLOCKED.CHECK = payload.IS_BLOCKED;
        updateUserList(user);
      }
    })
    .catch((err) => console.error("Error blocking/unblocking user:", err));
};

// Cập nhật danh sách người dùng
const updateUserList = (updatedUser) => {
  const listToUpdate = data.value.find((user) => user._id === updatedUser._id)
    ? data.value
    : dataStaff.value;
  const index = listToUpdate.findIndex((user) => user._id === updatedUser._id);
  if (index !== -1) listToUpdate.splice(index, 1, { ...updatedUser });
};

// Hiển thị vai trò
const renderRole = (role) => {
  if (role.ADMIN) return "Admin";
  if (role.BRANCH_MANAGER) return "Quản lý";
  if (role.STAFF) return "Nhân viên";
  return "Khách hàng";
};

// Fetch dữ liệu người dùng
// Fetch dữ liệu người dùng
const fetchData = () => {
  axios
    .get("http://localhost:3000/users/getAllUsers?tabStatus=4", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      if (res.data.success) {
        // Lọc người dùng khách hàng (không có vai trò)
        data.value = res.data.data.filter(
          (user) =>
            !user.ROLE.ADMIN && !user.ROLE.BRANCH_MANAGER && !user.ROLE.STAFF
        );

        // Lọc nhân viên (STAFF hoặc BRANCH_MANAGER)
        dataStaff.value = res.data.data.filter(
          (user) =>
            user.ROLE.STAFF || user.ROLE.BRANCH_MANAGER || user.ROLE.ADMIN
        );
      }
    })
    .catch((err) => console.error(err));
};

// Gọi hàm fetchData khi component được mount
onMounted(() => {
  fetchData();
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

.user-photo {
  width: 65px;
  height: 65px;
  object-fit: cover;
  border-radius: 50%;
}

.block-btn {
  padding: 5px 10px;
  margin: 5px;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
  background-color: #52c41a;
}

.unblock-btn {
  background-color: #ff4d4f;
}

.block-btn:hover,
.unblock-btn:hover {
  opacity: 0.8;
}
</style>
