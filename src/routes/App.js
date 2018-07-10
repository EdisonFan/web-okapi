import React from 'react';
import Header from './Header';
import Main from './Main';
import { Layout } from 'antd';
import TopBar from './TopBar';

const { Content, Sider } = Layout;

const App = () => (
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

);

export default App;
