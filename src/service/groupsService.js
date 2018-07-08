import { host, axios_tenant_token } from './baseService.js';
import { SERVICE_STATUS } from '../config/serviceConfig';

//Collection of group items.
const groupsService = {
    groups: {
        //Return a list of groups(need token & tenant)
        get: async (limit = 10) => {
            let _r=await axios_tenant_token.get(host+`/groups?limit=${limit}`);
            switch (_r.status) {
                case 200:
                    return {message:'success',status:SERVICE_STATUS.ok,data:_r.data};
                default:
                    break;
            }
            return _r;
        },
        //Create a group (need token & tenant)
        post: async (group, desc) => {

        }
    },
    //Entity representing a group
    groups_groupId: {
        //Retrieve group item with given {groupId}
        get: async (groupId) => {

        },
        //Delete group item with given {groupId}
        delete: async (groupId) => {
            let _r = await axios_tenant_token.delete(`/groups/${groupId}`);
            return _r;
        },
        //Update group item with given {groupId}
        put: async (groupId, group, desc, id) => {
            let _r = await axios_tenant_token.put(`/groups/${groupId}`, { group, desc, id });
            return _r;
        },
    }
};
export default groupsService;

