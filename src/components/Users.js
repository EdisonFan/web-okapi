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
const uuidv1 = require('uuid/v1');
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;


class Users extends Component {
  columns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (text, record, index) => index + 1 },
    { title: '名称', dataIndex: 'username', key: 'username', render: (text, record) => <a href="javascript:;" onClick={this.getDeatails.bind(this, record.id)}>{text}</a> },
    { title: 'ID', dataIndex: 'id', key: 'id', },
    { title: 'type', dataIndex: 'type', key: 'type' },
    {
      title: '操作', key: 'action',
      render: (text, record) => (
        <span>
          <Popconfirm title='确定删除吗？' onConfirm={this.del.bind(this, record.id)}>
            <a href="javascript:;" >删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => { this.showPermissions(record.id); }}>绑定权限</a>
        </span>
      ),
    }];

  state = {
    data: [],
    loadState: true,
    AddModalVisible: false,
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
      let userName =value;
      query = `(username==*${userName}*)`;
    }
    let _r = await UsersService.getList(30, query);
    if(_r.status===SERVICE_STATUS.ok){
      this.setState({ data: _r.data, loadState: false });
    }else{
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
        <div style={{ margin: 10, textAlign: 'right' }}>
          <Search enterButton placeholder="用户名" onPressEnter={e=>this.getData(e.target.value)} onSearch={e => this.getData(e)}style={{ width: 200, marginRight: 8 }}/>
          <Button type="primary" onClick={() => { this.setState({ AddModalVisible: true }); }} icon='file-add' style={{width:50}} />
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
          visible={this.state.AddModalVisible}
          onCancel={() => this.setState({ AddModalVisible: false })}
          footer={false}
        >
          <WrappedEditUser />
        </Modal>
        <Modal
          title="权限"
          visible={this.state.PermissionsVisible}
          onCancel={() => this.setState({ PermissionsVisible: false })}
          footer={false}
          width={600}
        >
          <Permissions userId={this.state.userId} />
        </Modal>
        <Table rowKey={record=>record.id} pagination={false} loading={this.state.loadState} columns={this.columns} dataSource={this.state.data} />
      </div>
    );
  }


}


class EditUser extends React.Component {
  state = {
    userGroups: []
  }
  componentWillMount() {
    if (this.state.userGroups.length === 0) this.getGroup();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="username">
          {getFieldDecorator('username', {
            rules: [{
              required: true,
              message: 'Please input your name',
            }],
          })(
            <Input placeholder="Please input your name" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="password">
          {getFieldDecorator('password', {
            rules: [{
              required: true,
              message: 'Please input your password',
            }],
          })(
            <Input placeholder="Please input your password" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Patron group"
          hasFeedback
        >
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
                return false;
              }}
            >

              {this.state.userGroups.map((v, i) => (
                <Option key={i} value={v.id} >{v.group}</Option>

              ))}<Option key={'add'} value="" >+ Add </Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Status"
        >
          {getFieldDecorator('active', { valuePropName: 'checked' })(
            <Switch />
          )}
        </FormItem>
        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">Submit</Button>
        </FormItem>
      </Form>
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
      this.setState({ userGroups: _r.data.usergroups });
    }else{
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
        }
      }
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
    // this.state.loading=true;
    // this.forceUpdate();
    console.log('save');
    let params = {
      "id": this.state.permissionId,
      "userId": this.state.userId,
      "permissions": this.state.targetKeys
    };
    let _r = permiService.perms_users_id.put(this.state.permissionId, JSON.stringify(params));
    if (_r.status === SERVICE_STATUS.ok) {
      console.log(_r);

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

export default Users;