import { axios } from './baseService.js';

class DeployService {
    static async getOne(service_id,instance_id) {
        try {
            let _r = await axios.get(+ `/_/discovery/modules/${service_id}/${instance_id}`, {
                validateStatus: function (status) {
                    return status >= 200 && status < 500;
                }
            });
            return _r.data;
        } catch (error) {
            return error.response.data;
        }
    }

    static async getHealth() {
        let _mdata = await axios.get( '/_/discovery/health');
        _mdata.data.forEach((item, index) => {
            item.key = index;
        });
        return _mdata.data;
    }
    static async getHealthOne(srvid) {
        let _mdata = await axios.get( '/_/discovery/health/'+srvid);
        _mdata.data.forEach((item, index) => {
            item.key = index;
        });
        return _mdata.data;
    }
    static async getList() {
        let _mdata = await axios.get( '/_/discovery/modules');
        _mdata.data.forEach((item, index) => {
            item.key = index;
        });
        return _mdata.data;
    }
    static async save(params) {
        try {
            let r = await axios.post( '/_/discovery/modules', params);
            return r.statusText;

        } catch (error) {
            return error.response.data;
        }
    }
    /**
     * delete module
     * @param {String} moduleId  
     */
    static async del(moduleId, instId) {
        try {
            let r = await axios.delete( '/_/discovery/modules/' + moduleId + '/' + instId, {
                validateStatus: function (status) {
                    return status >= 200 && status < 500;
                }
            });
            return { status: r.status, message: r.data };
        } catch (error) {
            return error;
        }
    }


}
export default DeployService;