import {
  observable,
  computed,
  action,
  runInAction,
} from 'mobx';
import ModulesService from '../service/modulesService';
import { formatJson } from '../util/util';
import DeployService from '../service/deployService';
import { SERVICE_STATUS } from '../config/serviceConfig';
import defaultValue from '../config/defalutValue';
import { message } from 'antd';

export default class DeployState {

  originData = [];
  @observable data = [];
  @observable dataDetails = '';
  @observable loadState = true;
  @observable addVisible = false;
  @observable detailsVisible = false;
  @observable addDeployModalVisible = false;
  @observable deployList = [];
  @observable ModuleId = 11;
  @computed get addDefaultValut() {
    return defaultValue.modules.add;
  }

  //create
  @action add = async (p) => {
    let r = await DeployService.save(p);
    runInAction(() => {
      if (r.status === SERVICE_STATUS.ok) {
        message.info(r.message, 4);
        this.toggleAddVisible();
        this.getList();
      } else {
        message.info(r.message);
      }
    });
  }

  // delete 
  @action del = async (srvcId,instId) => {
    let r = await DeployService.del(srvcId,instId);
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
    let _r = await DeployService.getHealth();
    runInAction(() => {
      if (_r.status === SERVICE_STATUS.ok) {
        this.data = _r.data;
        this.originData = _r.data;
        this.loadState = false;
      }else{
        message.info(_r.message,4);
      }
    });
  }

  // query one
  @action async getDetails(service_id, instance_id) {
    this.loadState = true;
    this.dataDetails = '';
    this.detailsVisible = true;
    let _r = await DeployService.getOne(service_id, instance_id);
    runInAction(() => {
      if (_r.status === SERVICE_STATUS.ok) {
        this.dataDetails = formatJson(JSON.stringify(_r.data));
        this.loadState = false;
      }else{
        message.info(_r.message,4);
      }
      
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
      } else {
        message.info(r.message);
      }
    });
  }


  @computed get deployDefaultValue() {
    return defaultValue.deploy.add(this.ModuleId);

  }
  @action search=(value)=> {
    this.data = this.originData.filter(item => item.srvcId.indexOf(value) > -1);
  }

  @action toggleAddVisible = () => {
    this.addVisible = !this.addVisible;
  }
  @action toggleDetailsVisible = () => {
    this.detailsVisible = !this.detailsVisible;

  }
  @action toggleAddDeployModal = () => {
    this.addDeployModalVisible = !this.addDeployModalVisible;

  }
}