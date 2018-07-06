import React, { Component } from 'react';
import { Table, Divider, Button, Modal, message,Switch, Icon,Popconfirm} from 'antd';
import UsersService from '../service/usersService';
import SimpleContent from './SimpleContent.jsx';

class Users extends Component {
    columns = [
        { title: '序号', dataIndex: 'index', key: 'index', render: (text, record, index) => index + 1 },
        { title: '名称', dataIndex: 'username', key: 'username', render: text => <a href="javascript:;">{text}</a> },
        { title: 'ID', dataIndex: 'id', key: 'id', },
        { title: 'type', dataIndex: 'type', key: 'type' },
        {
            title: '操作', key: 'action',
            render: (text, record) => (
                <span>
                    <Popconfirm title='确定删除吗？'>
                        <a href="javascript:;" onClick={() => { this.del(record.id) }}>删除</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <a href="javascript:;" onClick={() => { this.showModule(record.id); }}>绑定模块</a>
                </span>
            ),
        }];
    modulesColumns = [
      { title: '序号', dataIndex: 'index', key: 'index', render: (text, record, index) => index + 1 },
      { title: '模块名称', dataIndex: 'name', key: 'name', },
      { title: '模块ID', dataIndex: 'id', key: 'id', },
      {
        title: '操作', key: 'action',
        render: (text, record) => (
          <span>
              <Switch onChange={
                checked=>{
                  checked?this.bindModule(this.state.tenantId,record.id):this.unBindModule(this.state.tenantId,record.id)
                }} 
                checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} 
                checked ={record.bind}/>
          </span>
        ),
      }
    ];
    state = {
      data: [],
      loadState: true,
      AddModalVisible: false,
      bindModulesVisible: false,
      tenantId: '',
      tttx: '{\n"id":"mod-mymodule-1.0.0"\r\n}',
      modulesData:[],
    }
  
    componentWillMount() {
      this.getData();
    }
    async getData() {
      let _r = await UsersService.getList();
      this.setState({ data: _r, loadState: false });
    }
    async del(id) {
      let r = await UsersService.del(id);
      if (r.status == 204) {
        message.info('success', 3)
        this.getData();
      } else {
        message.info(`status:${r.status},message:${r.message}`, 4);
      }
    }
  
    hideModule=()=>this.setState({ bindModulesVisible: false});
    showModule=(tenantId)=>{
      this.setState({ bindModulesVisible: true, tenantId});
      this.getModulesData(tenantId);
    }
    bindModule=async(tenantId,moduleId)=>{
      let params=`{"id":"${moduleId}"}`;
      let r =await UsersService.bindModule(params,tenantId);
      message.info(r.toString(), 3);
      this.getModulesData(tenantId);
      return false;
    }
    unBindModule=async (tenantId,moduleId)=>{
      let r=await UsersService.unBindModule(tenantId,moduleId)
      this.getModulesData(tenantId);
    }
    getModulesData=async(tenantId)=>{
       
    }
    render() {
      return (
        <div>
          <div style={{ margin: 10, textAlign: 'right' }}>
            <Button type="primary" onClick={() => { this.setState({ AddModalVisible: true }) }} style={{ marginRight: 8 }}>添加</Button>
            <Button type="primary" onClick={() => { this.getData() }}>刷新</Button>
          </div>
          <Modal
            title="添加"
            visible={this.state.AddModalVisible}
            onCancel={() => this.setState({ AddModalVisible: false })}
            footer={false}
          >
            <SimpleContent
              defaultValue='{"id": "testlib", "name": "testlib","description": "testlib"}'
              clearValue={!this.state.AddModalVisible} onClick={
                async (p) => {
                  let r = await UsersService.save(p);
                  this.getData()
                  message.info(r, 4)
                }
              } />
          </Modal>
          <Modal
            title="绑定模块"
            visible={this.state.bindModulesVisible}
            onCancel={() => this.setState({ bindModulesVisible: false })}
            footer={false}
            width={550}
          >
            <Table rowKey={'id'} pagination={false} loading={this.state.loadState} columns={this.modulesColumns} dataSource={this.state.modulesData} />
  
            {/* <SimpleContent
              defaultValue={this.state.tttx}
              clearValue={!this.state.bindModulesVisible} onClick={
                async (p) => {
                  let r = await UsersService.bindModule(p, this.state.tenantId);
                  message.info(r.toString(), 3);
                }
              } /> */}
          </Modal>
          <Table pagination={false} loading={this.state.loadState} columns={this.columns} dataSource={this.state.data} />
        </div>
      )
    }
  
  
  }
  
  export default Users;