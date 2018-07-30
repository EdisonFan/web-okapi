import {
    observable,
    computed,
    action,
    runInAction,
} from 'mobx';
import { message } from 'antd';
import TenantsService from '../service/tenantsService';
import { SERVICE_STATUS } from '../config/serviceConfig';
import ModulesService from '../service/modulesService';

export default class TenantState {

    originData = [];
    @observable loadState=false;
    @observable data = [];
    @observable addVisible = false;
    @observable bindModulesVisible=false;
    @observable modulesData=[];
    @observable tenantId='';
    //create
    @action add = async (p) => {
        let r = await TenantsService.save(p);
        runInAction(() => {
            if (r.status === SERVICE_STATUS.ok) {
                message.info(r, 4);
                this.getList();
                this.addVisible = false;
            } else {
                message.info(r.message,4);
            }
        });
    }

    // delete 
    @action del = async (id) => {
        let r = await TenantsService.del(id);
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
    @action async getList() {
        this.loadState = true;
        let _r = await TenantsService.getList();
        runInAction(() => {
            if (_r.status === SERVICE_STATUS.ok) {
                this.data = _r.data;
                this.originData = _r.data;
                this.loadState = false;
            }else{
                message.info(`status:${_r.status},message:${_r.message}`, 4);
            }
        });
    }
    @action getModulesData = async (tenantId) => {
        this.loadState= true;
        this.bindModulesVisible=true;
        this.tenantId=tenantId;
        let _allModules = await ModulesService.getList();
        let _tenModules = await ModulesService.getListByTanId(tenantId);
        if (_allModules.status === SERVICE_STATUS.ok) {
          _allModules.data.forEach(function (element, index, array) {
            element['bind'] = false;
            _tenModules.forEach((t_element, t_index, a) => {
              if (element['id'] == t_element['id']) {
                element['bind'] = true;
              }
            });
          });
          this.modulesData=_allModules.data;
          this.loadState=false;
        }else{
          message.info(_allModules.message);
        }
      }
   
    @action search=(value)=>{
        this.data = this.originData.filter(item => item.id.indexOf(value) > -1);
    }

    @action toggleAddVisible = () => {
        this.addVisible = !this.addVisible;
    }
    @action toggleViewModule = () => {
        this.viewModalVisible = !this.viewModalVisible;

    }
    @action toggleBindModulesVisible = () => {
        this.bindModulesVisible = !this.bindModulesVisible;

    }

   @action bindModule = async (tenantId, moduleId) => {
        let params = `{"id":"${moduleId}"}`;
        this.loadState=true;
        let _r = await TenantsService.bindModule(params, tenantId);
        if (_r.status == SERVICE_STATUS.ok) {
          message.info(_r.message);
          this.getModulesData(tenantId);
        } else {
          message.info(_r.message);
        }
        return false;
      }
     @action unBindModule = async (tenantId, moduleId) => {
        let _r = await TenantsService.unBindModule(tenantId, moduleId);
        if (_r.status == SERVICE_STATUS.ok) {
          this.getModulesData(tenantId);
        } else {
          message.info(_r.message);
        }
      }
}