import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "../views/Layout";

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    name: "Layout",
    component: Layout,
    redirect:'/home',
    children:[
      {
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
      meta: {title: '首页', icon: 'home'}
    },
    {
      path: 'echarts',
      name: 'echarts',
      component: Layout,
      redirect:'/echarts/first',
      meta:{title: 'echarts图表'},
      children:[{
        path:'first',
        name:'first',
        component:() => import('../views/echarts/first.vue'),
        meta:{title:'柱形图'}
      },{
        path:'add',
        name:'add',
        component:() => import('../views/echarts/add.vue'),
        meta:{title:'扇形图'}
      }]
    },
    {
      path: 'svg',
      name: 'svg',
      component: Layout,
      redirect:'/svg/svg-1',
      meta:{title: 'svg图'},
      children:[{
        path:'svg-1',
        name:'svg-1',
        component:() => import('../views/svg/index.vue'),
        meta:{title:'svg-1'}
      },{
        path:'svg-2',
        name:'svg-2',
        component:() => import('../views/svg/svg-2.vue'),
        meta:{title:'svg-2'}
      },{
        path:'flow',
        name:'flow',
        component:() => import('../views/svg/flow.vue'),
        meta:{title:'flow'}
      }]
    },{
      path: 'table',
      name: 'table',
      component: Layout,
      redirect:'/table/table-1',
      meta:{title: 'table图'},
      children:[{
        path:'table-1',
        name:'table-1',
        component:() => import('../views/table/index.vue'),
        meta:{title:'table-1'}
      },{
        path:'table-2',
        name:'table-2',
        component:() => import('../views/table/table-2.vue'),
        meta:{title:'table-2'}
      }]
    },
    ]
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
    // children: [
    //   {
    //     // path: "/about/login", //和下面一样效果
    //     path: "login",
    //     name: "Login",
    //     component: () => import("../views/login/index.vue"),
    //   },
    // ],
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import("../views/login/index.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("userName");
  if (to.matched.length === 0) {
    // 匹配不到路由
    from.name
      ? next({
          name: from.name,
        })
      : next("/");
  } else if (token) {
    next();
  } else if (to.name === "Login") {
    next();
  } else {
    // let request = getRequest();
    //重新获取用户信息
    // if (request.user) {
    //   next(false);
    //   checkOaInfo(request.user)
    //     .then((res) => {
    //       if (res.data.code === 200) {
    //         sessionStorage.setItem("userName", request.user);
    //         const baseURL = process.env.VUE_APP_BASE_API;
    //         let url = "";
    //         if (baseURL.includes("api-pro")) {
    //           url = "http://cloudsense.winnermedical.com";
    //         } else if (baseURL.includes("api-test")) {
    //           url = "http://192.168.219.225:8099";
    //         } else {
    //           url = "http://localhost:8080";
    //         }
    //         window.location.href = url;
    //       } else {
    //         next("/login");
    //       }
    //     })
    //     .catch((err) => {
    //       next("/login");
    //     });
    // } else {
    next("/login");
    // }
  }
});
export default router;
