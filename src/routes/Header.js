import React from 'react'
import { Link } from 'react-router-dom'

// The Header creates links that can be used to navigate
// between routes.
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Header extends React.Component {
  state = {
    current: 'mail',
  }
  handleClick = (e) => {
    console.log('click ', e.key);
    this.setState({
      current: e.key,
    });
  }
  render() {
    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
      >
        <Menu.Item key="home" >
          <Link to="/">
            <Icon type="bars" /><span className="nav-text">模块列表</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="deploy" >
          <Link to='/deploy'> <Icon type="appstore" />部署列表</Link>
        </Menu.Item>
        <Menu.Item key="tenants" >
          <Link to='/tenants'> <Icon type="user" />租客列表</Link>
        </Menu.Item>
      </Menu>
    );
  }
}
const Header2 = () => (
  <header>
    <nav>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/roster'>Roster</Link></li>
        <li><Link to='/schedule'>Schedule</Link></li>
      </ul>
    </nav>
  </header>
)

export default Header
