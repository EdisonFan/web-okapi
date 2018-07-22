import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './routes/App';
import 'antd/dist/antd.css';
import './style/style.css';
import { Provider } from "mobx-react";
import {createStoreMap} from "./store/store";
render((
  <Provider AppStateStore={createStoreMap()}>
  <HashRouter>
    <App />
  </HashRouter>
  </Provider>
), document.getElementById('root'));
