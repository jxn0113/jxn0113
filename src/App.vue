<template>
  <div id="app">
    <!-- <div id="nav"> -->
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
    <!-- </div> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  mounted(){
    new Promise((resolve,reject)=>{
      resolve(123)
    }).then((result)=>{
      console.log(result)
    })
    // this.$axios.post('/admin/login',{
    //   username : '3704',
    //   password: '111111'
    // });
    var obj = [{name:'hzhou'},{name:'hefei'},{name:'hefei'},{name:'shh'},{name:'hzhou'}];
    let arr = [];
    console.log(obj.reduce((acc,item)=>{
      let index = arr&&arr.findIndex(val=>val==item.name);
      let length = arr.length;
      if(index==-1){    
        acc[length] = [];
        acc[length].push(item)
        arr[length] = item.name;
      }else{
        acc[index].push(item)
      }
      return acc
    },[]))
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
