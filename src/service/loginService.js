import {  axios } from './baseService.js';
import { SERVICE_STATUS, SERVICE_MESSAGE } from '../config/serviceConfig';

//This module provides a username/password based login mechanism for FOLIO credentials
const loginService = {
    authn_credentials: {
        //Add a new login to the system(need token & tenant)
        post: async (params) => {
            let _r=await axios.post(`/authn/credentials`,params);
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
                   return {message:SERVICE_MESSAGE.unknown_err,status:SERVICE_STATUS.error};
            }
        },
        
    }
};
export default loginService;

