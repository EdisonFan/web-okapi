import {
    observable,
    action,
} from 'mobx';
import blUsersService from '../service/blUsersService';
import { SERVICE_STATUS } from '../config/serviceConfig';
import {message} from 'antd';
export default class Login {

    constructor(){
        this.userName = sessionStorage.getItem('userName')||'';
        this.x_okapi_tenant = sessionStorage.getItem('x-okapi-tenant')||'';
        this.x_okapi_token = sessionStorage.getItem('x-okapi-token')||'';
    }

    @observable userName ;
    @observable x_okapi_tenant ;
    @observable x_okapi_token ;


    @action loginSystem=async (values)=>{
        let _r= await blUsersService.blUsers_login.post(values.username,values.password,values.x_okapi_tenant);
        if(_r.status===SERVICE_STATUS.ok){
           message.success('登陆成功');
           this.userName=_r.data.userName;
           this.x_okapi_tenant=_r.data.tenant;
           this.x_okapi_token=_r.data.token;
           sessionStorage.setItem("userName",_r.data.userName);
           sessionStorage.setItem("x-okapi-tenant",_r.data.tenant);
           sessionStorage.setItem("x-okapi-token",_r.data.token);
           return true;
        }else{
            message.error(_r.message);
            return false;
        }
     }

     @action logOut=()=>{
        this.userName='';
        this.x_okapi_tenant='';
        this.x_okapi_token='';
        sessionStorage.removeItem('x-okapi-tenant');
        sessionStorage.removeItem('x-okapi-token');

     }
}