<template>
  <div>
    <el-row class="process_list">
      <div>11111111</div>
      <div>11111111</div>
    </el-row>
    <div class="box">
      <label for="book1">
        <input type="checkbox" name="book" id="book1" v-model="checked" />
        <span></span>
      </label>
    </div>
    <!-- svg -->
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
      <path d="M150 100 L10 50 L290 50 Z" />
    </svg>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
    };
  },
  watch: {
    checked: {
      handler(newVal, oldVal) {
        console.log(newVal);
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.process_list {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
input {
  display: none;
}
/*按钮样式*/
.box {
  position: relative;
  line-height: 30px;
}
input[type="checkbox"] + span::before {
  display: block;
  width: 20px;
  height: 20px;
  content: "";
  border: 1px solid #de3e3e;
  box-sizing: border-box;
  border-radius: 50%;
  position: absolute;
}

input[type="checkbox"] + span::after {
  display: block;
  width: 20px;
  height: 20px;
  content: "";
  background: #de3e3e;
  float: left;
  border-radius: 50%;
  transform: scale(0);
}
input[type="checkbox"]:checked ~ span::after {
  transform: scale(0.7);
}
</style>