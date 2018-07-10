import Axios from 'axios';
import host from '../appConfig.js';
// export default class BaseService {
//     getAxios() {

//         // axios.defaults.headers.common['x-okapi-tenant'] = 'testlib';

//         return axios
//     };
//     getHost() { return host };
// }
let headersObj = [];
if (sessionStorage.getItem("x-okapi-tenant")) {
    headersObj["x-okapi-tenant"]= sessionStorage.getItem("x-okapi-tenant");
}
if (sessionStorage.getItem("x-okapi-token")) {
    headersObj["x-okapi-token"]=sessionStorage.getItem("x-okapi-token");
}

let axios = Axios.create({
    baseURL: host,
    headers: {...headersObj},
    validateStatus: function (status) {
        return status < 600;
    }
});

export { axios };