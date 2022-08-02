<script>
export default {
  name: "custom",
  functional: true,
  props: {
    row: Object,
    // render:String,
    render: Function,
    index: Number,
  },
  render: (h, data) => {
    const params = {
      row: data.props.row,
      index: data.props.index,
    };
    //可以传字符串
    // let render=eval("render="+data.props.render)      //当render传入的字符串有函数名时，可以写成let render=eval( "("+data,props.render+")" ),即在函数字符串前后加括号
    //传值为函数时
    let render = data.props.render;
    //这里return的是render函数调用时return的值即为h(...)
    //可拆分为
    // let newh = render(h,params)  newh即为传过来的return 中的h(...)
    // return newh
    return render(h,params)
  },
};
</script>