import React from 'react';
import { render } from 'react-dom';
import { HashRouter,BrowserRouter } from 'react-router-dom';
import App from './routes/App';
import 'antd/dist/antd.css';
import './style/style.css';
render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('root'));
