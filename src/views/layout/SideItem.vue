<template>
  <div v-if="item.children">
    <template v-if="item.children.length == 0">
        <el-menu-item :index="itemPath" :disabled="item.delFlag ==1">
          <i :class="item.icon"></i>
          <span>{{item.name}}</span>
        </el-menu-item>
    </template>
    <el-submenu v-else :index="itemPath+'/'+item.path">
      <template slot="title" >
        <i :class="item.icon"></i>
        <span>{{item.name}}</span>
      </template>

      <template v-for="child in item.children">
        <side-item
          v-if="child.children&&child.children.length>0"
          :item="child"
          :rootName="rootName" :rootPath="itemPath"
          :key="child.path"/>
        <el-menu-item v-else :key="child.path" :index="itemPath+'/'+child.path" :disabled="child.delFlag == 1">
          <i :class="child.icon"></i>
          <span>{{child.name}}</span>
        </el-menu-item>
      </template>
    </el-submenu>
  </div>
  <div v-else>
      <el-menu-item :index="itemPath+'/'+item.path" :disabled="item.delFlag ==1">
        <i :class="item.icon"></i>
        <span>{{item.name}}</span>
      </el-menu-item>
  </div>
</template>

<script>
export default {
  name: 'SideItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    rootName: {
      type: String,
      required: true
    },
    rootPath: {
      type: String,
      required: true
    }
  },
  data(){
    return{
      itemPath:''
    }
  },
  created() {
    this.itemPath = this.rootPath +'/'+ this.item.path;
  }
}
</script>
