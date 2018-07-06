import axios from 'axios'
import host from '../appConfig.js'; 

class ModulesService {
    static async getOne(module_id) {
        let _mdata = await axios.get(host + '/_/proxy/modules/'+module_id);
        return _mdata.data;
    }
    static async getList() {
        let _mdata = await axios.get(host + '/_/proxy/modules');
        _mdata.data.forEach((item, index) => {
            item.key = index
        });
        return _mdata.data;
    }
    static async save(params) {
        try {
            let r= await axios.post(host + '/_/proxy/modules',params,{
                header:{
                    'Content-Type':'application/json'
                }
            });
            return r.statusText
            
        } catch (error) {

            return error
        }
    }
    /**
     * 删除模块
     * @param {String} moduleId  模块id
     */
    static async del(moduleId){
        
        try {
            let r= await axios.delete(host+'/_/proxy/modules/'+moduleId,{validateStatus:function(status){
                return status >= 200 && status <500;
              }});
            return {status:r.status,message:r.data}
           
        } catch (error) {
            console.log('r',error);
            return 123
        }
    }

    static async deploySave(params) {
        try {
            let r= await axios.post(host + '/_/discovery/modules',params);
          
            
            return r.statusText
            
        } catch (error) {
            return error.response.data
        }
    }
    
    /**
     * get modules by tenantId
     * @param {string} tId tenantId  
     */
    static async getListByTanId(tId){
        try {
            let _mdata= await axios.get(host+'/_/proxy/tenants/'+tId+'/modules');
            _mdata.data.forEach((item, index) => {
                item.key = index
            });
            return _mdata.data;
        } catch (error) {
            return error
        }
    }
}
export default ModulesService;