<template>
  <!-- <div class="sidebar-container"> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        style="font: 20px '楷体'"
        :default-active="activeMenu"
        :collapse="isCollapse"
        unique-opened
        router
        background-color="#545c64"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        class="menu"
        :collapse-transition = "false"
      >
        <sidebar-item
          v-for="menu in menuList"
          :key="menu.path"
          :item="menu"
          :rootName="''"
          :rootPath="''"
        />
      </el-menu>
    </el-scrollbar>
  <!-- </div> -->
</template>
<script>
import SidebarItem from "./SideItem.vue";
export default {
  name: "Sidebar",
  components: { SidebarItem },
  props: {
    menuList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeMenu: "",
    };
  },
  watch: {
    $route() {
      // console.log('$route')
      this.getactiveMenu();
    },
  },
  computed: {
    isCollapse() {
      return this.$store.state.menu.isCollapse;
    },
  },
  created() {
    this.getactiveMenu();
  },
  mounted() {
    console.log(this.menuList);
  },
  methods: {
    getactiveMenu() {
      // debugger
      // console.log('getactiveMenu')
      // console.log(this.$route.matched); //可以获取上下文路由 也就是可以获取父亲和孩子路由组成的数组
      this.activeMenu = this.$route.matched.slice(-1)[0].path;
    },
  },
};
</script>
<style lang="scss" scoped>
.menu {
  width: 100%;
  height: 100vh;
}
//  ::v-deep.el-menu-vertical-demo:not(.el-menu--collapse) {
//   width: 100%;
//   height: 100vh;
// }
::v-deep.el-menu--collapse .el-submenu__title span {
  height: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
::v-deep .el-menu--collapse .el-menu-item span {
  height: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
::v-deep.el-menu--collapse .el-submenu__icon-arrow {
  display: none;
}
</style>
