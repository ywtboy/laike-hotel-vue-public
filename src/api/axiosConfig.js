import axios from 'axios'
import store from '../store'
import { Message } from 'iview';


// import store from '../store'
// 添加请求拦截器
axios.interceptors.request.use(  
        config => {  
            config.params = {  
                    ...config.params,  
                    _t: new Date().getTime(),  
                }  
            let url = config.url
            // get 对中文参数编码 并去掉null或 ""
            if (config.method === 'get' && config.params) {
              url += '?'
              let keys = Object.keys(config.params)
              for (let key of keys) {
                if (config.params[key] !== null && config.params[key] !== '') {
                  url += `${key}=${encodeURIComponent(config.params[key])}&`
                }
                
              }
              url = url.substring(0, url.length - 1)
              config.params = {}
            }
            config.url = url
            
            return config  
        },function(error){  
            return Promise.reject(error)  
        }  
    )  

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    var status = error.response.status;
    if(status != 200) {
      switch(status)
      {
      case 400:
        console.log("请求错误400");
        Message.info("请求错误！");
      break;
      case 401:
        store.commit('setIsLogin');
        Message.info("未登录或登录超时，请登录！");
        break;
      case 402:
        // store.commit('logout');
        Message.info("您的系统已到期，请联系续期");
        break;
      case 403:
        console.log("无权限！");
        Message.error("没有权限");
        break;
      case 404:
        console.log("资源不存在");
        Message.error("资源不存在！");
        break;
      case 500:
        console.log("服务器内部错误！");
        Message.error("服务器内部错误！");
        break;
      default:
        console.log("网络错误 ： "+ status);
        Message.error("网络错误 ： "+ status);
      }
    }

    

    return Promise.reject(error);
  });

export default axios

 