import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Modules from '../components/Modules'
import Deploy from '../components/Deploy'
import Tenants from '../components/Tenants'

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Modules}/>
      <Route path='/deploy' component={Deploy}/>
      <Route path='/tenants' component={Tenants}/>
    </Switch>
  </main>
)

export default Main
