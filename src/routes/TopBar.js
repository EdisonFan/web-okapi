import React from "react";
import { Menu, Dropdown, Icon ,Avatar} from 'antd';
import { Link } from 'react-router-dom';

class TopBar extends React.Component {
    onMenuClick=({key}) => {
        
        if (key === 'logout') {
            sessionStorage.setItem("x-okapi-token",'');
            sessionStorage.setItem("x-okapi-tenant",'');
            sessionStorage.setItem("userName",'');

            window.location.href='/login';
        }
    };
    
    menu = (
        <Menu onClick={this.onMenuClick}>
            <Menu.Item key='logout'>
                <Icon type="logout" />退出登录
            </Menu.Item>
        </Menu>
    );
    state = {
        current: 'home',
        isLogin: sessionStorage.getItem("x-okapi-token") ? true : false,
        userName:sessionStorage.getItem("userName"),
    }
    handleClick = (e) => {

        console.log('click ', e.key);
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
            <div className='header'>
            <div className='right'>
            { this.state.isLogin ?
            <Dropdown overlay={this.menu}>
                <span className="action account" >
                <Avatar className="avatar" icon="user" />
                <span >{this.state.userName}</span>
                </span>
            </Dropdown>:
             <Link to="/login"> 
              <span className="action account" >
                <Avatar size="small" className="avatar" icon="user" />
                <span >登陆</span>
                </span>
             </Link>
           
            }
            </div>
            </div>

        );
    }
}

export default TopBar;