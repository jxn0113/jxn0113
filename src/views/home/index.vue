<template>
  <div>
    <button v-if="!obj.b"> </button>
  </div>
</template>

<script>
export default {
  data(){
    return {
      obj:{
        a:1
      }
    }
  },
  mounted() {
    console.log(new Date(2022, 1, 1));
    
    let obj = {a:1}
    console.log(!obj.b)
  },
  methods: {},
};
</script>

<style>
</style>  