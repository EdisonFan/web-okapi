const axios = require('axios');
const host = 'http://localhost:4000';

class ModulesService {
    static async getList() {
        let _mdata = await axios.get(host + '/_/discovery/modules');
        _mdata.data.forEach((item, index) => {
            item.key = index
        });
        return _mdata.data;
    }
    static async save(params) {
        try {
            let r= await axios.post(host + '/_/discovery/modules',params);
            return r.statusText
            
        } catch (error) {
            return error.response.data
        }
    }
    /**
     * 删除模块
     * @param {String} moduleId  模块id
     */
    static async del(moduleId,instId){
        try {
            let r= await axios.delete(host+'/_/discovery/modules/'+moduleId+'/'+instId);
            return r
        } catch (error) {
            return error
        }
    }

    
}
export default ModulesService;