import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
  state: () => ({
    id: "",
    username: "",
    avatar: "",
  }),
  actions: {
    setUser(user) {
      this.id = user.id;
      this.username = user.username;
      this.avatar = user.avatar;
    },
    clearUser() {
      this.id = "";
      this.username = "";
      this.avatar = "";
    },
  },
});
