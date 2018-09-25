import {
  observable,
  action,
  runInAction,
} from 'mobx';
import { formatJson } from '../util/util';
import { message } from 'antd';
import UsersService from './../service/usersService';
import { SERVICE_STATUS } from '../config/serviceConfig';
import loginService from '../service/loginService';
import permiService from '../service/permissions';
import groupsService from '../service/groupsService';
const uuidv1 = require('uuid/v1');

export default class UserState {

  originData = [];
  @observable data = [];
  @observable dataDetails = '';
  @observable loadState = true;
  @observable addVisible = false;
  @observable detailsVisible = false;
  @observable permissionsVisible = false;
  @observable deployList = [];
  @observable addGroupVisible=false;
  @observable submitBtnStatus=false;
  @observable userGroups=[{ 'id': '+add', 'group': 'add' }];

  
  @action add = async (values) => {
    //TODO 根据存在的userId，判断新增还是修改
    const userId = uuidv1();
    let params = `
    {
      "id":"${userId}",
      "active":"${values.active ? true : false}",
      "username":"${values.username}",
      "type": "patron",
      "personal":{
          "lastName":"${values.username}"
      },
      "patronGroup":"${values.patronGroup}"
   }
    `;
    this.submitBtnStatus=false;
    let _r = await UsersService.save(params);
    if (_r.status === SERVICE_STATUS.ok) {
      params = `
      {
        "userId": "${userId}",
        "username": "${values.username}",
        "password": "${values.password}"
      }
      `;
      let _j = await loginService.authn_credentials.post(params);
      if (_j.status === SERVICE_STATUS.ok) {
        params = `
        {
          "userId":"${userId}",
          "permissions":[],
          "id":"${uuidv1()}"
        }      
        `;
        let _p = await permiService.perms_user.post(params);
        if (_p.status === SERVICE_STATUS.ok) {
          message.info('创建成功');
          this.toggleAddVisible();
          this.getList();
        }
      }
    }else{
      message.info(_r.message);
    }
    this.submitBtnStatus=true;

  }
  // delete 
  @action del = async (userId) => {
    let r = await UsersService.del(userId);
    runInAction(() => {
      if (r.status === SERVICE_STATUS.ok) {
        message.info('success', 3);
        this.getList();
      } else {
        message.info(`status:${r.status},message:${r.message}`, 4);
      }
    });
  }
  // query List
  @action async getList(value) {
    this.data=[];
    let query = undefined;
    if (value) {
      let userName = value;
      query = `(username==*${userName}*)`;
    }
    let _r = await UsersService.getList(30, query);
    runInAction(() => {
      if (_r.status === SERVICE_STATUS.ok) {
        this.data = _r.data;
        this.originData = _r.data;
      }else{
        message.info(_r.message,4);
      }
      this.loadState = false;
    });
  }

  // query one
  @action async getDetails(userId) {
    this.loadState = true;
    this.dataDetails = '';
    this.detailsVisible = true;
    let _r = await UsersService.getOne(userId);
    runInAction(() => {
      this.loadState = false;
      if (_r.status === SERVICE_STATUS.ok) {
        this.dataDetails = formatJson(JSON.stringify(_r.data));
      }else{
        message.info(_r.message,4);
      }
      
    });
  }

  @action search=(value)=> {
    this.data = this.originData.filter(item => item.srvcId.indexOf(value) > -1);
  }

  @action toggleAddVisible = () => {
    this.addVisible = !this.addVisible;
    if(this.userGroups.length===1 && this.addVisible) this.getGroup();
  }
  @action toggleDetailsVisible = () => {
    this.detailsVisible = !this.detailsVisible;

  }
  @action togglePermissionsVisible = () => {
    this.permissionsVisible = !this.permissionsVisible;
  }
  @action showPermissions=(userId)=>{
    this.userId=userId;
    this.togglePermissionsVisible();
  }
  @action toggleAddGroupVisible=()=>{
    this.addGroupVisible=!this.addGroupVisible;
  }

  @action getGroup = async () => {
    let _r = await groupsService.groups.get();
    if (_r.status === SERVICE_STATUS.ok) {
      this.userGroups=[{ 'id': '+add', 'group': 'add' }].concat(_r.data.usergroups);
    } else {
      message.error(`userGroups:${_r.message}`);
    }
  }
  @action addGroup = async(values)=>{
    let _r=await groupsService.groups.post(values.group);
    if(_r.status===SERVICE_STATUS.ok){
      this.toggleAddGroupVisible();
      this.getGroup();
      message.info(_r.message);
    }else{
      message.info(_r.message);
    }
  }
  
}