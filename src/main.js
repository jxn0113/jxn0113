import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from "./router";
import store from "./store";
import commonComponent from "@/components";
import request from "./utils/request";
import "./assets/reset.css";
import "xe-utils";
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
Vue.use(VXETable);
Vue.config.productionTip = false;
Vue.prototype.$axios = request;
Vue.use(ElementUI);
Vue.use(commonComponent);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
