<template>
  <div class="hello">
    <el-table :data="tableData">
      <el-table-column
        v-for="item in tabHeader"
        :prop="item.prop"
        :key="item.prop"
        :label="item.label"
      >
        <template slot-scope="scope">
          <custom
            v-if="item.render"
            :render="item.render"
            :row="scope.row"
            :index="scope.$index"
          ></custom>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-table :data="tableDatas">
      <el-table-column
        v-for="item in tabHeader"
        :prop="item.prop"
        :key="item.prop"
        :label="item.label"
      >
        <template slot-scope="scope">
          <custom
            v-if="item.render"
            :render="item.render"
            :row="scope.row"
            :index="scope.$index"
          ></custom>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import custom from "./custome";
export default {
  name: "HelloWorld",
  components: {
    custom,
  },
  data() {
    return {
      name:'凭证流',
      tableData: [
        //此数据为传字符串时
        // { name: "任务1", operate: "编辑" },
        // { name: "任务2", operate: "编辑" },
        // { name: "任务3", operate: "编辑" },
        { name: "任务1" },
        { name: "任务2" },
        { name: "任务3" },
        
      ],
      tabHeader: [
        { prop: "name", label: "任务名称" },
        {
          prop: "operate",
          label: "任务状态",
          // render:"function (h,params){let color='#333';if(params.row.operate ==='已完成'){color='green'}else if(params.row.operate ==='进行中'){color='red'} return h('span',{style:{color:color}}, params.row.operate )}"   //整个render是函数的字符串
          render: (h, params) => {
            console.log(params)
            let {row} = params
            return h({
              template: `<div>
                
                <span v-if="${row.name == '任务1'}"> <i class = "red"></i>1</span>
                <span v-if="${row.name == '任务2'}">2</span>
                <span v-if="${row.name == '任务3'}">3</span>
              </div>`,
              methods: {
                voucherFlowList: () => {
                  // this.openFlowListPage(row);
                  console.log('row',row)
                },
              },
            });
          },
          // render(h) {
          //   // console.log("this.$slots.default :>> ", this.$slots.default);
          //   return h(
          //     "h1", // 参数1，tagname
          //     { attrs: { title: 1 }}, // 参数2：{。。。}
          //     //this.$slots.default 为默认插槽
          //     //也可以定义具名插槽 this.$slots.名称 | 使用 v-slot:名称 插入
          //     12
          //   );
          // },
        },
      ],
      tableDatas: [
        { name: "任务1", operate: "查看" },
        { name: "任务2", operate: "查看" },
        { name: "任务3", operate: "查看" },
      ],
    };
  },
};
</script>

<style scoped>
.red{
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
}
</style>