<template>
  <div>
    about
    <!-- <router-view></router-view> -->
    <!-- <div id="example-1">
      <button @click="show = !show">Toggle render</button>
      <transition name="slide-fade">
        <p v-if="show">hello</p>
      </transition>
    </div> -->
    <!-- <el-table
      ref="multipleTable"
      :data="tableData.list"
      tooltip-effect="dark"
      style="width: 100%"
      @select="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="日期" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120"> </el-table-column>
      <el-table-column prop="address" label="地址" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection()"
        >切换第二、第三行的选中状态</el-button
      >
      <el-button @click="toggleSelection()">取消选择</el-button>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="tableData.pageNum"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="tableData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    >
    </el-pagination> -->
  </div>
</template>



<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  // name: "About",
  // components: {
  //   HelloWorld,
  // },
  data() {
    return {
      show: true,
      tableData: {
        list: [
          {
            id: 1,
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路1518 弄",
          },
          {
            id: 2,
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄um",
          },
        ],
        pageNum: 1,
        pageSize: 100,
        total: 111,
      },
      multipleSelection: [],
      selectAll: [],
    };
  },
  mounted(){
    let arr = [{
      "field": "whCode",
      "operator": "like",
      "content": "100",
      "type": null
    },
    {
      "field": "whDesc",
      "operator": "like",
      "content": "对对对",
      "type": null
    }];
    console.log(arr.map(item=>{
      let obj = {}
      this.$set(obj,item.field,item.content)
      return obj
    }))
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {},
    toggleSelection() {
      // let rows = [this.tableData.list[0]]
      // let rows = this.multipleSelection;
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      console.log("select", val);
      this.selectAll[this.tableData.pageNum] = val;
      // this.multipleSelection = val;
    },
    tableDefaultSelect() {
      let rows = [];
      if (JSON.stringify(this.pageData.select) !== "[]") {
        let arr = this.pageData.select.flat();
        for (let i in arr) {
          if (
            this.tableData.list.findIndex((x) => x.whCode === arr[i].whCode) >=
            0
          ) {
            rows.push(
              this.tableData.list.findIndex((x) => x.whCode === arr[i].whCode)
            );
          }
        }
        this.$nextTick(() => {
          if (rows) {
            rows.forEach((row) => {
              this.$refs["multipleTable"].toggleRowSelection(
                this.tableData.list[row],
                true
              );
            });
          }
        });
      }
    },
  },
};
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 13s ease;
}
.slide-fade-leave-active {
  transition: all 8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(1110px);
  opacity: 0;
}
</style>