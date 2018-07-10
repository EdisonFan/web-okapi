import Axios from 'axios';
import host from '../appConfig.js';
// export default class BaseService {
//     getAxios() {

//         // axios.defaults.headers.common['x-okapi-tenant'] = 'testlib';

//         return axios
//     };
//     getHost() { return host };
// }



let instance = Axios.create({
    baseURL: host,
    validateStatus: function (status) {
        return status < 600;
    }
});
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if(sessionStorage.getItem("x-okapi-tenant")){
        config.headers['x-okapi-tenant']=sessionStorage.getItem("x-okapi-tenant");
    }
    if(sessionStorage.getItem("x-okapi-token")){
        config.headers['x-okapi-token']=sessionStorage.getItem("x-okapi-token");
    }
    config.headers['Content-Type']='application/json';
    console.log(config.headers);
    
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return error;
  });

let axios = instance;

export { axios };