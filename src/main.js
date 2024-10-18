import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import router from "./router/router";
import { createPinia } from "pinia";

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
// Andt vue
import Andt from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
library.add(fas, far, fab);
dom.watch();
const app = createApp(App);
const pinia = createPinia();
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(pinia);
app.use(router);
app.use(Andt);
app.config.globalProperties.$filters = {
  formatCurrency(value) {
    if (typeof value !== "number") {
      return value;
    }
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return formatter.format(value);
  },
};
app.mount("#app");
