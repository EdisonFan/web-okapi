import React, { Component } from 'react';
import { Form, Icon, Input,  Button,  message } from 'antd';
import blUsersService from '../service/blUsersService';
import {SERVICE_STATUS} from '../config/serviceConfig';
const FormItem = Form.Item;
class Login extends Component {

    state = {
        data: [],
        loadState: true,
        AddModalVisible: false,
        AddDeployModalVisible: false,
        ViewModalVisible: false,
        dataDetails: '',
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        return (

            <div>

                <Form onSubmit={this.handleSubmit} className="login-form" style={{ width: 550, margin: 20, marginRight: 'auto', marginLeft: 'auto' }}>
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,255,0)' }} />} placeholder="Username" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('x_okapi_tenant', {
                            rules: [{ required: true, message: 'Please input your x-okapi-tenant!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="x-okapi-tenant" />
                        )}
                    </FormItem>
                    <FormItem style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" className="login-form-button">Login</Button>
                    </FormItem>
                </Form>


            </div>
        );
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.getLogin(values);
            }
        });
    }

    getLogin=async (values)=>{
       let _r= await blUsersService.blUsers_login.post(values.username,values.password,values.x_okapi_tenant);
       if(_r.status===SERVICE_STATUS.ok){
          message.success('登陆成功');
          this.props.history.push('/');
          //TODO 根据返回的权限动态显示主菜单
       }else{
           message.error(_r.message);
       }
    }
}
const WrappedLoginForm = Form.create()(Login);
export default WrappedLoginForm;