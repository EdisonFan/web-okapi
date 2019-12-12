import host from '../appConfig.js';
import Axios from 'axios';

let okapiHost=sessionStorage.getItem('host');
let instance = Axios.create({
    baseURL: okapiHost,
    validateStatus: status => status < 600,
});
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if (sessionStorage.getItem("x-okapi-tenant")) {
        config.headers['x-okapi-tenant'] = sessionStorage.getItem("x-okapi-tenant");
    }
    if (sessionStorage.getItem("x-okapi-tenant-temp")) {
        config.headers['x-okapi-tenant'] = sessionStorage.getItem('x-okapi-tenant-temp');
    }
    if (sessionStorage.getItem("x-okapi-token")) {
        config.headers['x-okapi-token'] = sessionStorage.getItem("x-okapi-token");
    }
    config.headers['Content-Type'] = 'application/json';
   // config.headers['okapiHost'] = okapiHost;
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
instance.interceptors.response.use(
    res => res,
    error => Promise.reject(error)
);
let axios = instance;

export { axios };