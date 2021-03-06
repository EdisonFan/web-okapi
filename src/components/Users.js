import React, { Component } from 'react';
import { Table, Divider, Button, Modal, message, Switch, Icon, Popconfirm, Input } from 'antd';
import {
  Form, Select, Transfer
} from 'antd';
import UsersService from '../service/usersService';
import groupsService from '../service/groupsService';
import { SERVICE_STATUS } from '../config/serviceConfig';
import loginService from '../service/loginService';
import permiService from '../service/permissions';
import eventProxy from 'react-eventproxy';
import lang from './../config/cn';
const uuidv1 = require('uuid/v1');
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;


class Users extends Component {
  columns = [
    { title: lang.Users.list.num, dataIndex: 'index', key: 'index', render: (text, record, index) => index + 1 },
    { title: lang.Users.list.name, dataIndex: 'username', key: 'username', render: (text, record) => <a href="javascript:;" onClick={this.getDeatails.bind(this, record.id)}>{text}</a> },
    { title: lang.Users.list.id, dataIndex: 'id', key: 'id', },
    { title: lang.Users.list.type, dataIndex: 'type', key: 'type' },
    {
      title: lang.Users.list.action, key: 'action',
      render: (text, record) => (
        <span>
          <Popconfirm title='确定删除吗？' onConfirm={this.del.bind(this, record.id)}>
            <a href="javascript:;" >{lang.Users.list.delete}</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => { this.showPermissions(record.id); }}>绑定权限</a>
        </span>
      ),
    }];

  state = {
    data: [],
    loadState: true,
    AddUserVisible: false,
    bindModulesVisible: false,
    userId: '',
    modulesData: [],
    detailsVisible: false,
    PermissionsVisible: false,//权限模块显示开关
  }

  componentWillMount() {
    this.getData();
  }
  getDeatails = async (id) => {
    let _r = await UsersService.getOne(id);
    this.setState({ dataDetails: JSON.stringify(_r), detailsVisible: true });
  }
  async getData(value) {

    let query = undefined;
    if (value) {
      let userName = value;
      query = `(username==*${userName}*)`;
    }
    let _r = await UsersService.getList(30, query);
    if (_r.status === SERVICE_STATUS.ok) {
      this.setState({ data: _r.data, loadState: false });
    } else {
      message.error(_r.message);
      this.setState({ loadState: false });
    }
  }
  async del(id) {
    let r = await UsersService.del(id);
    if (r.status == 204) {
      message.info('success', 3);
      this.getData();
    } else {
      message.info(`status:${r.status},message:${r.message}`, 4);
    }
  }

  hideModule = () => this.setState({ bindModulesVisible: false });
  showPermissions = (userId) => {
    this.setState({ PermissionsVisible: true, userId });

  }

  render() {
    const Search = Input.Search;
    return (
      <div>
        <div style={{ marginBottom: 10, textAlign: 'right' }}>
          <Search enterButton placeholder="用户名" onPressEnter={e => this.getData(e.target.value)} onSearch={e => this.getData(e)} style={{ width: 200, marginRight: 8 }} />
          <Button type="primary" onClick={() => { this.setState({ AddUserVisible: true }); }} icon='file-add' style={{ width: 50 }} />
        </div>
        <Modal
          title="详细信息"
          visible={this.state.detailsVisible}
          onCancel={() => this.setState({ detailsVisible: false })}
          footer={false}
        >
          <TextArea rows={10} value={this.state.dataDetails} />
        </Modal>
        <Modal
          title="添加"
          visible={this.state.AddUserVisible}
          onCancel={() => this.setState({ AddUserVisible: false })}
          footer={false}
        >
          <WrappedEditUser saveSuccessFn={() => { this.setState({ AddUserVisible: false }); this.getData(); }} />
        </Modal>
        <Modal
          title="权限"
          visible={this.state.PermissionsVisible}
          onCancel={() => this.setState({ PermissionsVisible: false })}
          footer={false}
          width={600}
        >
          <Permissions userId={this.state.userId} SuccessFn={()=>this.setState({ PermissionsVisible: false })}/>
        </Modal>
        <Table rowKey={record => record.id} pagination={false} loading={this.state.loadState} columns={this.columns} dataSource={this.state.data} />
      </div>
    );
  }


}


class EditUser extends React.Component {
  state = {
    userGroups: [{ 'id': '+add', 'group': 'add' }],
    submitBtnStatus:true
  }
  componentWillMount() {
    if (this.state.userGroups.length === 1) this.getGroup();
  }

  render() {
    const $this = this;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    let cusStyle = {
      "display": this.state.groupState ? 'none' : 'block'
    };
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

          <FormItem {...formItemLayout} label={lang.Users.add.group}>
            {getFieldDecorator('patronGroup', {
              rules: [
                { required: true, message: 'Please select your group!' },
              ],
            })(
              <Select placeholder="Please select a group" onChange={function (value, option) {
                console.log(value, option);

                return false;
              }}
                onSelect={function (value, option) {
                  console.log('onSelect', value, option);
                  if (value === '+add') {
                    setTimeout(() => {
                      $this.props.form.setFieldsValue({ 'patronGroup': '' });
                    }, 10);
                    //$this.state.groupState=true;
                    $this.props.form.setFieldsValue({ 'patronGroup': '' });
                    // $this.state.userGroups.push({id:new Date().getTime(),group:'new'+new Date().getTime()});
                    $this.state.addGroup = true;
                    $this.forceUpdate();

                  }
                  return false;
                }}

                filterOption={false}
              >

                {this.state.userGroups.map((v, i) => (
                  <Option key={i} value={v.id} >{v.group}</Option>

                ))}
              </Select>
            )}
          </FormItem>
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
        <Modal
          title="添加用户组"
          visible={this.state.addGroup || false}
          onCancel={() => this.setState({ addGroup: false })}
          footer={false}
          width={300}
          wrapClassName="vertical-center-modal"

        >
            <GroupEdit SuccessFn={()=>{
              this.setState({ addGroup: false });
              this.getGroup();
          }} />
        </Modal>
      </div>
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.saveUser(values);
      }
    });
  }
  getGroup = async () => {
    let _r = await groupsService.groups.get();
    if (_r.status === SERVICE_STATUS.ok) {
      this.state.userGroups.push(..._r.data.usergroups);
      this.forceUpdate();
    } else {
      message.error(`userGroups:${_r.message}`);
    }
  }
  saveUser = async (values) => {
    //TODO 根据存在的userId，判断新增还是修改
    const userId = uuidv1();
    let params = `
    {
      "id":"${userId}",
      "active":"${values.active ? true : false}",
      "username":"${values.username}",
      "type": "patron",
      "personal":{
          "lastName":"${values.username}"
      },
      "patronGroup":"${values.patronGroup}"
   }
    `;
    this.setState({submitBtnStatus:false});

    let _r = await UsersService.save(params);
    if (_r.status === SERVICE_STATUS.ok) {
      params = `
      {
        "userId": "${userId}",
        "username": "${values.username}",
        "password": "${values.password}"
      }
      `;
      let _j = await loginService.authn_credentials.post(params);
      if (_j.status === SERVICE_STATUS.ok) {
        params = `
        {
          "userId":"${userId}",
          "permissions":[],
          "id":"${uuidv1()}"
        }      
        `;
        let _p = await permiService.perms_user.post(params);
        if (_p.status === SERVICE_STATUS.ok) {
          message.info('创建成功');
          this.setState({submitBtnStatus:true});
          this.props.saveSuccessFn();
        }
      }
    }else{
      message.info(_r.message);
      this.setState({submitBtnStatus:true});
    }
  }
}
const WrappedEditUser = Form.create()(EditUser);


class Permissions extends React.Component {
  state = {
    allData: [],
    targetKeys: [],
    userId: '',
    permissionId: '',
    loading: false
  }
  componentWillMount() {
    this.getAllList();
    if (this.props.userId) {
      this.getItemByUserId(this.props.userId);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.userId !== this.state.userId) {
      this.getItemByUserId(nextProps.userId);
    }
  }
  render() {
    return (
      <div>
        <Transfer
          dataSource={this.state.allData}
          showSearch
          filterOption={this.filterOption}
          targetKeys={this.state.targetKeys}
          onChange={this.handleChange}
          render={item => item.title}
          listStyle={{ width: 250, height: 300 }}
        />
        <Button type="primary" loading={this.state.loading} style={{ margin: "10px auto" }} onClick={this.commit.bind(this)}>确定</Button>
      </div>
    );
  }
  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  }

  commit = async () => {
    let params = {
      "id": this.state.permissionId,
      "userId": this.state.userId,
      "permissions": this.state.targetKeys
    };
    let _r = await permiService.perms_users_id.put(this.state.permissionId, JSON.stringify(params));
    if (_r.status === SERVICE_STATUS.ok) {
      this.props.SuccessFn();
    }else{
      message.info(_r.message);
    }
  }
  getAllList = async () => {
    let _r = await permiService.perms_permissions.get();
    if (_r.status === SERVICE_STATUS.ok) {
      const allData = [];
      for (let i = 0; i < _r.data.permissions.length; i++) {
        const data = {
          key: _r.data.permissions[i].permissionName,
          title: _r.data.permissions[i].permissionName,
          description: _r.data.permissions[i].description,
        };
        allData.push(data);
      }
      this.setState({ allData });
    }
  }
  getItemByUserId = async (userId) => {
    let _r = await permiService.perms_user.get(1, `(userId==${userId})`);
    this.setState({ userId });
    if (_r.status === SERVICE_STATUS.ok && _r.data.totalRecords === 1) {
      this.setState({ targetKeys: _r.data.permissionUsers[0].permissions, permissionId: _r.data.permissionUsers[0].id });
    }
  }
  filterOption = (inputValue, option) => {
    return option.title.indexOf(inputValue) > -1;
  }
}

class GroupEditForm extends React.Component {
  state={}
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
        let _r=await groupsService.groups.post(values.group);
        if(_r.status===SERVICE_STATUS.ok){
          message.info(_r.message);
          this.props.SuccessFn();
        }else{
          message.info(_r.message);
        }
        
      }
    });
  }
}
const GroupEdit = Form.create()(GroupEditForm);
export default Users;