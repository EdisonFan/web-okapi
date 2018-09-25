import ModuleState from './moduleState';
import Login from './loginState';
import DeployState from './deployState';
import TenantState from './tenantState';
import UserState from './userState';

export const createStoreMap = () => {
  return {
    ModuleState: new ModuleState(),
    loginState:new Login(),
    DeployState:new DeployState(),
    TenantState:new TenantState(),
    UserState:new UserState(),
  };
};
