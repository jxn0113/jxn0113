import axios from 'axios'
import { showLoading, hideLoading } from './loadind';
import router from '../router';
import { Message } from 'element-ui';
const CancelToken = axios.CancelToken;
let requestMap = [];

/** 
 * 提示函数 
 * 禁止点击蒙层、显示2秒后关闭
 */
 const tip = msg => { 
    Message.warning(msg, 2);
};

/** 
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    router.replace({ name: 'login' });
};
//创建axios实例
const service = axios.create({
    // baseURL : process.env.VUE_APP_BASE_URL,
    timeout : 15000
});


// 设置post请求头
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';


//request拦截器
service.interceptors.request.use(config=>{
    // console.log(showLoading())
    // 让每个请求携带自定义token token一般在登录时进行记录在cookies
    // if(token){
    //     config.headers['Authorization'] = 'cookies'
    // }
    const { loading,stopRepeat } = config.headers;
    // 防重复提交
    if(stopRepeat){
        let cancel = '';
        config.cancelToken = new CancelToken(function executor(c) {
            // executor 函数接收一个 cancel 函数作为参数
            cancel = c;
        });
        stopRepeatRequest(config, cancel);
    };
     // loading遮罩
    if (loading) {
        showLoading(loading);
    }
    return config
},error=>{
    console.log(error);
    Promise.reject(error);
});



//respone拦截器
service.interceptors.response.use(response=>{
    // 在2xx范围内的任何状态代码都会触发此函数，这里主要用于处理响应数据
    if (response.config.headers.loading) {
        hideLoading();
    };
    removeRequestMap(response.config);
     /**
       * @data 响应数据
       * @status 响应的 HTTP 状态码
       * @statusText 响应的 HTTP 状态信息
       * @headers response响应头
       * @config request请求的配置信息
       * **/
      if (response.data.code === 200 || response.data.message == '请求失败，没有访问权限！') {
        const { status, data } = response;
        return { statusCode: status, data };
      } else {
        Message({
          showClose: true,
          message: response.data.message,
          type: 'error',
        });
        return Promise.reject(response.data);
      }
},error=>{
    // 任何超出2xx范围的状态码都会触发此函数，这里主要用于处理响应错误
    console.log(error)
    if(error.message.includes('timeout')) tip('请求超时，请重新刷新页面');
    if(typeof error.message === 'object') {
        console.log('重复请求已阻止',error.message.requestDetail);
        return Promise.reject(error);
    };
    if(error.response){
        switch(error.response.status){
            case 401:
                toLogin();
                break
            case 403:
                Message({
                    showClose: true,
                    message: '暂无查看权限，请联系管理员',
                    type: 'error',
                })
                break
            case 404:
            Message({
                showClose: true,
                message: '路径不存在',
                type: 'error',
            })
            break
    
            default:
            Message({
                showClose: true,
                message: error.response.data.message,
                type: 'error',
            })   
        }
    }else{
        Message({
            showClose: true,
            message: "没有网络，请检查是否已联网",
            type: 'error',
        })
    }
    removeRequestMap(error.config);
    hideLoading();
    return Promise.reject(error);
})



/**
 * 阻止重复请求
 * @param newRequest
 * @param cancel
 */
let stopRepeatRequest = function ( newRequest ,cancel) {
    if(checkRepeatRequest(newRequest, 'request') === -1) {
      return false
    }
    cancel({status:'cancelRequest',requestDetail:newRequest})
    console.log('阻止请求', newRequest.url)
    // return Promise.resolve()
}

/**
 * 判断请求是否重复
 * @param request
 * @param type // request / response
 * @returns {number}
 */
 let checkRepeatRequest = function(request,type){
    let params = request.method === 'get' ? `${request.url}:${ObjectToString(request.params)}` : `${request.url}:${ObjectToString(request.data)}`
    let hasRequest = requestMap.findIndex(ele=>{
      return ele && (ele.params === params)
    })
    if(hasRequest === -1 && type === 'request') {
      requestMap.push({
        params: params,
      })
    }
    return hasRequest
}

/**
 * 请求完成后，清除请求缓存map
 * @param request
 */
 let removeRequestMap = function ( request ) {
    let index = checkRepeatRequest(request, 'response')
    if(index !== -1) requestMap.splice(index, 1)
  }
  /**
   * 对象转字符串
   * @return {string}
   */
  let ObjectToString = function (ele) {
    if (!ele) return
    if (typeof ele === 'object'){
      return JSON.stringify(ele)
    }
    return ele.toString()
  }
  export default service