import React from 'react';
import Header from './Header';
import Main from './Main';
import { Layout } from 'antd';
import TopBar from './TopBar';
import { Switch, Route } from 'react-router-dom';
import Index from '../components/Index';
const { Content, Sider } = Layout;
let path = window.location.hash === '#/'||window.location.hash === '';

const App = () => (
  <div style={{height:'100%'}}>
    {path ?
      <Index />
      :
      <Layout >
        <Sider breakpoint="lg" collapsedWidth="0">
          <div className="logo" >OKAPI_MANAGE </div>
          <Header />
        </Sider>
        <Layout>
          <TopBar />
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', }}>
            <Main />
          </Content>
        </Layout>
      </Layout>
    }

  </div>
);

export default App;
