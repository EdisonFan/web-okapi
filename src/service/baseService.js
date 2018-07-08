import Axios from 'axios';
import host from '../appConfig.js';
// export default class BaseService {
//     getAxios() {

//         // axios.defaults.headers.common['x-okapi-tenant'] = 'testlib';

//         return axios
//     };
//     getHost() { return host };
// }

let axios= Axios.create();

let axios_tenant= Axios.create({
    headers:{
        'x-okapi-tenant':sessionStorage.getItem("x-okapi-tenant")||''
    }
});
let axios_token= Axios.create({
    baseURL: 'https://api.example.com',
    headers:{
        'x-okapi-token':sessionStorage.getItem("x-okapi-token")||''
    }
});
let axios_tenant_token= Axios.create({
    headers:{
        'x-okapi-tenant':sessionStorage.getItem("x-okapi-tenant")||'',
        'x-okapi-token':sessionStorage.getItem("x-okapi-token")||'',
        'Content-Type': 'application/json'
    },
    validateStatus: function (status) {
        return status < 600;
    }
});
export { axios,host,axios_tenant,axios_token,axios_tenant_token };