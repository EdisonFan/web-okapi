
/**
 * 自定义控件 simpleContent
 */
import React, { Component } from 'react';
import { Button, Input, Form } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
class simpleContentComp extends Component {

  state = {
    contentValue: this.props.defaultValue
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.clearValue) {
      this.props.form.resetFields();
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.onClick(this.props.form.getFieldValue('parms'));
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form" style={{ textAlign: 'center' }}>
        <FormItem >
          {getFieldDecorator('parms', {
            rules: [{ required: true, message: 'Please input parms!' }],
            initialValue: this.state.contentValue
          })(
            <TextArea rows={5} placeholder="参数" />
          )}
        </FormItem>
        <Button type="primary" htmlType="submit" >确定</Button>
      </Form>
    );
  }
}

const SimpleContent = Form.create()(simpleContentComp);
export default SimpleContent;