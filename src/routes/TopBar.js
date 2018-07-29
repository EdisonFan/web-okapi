import React from "react";
import { Menu, Dropdown, Icon, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { observer, inject } from "mobx-react";

@withRouter
@inject("AppStateStore")
@observer
class TopBar extends React.Component {
    render() {
        const{userName,logOut}=this.props.AppStateStore.loginState;
        const onMenuClick = ({ key }) => {
            if (key === 'logout') {
                logOut();
                this.props.history.push('/login');
            }
        };
    
       const menu = (
            <Menu onClick={onMenuClick}>
                <Menu.Item key='logout'>
                    <Icon type="logout" />退出登录
                </Menu.Item>
            </Menu>
        );
        return (
            <div className='header'>
                <div className='right'>
                    {userName ?
                        <Dropdown overlay={menu}>
                            <span className="action account" >
                                <Avatar className="avatar" icon="user" />
                                <span >{userName}</span>
                            </span>
                        </Dropdown> :
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