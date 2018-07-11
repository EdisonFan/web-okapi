import React from 'react';
import { Link } from 'react-router-dom';
// The Header creates links that can be used to navigate
// between routes.
import { Menu, Icon, } from 'antd';

class Header extends React.Component {
  state = {
    current: 'home',
    isLogin: sessionStorage.getItem("x-okapi-token") ? true : false
  }
  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  }
  componentWillMount() {
    let path = window.location.pathname.replace('/', '') || 'home';
    this.setState({ current: path });
    
  }
  
  render() {
    return (

      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="inline"
        theme="dark"
      >
        <Menu.Item key="home" >
          <Link to="/"> <Icon type="bars" /><span className="nav-text">模块列表</span></Link>
        </Menu.Item>
        <Menu.Item key="deploy" >
          <Link to='/deploy'> <Icon type="appstore" />部署列表</Link>
        </Menu.Item>
        <Menu.Item key="tenants" >
          <Link to='/tenants'> <Icon type="user" />租客列表</Link>
        </Menu.Item>
        <Menu.Item key="users" >
          <Link to='/users'> <Icon type="user" />用户列表</Link>
        </Menu.Item>
      </Menu>


    );
  }
}


export default Header;
