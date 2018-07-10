import { axios } from './baseService.js';
import {SERVICE_STATUS,SERVICE_MESSAGE} from '../config/serviceConfig';
const queryString = require('query-string');

/**
 * This module is responsible for managing and retrieving permissions in the FOLIO system
 */
class permiService {

    static perms_user = {
        //Get a list of users
        get: async (length=100,query) => {
            let queryObj={query,length};
            let queryStr=queryString.stringify(queryObj);
           try {
                let _r=await axios.get(`/perms/users?`+queryStr);
                switch (_r.status) {
                    case 200:   //success
                        return {message:SERVICE_MESSAGE.success,status:SERVICE_STATUS.ok,data:_r.data};
                    case 400:   //Bad request
                        return {message:_r.data,status:SERVICE_STATUS.error};
                    case 403:   //Validation errors
                        return {message:_r.data,status:SERVICE_STATUS.error};
                    case 500:   //Internal server error
                        return {message:_r.data,status:SERVICE_STATUS.error};
                    default:
                        return {message:SERVICE_MESSAGE.unknown_err,status:SERVICE_STATUS.error,data:_r.data};
                }
            } catch (error) {
                return error;
            }

        },
        post:async(parms)=>{
            try {
                let _r=await axios.post(`/perms/users`,parms);
                switch (_r.status) {
                    case 201:   //success
                        return {message:SERVICE_MESSAGE.success,status:SERVICE_STATUS.ok,data:_r.data};
                    case 400:   //Bad request
                        return {message:_r.data,status:SERVICE_STATUS.error};
                    case 422:   //Validation errors
                        return {message:_r.data.errors[0].message,status:SERVICE_STATUS.error};
                    case 500:   //Internal server error
                        return {message:_r.data,status:SERVICE_STATUS.error};
                    default:
                        return {message:SERVICE_MESSAGE.unknown_err,status:SERVICE_STATUS.error,data:_r.data};
                }
            } catch (error) {
                return error;
            }
        }
    }
    
    static perms_users_id={
        put:async(permissionId,parms)=>{
           
            try {
                let _r=await  axios.put(`/perms/users/${permissionId}`,parms);
                switch (_r.status) {
                    case 200:   //success
                        return {message:SERVICE_MESSAGE.success,status:SERVICE_STATUS.ok,data:_r.data};
                    case 400:   //Bad request
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
    }
    static perms_permissions={
        //Get a list of existing permissions
        get:async()=>{
            try {
                let _r=await axios.get(`/perms/permissions?length=1000`);
                switch (_r.status) {
                    case 200:   //success
                        return {message:SERVICE_MESSAGE.success,status:SERVICE_STATUS.ok,data:_r.data};
                    case 400:   //Bad request
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
    }

    static perms_users_id_permissions={
        //Get permissions that a user has
        get:async(id)=>{
            try {
                let _r=await axios.get(`/perms/users/${id}/permissions`);
                switch (_r.status) {
                    case 200:   //success
                        return {message:SERVICE_MESSAGE.success,status:SERVICE_STATUS.ok,data:_r.data};
                    case 400:   //Bad request
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
    }
}

export default permiService;