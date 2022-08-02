<template>
  <div id="home">
    <el-container>
      <el-aside :width="$store.state.menu.isCollapse ? '64px' : '200px'"
        ><side-bar :menuList="menuList"
      /></el-aside>
      <el-container>
        <el-header class="head">
          <Header class="header"></Header>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script> 
import SideBar from "./layout/SideBar.vue";
import Header from "./layout/Header.vue";
// import menu from "../../api/menu";
export default {
  name: "backIndex",
  data() {
    return {
      menuList: [],
    };
  },
  methods: {
    queryMenus() {   
      this.menuList = [
        {
          id: "1",
          name: "首页",
          path: "home",
          pid: "-1",
          icon: "el-icon-s-home",
          sort: 1,
          delFlag: 0,
          children: [],
        },
        { 
          id: "2",
          name: "echarts图表",
          path: "echarts",
          pid: "-1",
          icon: "el-icon-menu",
          sort: 1,
          delFlag: 0,
          children: [
            {
              id: "3",
              name: "柱形图",
              path: "first",
              pid: "1",
              icon: "el-icon-user-solid",
              sort: 2,
              delFlag: 0,
            },
            {
              id: "4",
              name: "扇形图",
              path: "add",
              pid: "1",
              icon: "el-icon-user-solid",
              sort: 3,
              delFlag: 0,
            },
          ],
        },
        {
          id: "3",
          name: "svg",
          path: "svg",
          pid: "-1",
          icon: "el-icon-menu",
          sort: 1,
          delFlag: 0,
          children: [
            {
              id: "3",
              name: "svg-1",
              path: "svg-1",
              pid: "1",
              icon: "el-icon-user-solid",
              sort: 2,
              delFlag: 0,
            },
            {
              id: "4",
              name: "svg-2",
              path: "svg-2",
              pid: "1",
              icon: "el-icon-user-solid",
              sort: 3,
              delFlag: 0,
            }, {
              id: "5",
              name: "flow",
              path: "flow",
              pid: "1",
              icon: "el-icon-user-solid",
              sort: 3,
              delFlag: 0,
            },
          ],
        },{
          id: "4",
          name: "table",
          path: "table",
          pid: "-1",
          icon: "el-icon-menu",
          sort: 1,
          delFlag: 0,
          children: [
            {
              id: "3",
              name: "table-1",
              path: "table-1",
              pid: "1",
              icon: "el-icon-user-solid",
              sort: 2,
              delFlag: 0,
            },
            {
              id: "4",
              name: "table-2",
              path: "table-2",
              pid: "1",
              icon: "el-icon-user-solid",
              sort: 3,
              delFlag: 0,
            },
          ],
        },
      ];

      // this.$store.commit("addMenu", this.menuList);
      // menu.getList().then((resp) => {
      //   this.menuList = resp.data.data;
      //   //保存到仓库
      //   this.$store.commit("addMenu", this.menuList);
      // });
    },
  },
  mounted() {
    this.queryMenus();
  },
  components: { SideBar, Header },
};
</script>

<style lang="scss" scoped>
::v-deep.el-aside {
  // background: red;
  transition: width 0.15s;
  -webkit-transition: width 0.15s;
  -moz-transition: width 0.15s;
  -webkit-transition: width 0.15s;
  -o-transition: width 0.15s;
  background-color: rgb(84, 92, 100) !important;
}
.head {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
// .header{
//   position: relative;
//   transform: translate(0, -50%);
//   top: 50%;
// }
#home {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  /* text-align: center; */
  line-height: 60px;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  height: 100vh;
  /* text-align: center; */
}
</style>