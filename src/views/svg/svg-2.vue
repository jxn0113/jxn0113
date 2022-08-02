<template>
  <div>
    <input
      name="checkbox"
      value="Item 1"
      type="checkbox"
      class="tui-checkbox"
    />
    <!-- <label for="checkbox"></label> -->
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    let a = [];
    a.push({ a: 1 }, { b: 2 });
    console.log(a);
    let b = {
      type: 0,
    };
    let c = "run";
    console.log(c == "run" && !b.type);
    const debounce = (fn, delay, immediate) => {
      let timer, debounced;
      debounced = function () {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        if (immediate) {
          let startNow = !timer;
          timer = setTimeout(function () {
            timer = null;
          }, delay);
          if (startNow) {
            fn.apply(context, args);
          }
        } else {
          timer = setTimeout(function () {
            fn.call(context, ...args);
          }, delay);
        }
        console.log('debounced',debounced.cancel)
      };
      debounced.cancel = function () {
        clearTimeout(timer);
        timer = null;
      };
      return debounced;
    };
    debounce(()=>console.log(12),1000,true)(); 
  },
};
</script>

<style>
.tui-checkbox {
  position: relative;
  -webkit-appearance: none;
  display: inline-block;
  vertical-align: top;
  cursor: default;
  -webkit-appearance: none;
  -webkit-user-select: none;
  user-select: none;
  -webkit-transition: background-color ease 0.1s;
  transition: background-color ease 0.1s;
  outline: none;
  border: 1px solid #00e;
  width: 18px;
  height: 18px;
  -webkit-border-radius: 50%;
  background: none;
  vertical-align: middle;
  margin: 0;
  padding: 0;
}

.tui-checkbox:checked {
  background: #1673ff;
}

.tui-checkbox:checked::after {
  -webkit-border-radius: 50%;
  background-color: #fff;
  position: absolute;
  content: "";
  border: none;
  height: 10px;
  width: 10px;
  top: 3px;
  left: 3px;
}
</style>