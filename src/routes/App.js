import React from 'react';
import Header from './Header';
import Main from './Main';
import { Layout } from 'antd';
import TopBar from './TopBar';
import { Switch, Route,withRouter } from 'react-router-dom';
import Index from '../components/Index';
const { Content, Sider } = Layout;

@withRouter
class App extends React.Component {
    constructor(props){
        super(props);
        this.pathname = this.props.location.pathname;
    }
    checkAuth = () =>{
        console.log(this.props.location.pathname);
        
        if (window.location.hash != '#/setHost') {
            if (!sessionStorage.getItem('host')) {
                this.props.history.replace('/setHost');
            }
        }
    }
    componentWillMount(){
        document.title=sessionStorage.getItem('host')||'okapi-manage';
        if (this.pathname == '/') {
            if (sessionStorage.getItem('host')) {
                this.props.history.replace('/home');
            } else {
                this.props.history.replace('/setHost');
            }
        } else {
            this.checkAuth();
        }
    }
    componentWillReceiveProps (){
      console.log("app ==");
      
      this.checkAuth();
    }
    render(){
        return (
                <Switch>
                    <Route path="/setHost" component={Index}/>
                    <Route path='/' component={Layouts}/>
                </Switch>
        );
    }
}

const Layouts = () => (
  
  <div style={{height:'100%'}}>
   
      <Layout >
        <Sider breakpoint="lg" collapsedWidth="0">
          <div className="logo"><a href='/#/setHost'>OKAPI_MANAGE</a></div>
          <Header />
        </Sider>
        <Layout>
          <TopBar />
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', }}>
            <Main />
          </Content>
        </Layout>
      </Layout>
    

  </div>
);

export default App;
