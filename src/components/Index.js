import React, { Component } from 'react';
import { Form, Icon, Input, Button, Row, Col } from 'antd';
const FormItem = Form.Item;

class Index extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        sessionStorage.setItem('host', values.host);
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('x-okapi-token');
        sessionStorage.removeItem('x-okapi-tenant');
        window.location.href = '#/home';
        window.location.reload();
      }   
    });
  }
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Row type="flex" justify="space-around" align="middle" style={{ height: '100%' }}>
          <Col span={8}>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <FormItem>
                {getFieldDecorator('host', {
                  rules: [{ required: true, message: 'Please input host eg:http://0.0.0.0:9130' }],
                  initialValue:'http://0.0.0.0:9130'
                })(
                  <Input prefix={<Icon type="rocket" style={{ fontSize: 13 }} />} placeholder="http://host:port" />
                )}
              </FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button">
                确定
          </Button>
            </Form>
          </Col>
        </Row>

      );
    }
  }
export default Form.create()(Index);
