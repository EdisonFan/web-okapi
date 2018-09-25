import React, { Component } from 'react';
import { Table, Divider, Button, Modal, message, Popconfirm, Input } from 'antd';
import { Transfer} from 'antd';
import { SERVICE_STATUS } from '../config/serviceConfig';
import permiService from '../service/permissions';
import { observer,inject } from 'mobx-react';
import lang from './../config/cn';
import WrappedEditUser from './EditUser';
const { TextArea } = Input;

@inject('AppStateStore')
@observer
class Users extends Component {
  columns = [
    { title: lang.Users.list.num, dataIndex: 'index', key: 'index', render: (text, record, index) => index + 1 },
    { title: lang.Users.list.name, dataIndex: 'username', key: 'username', render: (text, record) => <a href="javascript:;" onClick={()=>this.props.AppStateStore.UserState.getDetails(record.id)}>{text}</a> },
    { title: lang.Users.list.id, dataIndex: 'id', key: 'id', },
    { title: lang.Users.list.type, dataIndex: 'type', key: 'type' },
    {
      title: lang.Users.list.action, key: 'action',
      render: (text, record) => (
        <span>
          <Popconfirm title='确定删除吗？' onConfirm={()=>this.props.AppStateStore.UserState.del(record.id)}>
            <a href="javascript:;" >{lang.Users.list.delete}</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => { this.props.AppStateStore.UserState.showPermissions(record.id); }}>绑定权限</a>
        </span>
      ),
    }];

  state = {
    data: [],
    loadState: true,
    addVisible: false,
    bindModulesVisible: false,
    userId: '',
    modulesData: [],
    detailsVisible: false,
    PermissionsVisible: false,//权限模块显示开关
  }

  componentWillMount() {
    this.getData();
  }

  getData(value) {
    this.props.AppStateStore.UserState.getList(value);
  }
  

  hideModule = () => this.setState({ bindModulesVisible: false });


  render() {
    const Search = Input.Search;
    const {data,loadState,userId,
      addVisible,toggleAddVisible,
      detailsVisible,toggleDetailsVisible,dataDetails,
      permissionsVisible,togglePermissionsVisible
    } =this.props.AppStateStore.UserState;
    return (
      <div>
        <div style={{ marginBottom: 10, textAlign: 'right' }}>
          <Search enterButton placeholder="用户名" onPressEnter={e => this.getData(e.target.value)} onSearch={e => this.getData(e)} style={{ width: 200, marginRight: 8 }} />
          <Button type="primary" onClick={toggleAddVisible} icon='file-add' style={{ width: 50 }} />
        </div>
        <Modal
          title="详细信息"
          visible={detailsVisible}
          onCancel={toggleDetailsVisible}
          footer={false}
        >
          <TextArea rows={10} value={dataDetails} />
        </Modal>
        <Modal
          title="添加"
          visible={addVisible}
          onCancel={toggleAddVisible}
          footer={false}
        >
          <WrappedEditUser saveSuccessFn={() => { toggleAddVisible(); this.getData(); }} />
        </Modal>
        <Modal
          title="权限"
          visible={permissionsVisible}
          onCancel={togglePermissionsVisible}
          footer={false}
          width={600}
        >
          <Permissions userId={userId} SuccessFn={togglePermissionsVisible}/>
        </Modal>
        <Table rowKey={record => record.id} pagination={false} loading={loadState} columns={this.columns} dataSource={data} />
      </div>
    );
  }


}


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

export default Users;