import ModuleState from './moduleState';
import Login from './loginState';
import DeployState from './deployState';

export const createStoreMap = () => {
  return {
    ModuleState: new ModuleState(),
    loginState:new Login(),
    DeployState:new DeployState(),
  };
};
