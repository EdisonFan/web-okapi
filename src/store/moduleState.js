import {
  observable,
  computed,
  action,
  runInAction,
} from 'mobx';
import ModulesService from '../service/modulesService';
import DeployService from '../service/deployService';
import { SERVICE_STATUS } from '../config/serviceConfig';
import defaultValue from '../config/defalutValue';
import { message } from 'antd';
export default class ModuleState {

  originData = [];
  @observable data = [];
  @observable dataDetails = '';
  @observable loadState = true;
  @observable addModalVisible = false;
  @observable viewModalVisible = false;
  @observable addDeployModalVisible = false;
  @observable modModalVisible=false;
  @observable deployList = [];
  @observable ModuleId = 11;
  @computed get addDefaultValut() {
    return defaultValue.modules.add;
  }

  //create Module
  @action addModule = async (p) => {
    let r = await ModulesService.save(p);
    runInAction(() => {
      if (r.status === SERVICE_STATUS.ok) {
        message.info(r.message, 4);
        this.toggleAddModule();
        this.getList();
      }else{
        message.info(r.message);
      }
    });
  }

  // delete Module
  @action delModule = async (id) => {
    let r = await ModulesService.del(id);
    runInAction(() => {
      if (r.status == 204) {
        message.info('success', 3);
        this.getList();
      } else {
        message.info(`status:${r.status},message:${r.message}`, 4);
      }
    });
  }

    //modify a Module
    @action modModule = async (p) => {
      let r = await ModulesService.modify(this.ModuleId,p);
      runInAction(() => {
        if (r.status === SERVICE_STATUS.ok) {
          message.info(r.message, 4);
          this.toggleModModule();
          this.getList();
        }else{
          message.info(r.message,7);
        }
      });
    }
  // query Module List
  @action async getList() {
    this.loadState = true;
    let _r = await ModulesService.getList();
    runInAction(() => {
      this.data = _r.data;
      this.originData = _r.data;
      this.loadState = false;
    });
  }

  // query Module one
  @action async getDetails(moduleId) {
    this.loadState = true;
    this.dataDetails = '';
    this.viewModalVisible = true;
    let _r = await ModulesService.getOne(moduleId);
    runInAction(() => {
      this.dataDetails = JSON.stringify(_r,null,2);
      this.originData = _r.data;
      this.loadState = false;
    });
  }

  @action async modifyModule(moduleId) {
    this.loadState = true;
    this.dataDetails = '';
    this.modModalVisible = true;
    this.ModuleId =moduleId;
    let _r = await ModulesService.getOne(moduleId);
    runInAction(() => {
      this.dataDetails = JSON.stringify(_r,null,2);
      this.originData = _r.data;
      this.loadState = false;
    });
  }
  @action async getDepolyHealth(ModuleId) {
    this.ModuleId = ModuleId;
    this.deployList = [];
    this.addDeployModalVisible = true;
    let _r = await DeployService.getHealthOne(ModuleId);
    if (_r.status === SERVICE_STATUS.ok) {
      this.deployList = _r.data;
    }
  }

  @action addDeployModule = async (p) => {
    let r = await ModulesService.deploySave(p);
    runInAction(() => {
      if (r.status === SERVICE_STATUS.ok) {
        message.info(r.message, 4);
        this.toggleAddDeployModal();
      }else{
        message.info(r.message);
      }
    });
  }

 
  @computed get deployDefaultValue() {
    return defaultValue.deploy.add(this.ModuleId);
    
  }
  @action search=(value)=>{
    this.data = this.originData.filter(item => item.id.indexOf(value) > -1);
  }

  @action toggleAddModule = () => {
    this.addModalVisible = !this.addModalVisible;
  }
  @action toggleViewModule = () => {
    this.viewModalVisible = !this.viewModalVisible;

  }
  @action toggleAddDeployModal = () => {
    this.addDeployModalVisible = !this.addDeployModalVisible;
  }

  @action toggleModModule= () => {
    this.modModalVisible = !this.modModalVisible;
  }
}