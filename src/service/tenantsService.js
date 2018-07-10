import { axios } from './baseService.js';
import { SERVICE_STATUS, SERVICE_MESSAGE } from '../config/serviceConfig';

class TenantsService {
    static async getList() {
        try {
            let _r = await axios.get('/_/proxy/tenants');
            switch (_r.status) {
                case 200:   //success
                    return {message:SERVICE_MESSAGE.success,status:SERVICE_STATUS.ok,data:_r.data};
                case 400:   //Bad request
                    return {message:_r.data,status:SERVICE_STATUS.error};
                case 404:   //Validation errors
                    return {message:_r.data,status:SERVICE_STATUS.error};
                case 500:   //Internal server error
                    return {message:_r.data,status:SERVICE_STATUS.error};
                default:
                    return {message:SERVICE_MESSAGE.unknown_err,status:SERVICE_STATUS.error,data:_r.data};
            }
        } catch (error) {
            return {message:SERVICE_MESSAGE.unknown_err,status:SERVICE_STATUS.error,data:error};
        }
       
    }
    static async save(params) {
        try {
            let r= await axios.post('/_/proxy/tenants',params);
            return r.statusText;
            
        } catch (error) {
            return error.response.data;
        }
    }
    /**
     * 删除模块
     * @param {String} moduleId  模块id
     */
    static async del(moduleId){
        try {
           
            let r= await axios.delete('/_/proxy/tenants/'+moduleId,{validateStatus:function(status){
                return status >= 200 && status <600;
              }});
            return {status:r.status,message:r.data};
        } catch (error) {
            return error;
        }
    }

    static async bindModule(params,tenantId){
        try {
            let _r= await axios.post( '/_/proxy/tenants/'+tenantId+'/modules',params);
            switch (_r.status) {
                case 201:   //success
                    return {message:SERVICE_MESSAGE.success,status:SERVICE_STATUS.ok,data:_r.data};
               
                case 500:   //Internal server error
                    return {message:_r.data,status:SERVICE_STATUS.error};
                default:
                   return {message:SERVICE_MESSAGE.unknown_err,status:SERVICE_STATUS.error};
            }
            
        } catch (error) {
            return error.response.data;
        }
    }
    static async unBindModule(tenant_id,module_id){
        try {
            let _r= await axios.delete( '/_/proxy/tenants/'+tenant_id+'/modules/'+module_id);
            switch (_r.status) {
                case 204:   //success
                    return {message:SERVICE_MESSAGE.success,status:SERVICE_STATUS.ok,data:_r.data};
                case 400:   //Bad request
                    return {message:_r.data,status:SERVICE_STATUS.error};
                case 500:   //Internal server error
                    return {message:_r.data,status:SERVICE_STATUS.error};
                default:
                   return {message:SERVICE_MESSAGE.unknown_err,status:SERVICE_STATUS.error};
            }
            
            
        } catch (error) {
            return error;
        }
    }
}
export default TenantsService;