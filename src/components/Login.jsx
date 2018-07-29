import React, { Component } from 'react';
import { Form, Icon, Input,  Button } from 'antd';

import { observer, inject } from "mobx-react";
const FormItem = Form.Item;

@inject("AppStateStore")
@observer
class Login extends Component {
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
                if(this.props.AppStateStore.loginState.loginSystem(values)){
                    this.props.history.push('/home');
                }
            }
        });
    }

  
}
const WrappedLoginForm = Form.create()(Login);
export default WrappedLoginForm;