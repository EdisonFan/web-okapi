import { Button, Form, Input, Switch } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import lang from './../config/cn';
const FormItem = Form.Item;

@inject('AppStateStore')
@observer
class EditUser extends React.Component {
  state = {
    userGroups: [{ 'id': '+add', 'group': 'add' }],
    submitBtnStatus:true
  }
  

  render() {
    const { getFieldDecorator } = this.props.form;
    const tenantId =this.props.tenantId;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    let cusStyle = {
      "display": this.state.groupState ? 'none' : 'block'
    };
    const {
      addGroupVisible,toggleAddGroupVisible,userGroups,getGroup
    } = this.props.AppStateStore.UserState;
    return (
      <div>
        <Form onSubmit={this.handleSubmit} style={cusStyle}>
          <FormItem {...formItemLayout} label={lang.Users.add.username}>
            {getFieldDecorator('username', {
              rules: [{
                required: true,
                message: 'Please input your name',
              }],
            })(
              <Input placeholder="Please input your name" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={lang.Users.add.password}>
            {getFieldDecorator('password', {
              rules: [{
                required: true,
                message: 'Please input your password',
              }],
            })(
              <Input placeholder="Please input your password" />
            )}
          </FormItem>
          {
            sessionStorage.getItem('x-okapi-tenant')?'':
          
          <FormItem {...formItemLayout} label={lang.Users.add.tenant}>
            {getFieldDecorator('tenantId', {
              initialValue:tenantId,
              rules: [{
                required: false,
                message: 'Please input your tenantId',
              }],
            })(
              <Input placeholder="Please input tenantId" />
            )}
          </FormItem>}
          {/* <FormItem {...formItemLayout} label={lang.Users.add.group}>
            {getFieldDecorator('patronGroup', {
              rules: [
                { required: true, message: 'Please select your group!' },
              ],
            })(
              <Select placeholder="Please select a group" 
                onSelect={function (value, option) {
                  console.log('onSelect', value, option);
                  if (value === '+add') {
                    setTimeout(() => $this.props.form.setFieldsValue({ 'patronGroup': '' }),10);
                    toggleAddGroupVisible();
                  }
                  return false;
                }}

                filterOption={false}
              >

                {userGroups.map((v, i) => (
                  <Option key={v.id} value={v.id} >{v.group}</Option>

                ))}
              </Select>
            )}
          </FormItem> */}
          <FormItem {...formItemLayout} label={lang.Users.add.Status} >
            {getFieldDecorator('active', { valuePropName: 'checked' })(
              <Switch />
            )}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 12, offset: 6 }}
          >
            <Button type="primary" htmlType="submit" loading={!this.state.submitBtnStatus}>保存</Button>
          </FormItem>
        </Form>
        {/* 
        新版中不需要添加用户组了
        <Modal
          title="添加用户组"
          visible={addGroupVisible}
          onCancel={toggleAddGroupVisible}
          footer={false}
          width={300}
          wrapClassName="vertical-center-modal"

        >
            <GroupEdit SuccessFn={()=>{
             toggleAddGroupVisible();
              getGroup();
          }} />
        </Modal> */}
      </div>
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.AppStateStore.UserState.add(values,values.tenantId);
      }
    });
  }
}
const WrappedEditUser = Form.create()(EditUser);

@inject('AppStateStore')
@observer
class GroupEditForm extends React.Component {
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.handleSubmit} className="">
          <FormItem>
            {getFieldDecorator('group', {rules: [{ required: true }]})(
              <Input placeholder='组名' />
            )}
          </FormItem>
          <p />
          <Button type="primary" htmlType="submit">确定</Button>
        </Form>
      );
    }
    handleSubmit=(e)=>{
      e.preventDefault();
      this.props.form.validateFields(async(err, values) => {
        if (!err) {
          this.props.AppStateStore.UserState.addGroup(values);
        }
      });
    }
  }
const GroupEdit = Form.create()(GroupEditForm);

export default WrappedEditUser;
