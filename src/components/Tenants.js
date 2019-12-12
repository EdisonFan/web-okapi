import React, { Component } from 'react';
import { Table, Divider, Button, Modal,  Switch, Icon, Popconfirm, Input } from 'antd';
import SimpleContent from './SimpleContent.jsx';
import { observer,inject } from 'mobx-react';
import WrappedEditUser from './EditUser';
@inject('AppStateStore')
@observer
class Tenants extends Component {
  columns = [
    { title: '序号', dataIndex: 'index', render: (t, r, i) => i + 1 },
    { title: '名称', dataIndex: 'name' },
    { title: 'ID', dataIndex: 'id' },
    { title: 'description', dataIndex: 'description' },
    {
      title: '操作', key: 'action',
      render: (text, record) => (
        <span>
          <Popconfirm title='确定删除吗？' onConfirm={this.props.AppStateStore.TenantState.del.bind(this, record.id)}>
            <a href="javascript:;" >删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={this.props.AppStateStore.TenantState.getModulesData.bind(this, record.id)}>绑定模块</a>
          {
            sessionStorage.getItem('x-okapi-tenant')?'':
          
          <a href="javascript:;" onClick={this.props.AppStateStore.TenantState.clickAddUser.bind(this,record.id)}>
          <Divider type="vertical" />
          添加管理员</a>
          }

        </span>
      ),
    }];
  modulesColumns = [
    { title: '序号', dataIndex: 'index', render: (t, r, i) => i + 1, width: 60, className: "center" },
    { title: '模块名称', dataIndex: 'name', width: 200 },
    { title: '模块ID', dataIndex: 'id', width: 200 },
    {
      title: '操作', key: 'action',
      render: (text, record) => (
        <span>
          <Switch onChange={
            checked => {
              checked ? this.props.AppStateStore.TenantState.bindModule(this.props.AppStateStore.TenantState.tenantId, record.id) :
               this.props.AppStateStore.TenantState.unBindModule(this.props.AppStateStore.TenantState.tenantId, record.id);
            }}
            checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}
            checked={record.bind} 
            disabled={this.props.AppStateStore.TenantState.loadState}
            />
        </span>
      ),
    }
  ];
  

  componentWillMount() {
    this.props.AppStateStore.TenantState.getList();
  }

  
  render() {
    const Search = Input.Search;
    const {data,add,loadState,search,addVisible,toggleAddVisible,addUserVisible,toggleAddUserVisible,bindModulesVisible,modulesData,toggleBindModulesVisible,tenantId} =this.props.AppStateStore.TenantState;
    return (
      <div>
        <div style={{ marginBottom: 10, textAlign: 'right' }}>
          <Search
            enterButton
            placeholder="租客名称"
            onSearch={e => search(e)}
            onPressEnter={e => search(e.target.value)}
            style={{ width: 200, marginRight: 8 }}
          />
          <Button type="primary" onClick={toggleAddVisible} icon='file-add' style={{ width: 50 }} />
        </div>
        <Modal
          title="添加"
          visible={addVisible}
          onCancel={toggleAddVisible}
          footer={false}
        >
          <SimpleContent
            defaultValue='{"id": "testlib", "name": "testlib","description": "testlib"}'
            clearValue={!addVisible} onClick={add} />
        </Modal>
        <Modal
          title="绑定模块"
          visible={bindModulesVisible}
          onCancel={toggleBindModulesVisible}
          footer={false}
          width={580}
          className='bindModules'
        >
          <Table scroll={{ y: 500 }} pagination={false} loading={loadState} columns={this.modulesColumns} dataSource={modulesData} />
        </Modal>
        <Modal
          title="添加管理员"
          visible={addUserVisible}
          onCancel={toggleAddUserVisible}
          footer={false}
        >{addUserVisible?
          <WrappedEditUser saveSuccessFn={() => { toggleAddUserVisible(); }} tenantId={tenantId} />
        :''
        }
        </Modal>
        <Table rowKey={(record)=>record.id} pagination={false} loading={loadState} columns={this.columns} dataSource={data} />
        
      </div>
    );
  }
}

export default Tenants;



