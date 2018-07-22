import {
  observable,
  computed,
  action,
  runInAction,
} from 'mobx';
import ModulesService from '../service/modulesService';
export default class AppState {

  @observable data = [];
  @observable loadState = true;
  @computed get msg() {
    return `${this.name} say count is ${this.count}`;
  }
  @action async getList() {
    if (this.data.length === 0) {
      this.loadState = true;
      let _r = await ModulesService.getList();
      runInAction(() => {
        this.data = _r.data;
        this.loadState = false;

      });
    }
  }

}
// let AppStateStore =new AppState();
// window.AppStateStore=AppStateStore;
// export default  AppStateStore;