import axios from 'axios'
import host from '../appConfig.js'; 

class TenantsService {
    static async getList() {
        let _mdata = await axios.get(host + '/_/proxy/tenants');
        _mdata.data.forEach((item, index) => {
            item.key = index
        });
        return _mdata.data;
    }
    static async save(params) {
        try {
            let r= await axios.post(host + '/_/proxy/tenants',params);
            return r.statusText
            
        } catch (error) {
            return error.response.data
        }
    }
    /**
     * 删除模块
     * @param {String} moduleId  模块id
     */
    static async del(moduleId){
        try {
           
            let r= await axios.delete(host+'/_/proxy/tenants/'+moduleId,{validateStatus:function(status){
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
export default TenantsService;