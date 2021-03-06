import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Modules from '../components/Modules';
import Deploy from '../components/Deploy';
import Tenants from '../components/Tenants';
import Users from '../components/Users';
import Login from '../components/Login';
import Index from '../components/Index';
// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/home' component={Modules}/>
      <Route path='/deploy' component={Deploy}/>
      <Route path='/tenants' component={Tenants}/>
      <Route path='/Users' component={Users}/>
      <Route path='/Login' component={Login}/>
      <Route  path='/Index' component={Index}/>
    </Switch>
  </main>
);

export default Main;
