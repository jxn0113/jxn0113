<template>
  <div>
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        v-for="(item, index) in tableTitle"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :formatter="item.format"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="{ row }">
          <el-link v-if="row.id=='12987122'">1111111</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableTitle: [
        {
          prop: "id",
          label: "ID",
          width: "180",
          format(row, column, cellValue, index) {
            return 1111111111;
            // if (column.property == "id") {
            //   return 1;
            // } else {
            //   return cellValue;
            // }
          },
        },
        {
          prop: "name",
          label: "姓名",
        },
        {
          prop: "amount1",
          label: "数值 1（元）",
        },
        {
          prop: "amount2",
          label: "数值 2（元）",
        },
        {
          prop: "amount3",
          label: "数值 3（元）",
        },
      ],
      tableData: [
        {
          id: "12987122",
          name: "王小虎",
          amount1: "234",
          amount2: "3.2",
          amount3: 10,
        },
        {
          id: "12987123",
          name: "王小虎",
          amount1: "165",
          amount2: "4.43",
          amount3: 12,
        },
        {
          id: "12987124",
          name: "王小虎",
          amount1: "324",
          amount2: "1.9",
          amount3: 9,
        },
        {
          id: "12987125",
          name: "王小虎",
          amount1: "621",
          amount2: "2.2",
          amount3: 17,
        },
        {
          id: "12987126",
          name: "王小虎",
          amount1: "539",
          amount2: "4.1",
          amount3: 15,
        },
      ],
    };
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 0) {
          return [1, 2];
        } else if (columnIndex === 1) {
          return [0, 0];
        }
      }
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
  },
};
</script>