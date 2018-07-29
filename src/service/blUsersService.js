import { axios } from './baseService.js';
import {SERVICE_STATUS,SERVICE_MESSAGE} from '../config/serviceConfig';

class blUsersService {

    static blUsers_login = {
        post: async (username, password, x_okapi_tenant) => {

            try {
                let _r = await axios.post( `/bl-users/login`, `{
                    "username":"${username}",
                    "password":"${password}"
                    }`
                    , {
                        headers: {
                            "x-okapi-tenant": `${x_okapi_tenant}`,
                            'Content-Type': 'application/json'
                        },
                        validateStatus: function (status) {
                            return status < 600;
                        }
                    });
                let status = _r.status;

                switch (status) {
                    case 201:           //登陆成功
                        if (_r.headers['x-okapi-token']) {
                            let data={token:_r.headers['x-okapi-token'],tenant:_r.headers['x-okapi-tenant'],userName:username};
                            return { message: SERVICE_MESSAGE.success, status: SERVICE_STATUS.ok,data};
                        }
                        return { message: SERVICE_MESSAGE.login_no_token, status: SERVICE_STATUS.error };
                    case 400:           //租客错误或密码错误
                        if(typeof _r.data === "string"){
                            return { message: SERVICE_MESSAGE.login_err_tenant, status: SERVICE_STATUS.error };
                        }else{
                            return { message: SERVICE_MESSAGE.login_err_password, status: SERVICE_STATUS.error};
                        }
                    case 403:           //密码错误
                        return { message: SERVICE_MESSAGE.login_err_password, status: SERVICE_STATUS.error };
                    case 404:           //地址错误
                        return { message: _r.data, status: SERVICE_STATUS.error };
                    case 500:           //用户名错误
                        return { message: SERVICE_MESSAGE.login_err_username, status: SERVICE_STATUS.error };
                    default:
                        return { message: SERVICE_MESSAGE.unknown_err, status: SERVICE_STATUS.error };
                }
            } catch (error) {
                return error;
            }

        }
        // static blUsers_login(){
        //     return {
        //         post:()=>{
        //             console.log(123);
        //         }
        //     };
        // }
    }
    users = {
        /**
         * Return a list of users
         */
        get: async () => {
            return await axios.get("/users");
        }
    }
}

export default blUsersService;