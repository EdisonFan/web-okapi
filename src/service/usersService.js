import { axios,host ,axios_token, axios_tenant,axios_tenant_token} from './baseService.js';
import { SERVICE_MESSAGE, SERVICE_STATUS } from '../config/serviceConfig.js';
const queryString = require('query-string');
class UsersService {
    /**
     * Return a list of users (header里需要x-okapi-token)
     */
    static async getList(limit=100,query) {
        let queryObj={query,limit};
        let queryStr =queryString.stringify(queryObj);
        let _mdata = await axios_token.get(host + '/users?'+queryStr);
        
        return _mdata.data.users;

        // `
        // {
        //     "users" : [ {
        //       "username" : "admin",
        //       "id" : "adminId",
        //       "active" : true,
        //       "type" : "patron",
        //       "patronGroup" : "f7c3ae31-78a7-43ec-b9b7-e76669cad22f",
        //       "proxyFor" : [ ],
        //       "createdDate" : "2018-06-29T03:09:00.576+0000",
        //       "updatedDate" : "2018-06-29T03:09:00.576+0000"
        //     } ],
        //     "totalRecords" : 1,
        //     "resultInfo" : {
        //       "totalRecords" : 1,
        //       "facets" : [ ],
        //       "diagnostics" : [ ]
        //     }
        //   }
        // `
    }
    /**
     * Get a single user (header里需要x-okapi-token)
     * @param {String} userId 
     */
    static async getOne(userId) {
        let _mdata = await axios_token.get(host + `/users/${userId}`);
        return _mdata.data;
        // `
        // {
        //     "username" : "admin",
        //     "id" : "adminId",
        //     "active" : true,
        //     "type" : "patron",
        //     "patronGroup" : "f7c3ae31-78a7-43ec-b9b7-e76669cad22f",
        //     "proxyFor" : [ ],
        //     "createdDate" : "2018-06-29T03:09:00.576+0000",
        //     "updatedDate" : "2018-06-29T03:09:00.576+0000"
        // }
        // `
    }

    /**Create a user (header里需要x-okapi-token)
     * 
     * @param {string} params 
     */

    //  `
    //  {
    //     "username": "jhandey",
    //     "id": "7261ecaae3a74dc68b468e12a70b1aec",
    //     "active": true,
    //     "type": "patron",
    //     "patronGroup": "4bb563d9-3f9d-4e1e-8d1d-04e75666d68f",
    //     "meta": {
    //       "creation_date": "2016-11-05T0723",
    //       "last_login_date": ""
    //     },
    //     "personal": {
    //       "lastName": "Handey",
    //       "firstName": "Jack",
    //       "email": "jhandey@biglibrary.org",
    //       "phone": "2125551212"
    //     }
    //   }
    //  `
    static async save(params) {
        try {
            let _r= await axios_tenant_token.post(host + '/users',params);
            switch (_r.status) {
                case 201:
                    return {message:SERVICE_MESSAGE.success,status:SERVICE_STATUS.ok};
                case 400:
                    return {message:_r.data,status:SERVICE_STATUS.error};
                default:
                    return {message:SERVICE_MESSAGE.unknown_err,status:SERVICE_STATUS.error,data:_r.data};
                    
            }
            
        } catch (error) {
            return error;
        }
    }
    /**
     * Delete user item with given {userId} 
     * @param {String} moduleId  模块id
     */
    static async del(userId){
        try {
           
            let r= await axios_tenant_token.delete(host+`/users/${userId}`,{validateStatus:function(status){
                return status <600;
              }});
            return {status:r.status,message:r.data};
        } catch (error) {
            return error;
        }
    }

    static async bindModule(params,tenantId){
        try {
            let r= await axios.post(host + '/_/proxy/tenants/'+tenantId+'/modules',params);
            return r.statusText;
            
        } catch (error) {
            return error.response.data;
        }
    }
    static async unBindModule(tenant_id,module_id){
        try {
            let r= await axios.delete(host + '/_/proxy/tenants/'+tenant_id+'/modules/'+module_id);
            return r.statusText;
            
        } catch (error) {
            return error;
        }
    }
}
export default UsersService;