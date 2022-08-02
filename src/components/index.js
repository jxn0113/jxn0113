// index.js文件
import Vue from "vue";
import SvgIcon from "@/components/SvgIcon/index.vue"; // svg组件
import pdfAll from "@/components/pdfAll/index.vue"
// 注册为全局组件
// Vue.component("svg-icon", SvgIcon);
//context为svg文件夹位置
const req = require.context("@/icons/svg", false, /\.svg$/);
const requireAll = (requireContext) =>
  requireContext.keys().map(requireContext);
requireAll(req);

//利用Vue.use
export default {
  install(Vue){
    Vue.component("svg-icon", SvgIcon);
    Vue.component("pdfAll", pdfAll);
  }
}
