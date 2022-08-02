<template>
  <div class="header">
    <button @click="collapse">展开关闭</button>
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item
          :to="{path: item.path}"
          v-for="(item, index) in breadList"
          :key="index"
      >
        {{item.meta.title}}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>

// template: `<div class = "outer">
        //       <div v-for = "(item,index) in enclosureList" :key = "index" class = "outer-delete">
        //         <el-link type="primary" :underline = "false"  @click="reviewEnclosure(item)" :disabled = "(${(status && this.disabledOperate)}) || item.fileStatus == 'delete'" 
        //         class = 'name' :class = '{"delete-item" :!item.fileStatus && (${status && !this.disabledOperate}) , update : item.fileStatus && item.fileStatus != "validate" && (${status && !this.disabledOperate}) , "disabled" : ((item.fileStatus != null && !item.fileStatus) || item.fileStatus == "delete") && (${this.__QUERY__.isDetail !=2}) }'>{{item.fileName + '.' + item.fileSuffix}}</el-link>
        //         <i class = "p-icon-trash delete-trash" @click="deleteItem(item)" v-if="(${!status && this.disabledOperate}) && item.fileStatus != 'delete'"><i/>
        //       </div>   
        // </div>`,
import { mapState } from "vuex";
import { mapMutations } from "vuex";
export default {
  data(){
    return{
      breadList: []
    }
  },
  created() {
    this.getBreadcrumb();
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  computed: {
    // ...mapState({
    //     isCollapse : (state)=>state.menu.isCollapse
    // })
  },
  methods: {
    ...mapMutations(["changeIsCollapse"]),
    collapse() {
      this.changeIsCollapse();
      // this.isCollapse = true
      // this.$store.state.menu.isCollapse = !this.$store.state.menu.isCollapse
    },
    getBreadcrumb() {
      console.log('matched',this.$route.matched)  //可以获取上下文路由 也就是可以获取父亲和孩子路由组成的数组
      if (Object.keys(this.$route.matched[1].meta).length > 0) {
        if(Object.keys(this.$route.matched[0].meta).length == 0 && this.$route.matched[1].meta.path !=='/home'){
          // this.$route.matched[0].meta.title = '首页';
          // this.$route.matched[0].path = '/home'
        }
        this.breadList = this.$route.matched
      } else {
        this.breadList = []
      };
      this.breadList = this.breadList.filter(item=>{
        return item.path!='' && item.path != '/home'
      })
      console.log('breadList',this.breadList)
    }
  },
  
};
</script>

<style lang="scss" scoped>
.header{
    display: flex;
    align-items: center;
}
::v-deep .el-breadcrumb__separator {
  color: black;
}
</style>