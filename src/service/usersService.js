import axios from 'axios'
import host from '../appConfig.js'; 

class UsersService {
    /**
     * Return a list of users (header里需要x-okapi-token)
     */
    static async getList() {
        let _mdata = await axios.get(host + '/users',{
            headers:{
                "x-okapi-token":"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJfaWQiOiJhZG1pbklkIiwidGVuYW50IjoidXNlcmxpYiJ9.6rBlXLPRQYz9tZ7y2-CVv3Ao2Gpyhb9FKHWzTdPnghd-nx_lejEpaIKw1aYICYVCrVmAndSGuh45E59FCit9bg"
            }
        });
       
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
        let _mdata = await axios.get(host + `/users/${userId}`);
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
            let r= await axios.post(host + '/users',params);
            return r.statusText
            
        } catch (error) {
            return error.response.data
        }
    }
    /**
     * Delete user item with given {userId} 
     * @param {String} moduleId  模块id
     */
    static async del(userId){
        try {
           
            let r= await axios.delete(host+`/users/${userId}`,{validateStatus:function(status){
                return status >= 200 && status <600;
              }});
            return {status:r.status,message:r.data}
        } catch (error) {
            return error
        }
    }

    static async bindModule(params,tenantId){
        try {
            let r= await axios.post(host + '/_/proxy/tenants/'+tenantId+'/modules',params);
            return r.statusText
            
        } catch (error) {
            return error.response.data
        }
    }
    static async unBindModule(tenant_id,module_id){
        try {
            let r= await axios.delete(host + '/_/proxy/tenants/'+tenant_id+'/modules/'+module_id);
            return r.statusText
            
        } catch (error) {
            return error
        }
    }
}
export default UsersService;