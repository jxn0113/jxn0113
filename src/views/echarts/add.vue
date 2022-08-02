<template>
  <div class="out">
    <div class="in" ref="in"></div>
  </div>
</template>

<script>
export default {
  mounted(){
    console.log(this.$refs.in.getBoundingClientRect())
    console.log(this.$refs.in.offsetLeft)
  }
}
</script>

<style>
.out{
  border: 1px solid red;
  width: 200px;
  height: 200px;
  position: relative;
}
.in{
  border: 1px solid green;
  width: 100px;
  height: 100px;
  margin-left: 10px;
}
</style>