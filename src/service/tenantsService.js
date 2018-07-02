const axios = require('axios');
const host = 'http://localhost:9130';

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
            let r= await axios.delete(host+'_/proxy/tenants/'+moduleId,{baseURL:host});
            return r
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
}
export default TenantsService;