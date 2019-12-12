import { axios } from './baseService.js';
import { SERVICE_STATUS,SERVICE_MESSAGE } from '../config/serviceConfig';

/**
 * modelus
 */
class ModulesService {
    static async getOne(module_id) {
        let _mdata = await axios.get('/_/proxy/modules/'+module_id);
        return _mdata.data;
    }
    static async getList() {
        try {
            let _r = await axios.get('/_/proxy/modules');
            switch (_r.status) {
                case 200:
                    _r.data.forEach((item, index) => {
                        item.key = index;
                    });
                    return {message:SERVICE_MESSAGE.success,status:SERVICE_STATUS.ok,data:_r.data};
                case 404:
                    return { message: _r.data, status: SERVICE_STATUS.error };
                default:
                    
                    return { message: _r.data, status: SERVICE_STATUS.error };
            }
           
        } catch (error) {
            return { message: error, status: SERVICE_STATUS.error };   
        }
       
    }
    static  async save(params) {
        try {
            let _r= await axios.post('/_/proxy/modules',params);
            switch (_r.status) {
                case 201:   //success
                    return {message:SERVICE_MESSAGE.success,status:SERVICE_STATUS.ok,data:_r.data};
                case 400:   //Validation errors
                    return {message:_r.data,status:SERVICE_STATUS.error};
                case 500:   //Internal server error
                    return {message:_r.data,status:SERVICE_STATUS.error};
                default:
                    return {message:SERVICE_MESSAGE.unknown_err,status:SERVICE_STATUS.error,data:_r.data};
            }
        } catch (error) {
            return error;
        }
    }
    static  async modify(moduleId,params) {
        try {
            let _r= await axios.put('/_/proxy/modules/'+moduleId,params);
            switch (_r.status) {
                case 200:   //success
                    return {message:SERVICE_MESSAGE.success,status:SERVICE_STATUS.ok,data:_r.data};
                case 400:   //success
                    return {message:_r.data,status:SERVICE_STATUS.error};
                default:
                    return {message:SERVICE_MESSAGE.unknown_err,status:SERVICE_STATUS.error,data:_r.data};
            }
        } catch (error) {
            return error;
        }
    }
    /**
     * 删除模块
     * @param {String} moduleId  模块id
     */
    static  async del(moduleId){
        try {
            let r= await axios.delete('/_/proxy/modules/'+moduleId);
            return {status:r.status,message:r.data};
        } catch (error) {
            return error;
        }
    }

    static async deploySave(params) {
        try {
            let _r= await axios.post('/_/discovery/modules',params);
            switch (_r.status) {
                case 201:   //success
                    return {message:SERVICE_MESSAGE.success,status:SERVICE_STATUS.ok,data:_r.data};
                case 400:   //Validation errors
                    return {message:_r.data,status:SERVICE_STATUS.error};
                case 500:   //Internal server error
                    return {message:_r.data,status:SERVICE_STATUS.error};
                default:
                    return {message:SERVICE_MESSAGE.unknown_err,status:SERVICE_STATUS.error,data:_r.data};
            }
            
        } catch (error) {
            return error.response.data;
        }
    }
    
    /**
     * get modules by tenantId
     * @param {string} tId tenantId  
     */
    static async getListByTanId(tId){
        try {
            let _mdata= await axios.get('/_/proxy/tenants/'+tId+'/modules');
            _mdata.data.forEach((item, index) => {
                item.key = index;
            });
            return _mdata.data;
        } catch (error) {
            return error;
        }
    }
}
export default ModulesService;