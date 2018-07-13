import React, { Component } from 'react';
import { Table, Divider, Button, Modal, message, Switch, Icon, Popconfirm, Input } from 'antd';
import TenantsService from '../service/tenantsService';
import SimpleContent from './SimpleContent.jsx';
import ModulesService from '../service/modulesService';
import { SERVICE_STATUS } from '../config/serviceConfig';

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
          <Popconfirm title='确定删除吗？' onConfirm={this.del.bind(this, record.id)}>
            <a href="javascript:;" >删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={this.showModule.bind(this, record.id)}>绑定模块</a>
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
              checked ? this.bindModule(this.state.tenantId, record.id) : this.unBindModule(this.state.tenantId, record.id);
            }}
            checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}
            checked={record.bind} />
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
    modulesData: [],
  }

  componentWillMount() {
    this.getData();
  }
  async getData(tenantValue) {
    let _r = await TenantsService.getList();
    if(_r.status===SERVICE_STATUS.ok){
      this.setState({ data: _r.data, dataSearch: _r, loadState: false });
    }else{
      this.setState({ loadState: false });
      message.info(_r.message);
    }
  }
  async del(id) {
    let r = await TenantsService.del(id);
    if (r.status === 204) {
      message.info('success', 3);
      this.getData();
    } else {
      message.info(`status:${r.status},message:${r.message}`, 4);
    }
  }

  hideModule = () => this.setState({ bindModulesVisible: false });
  showModule = (tenantId) => {
    this.setState({ bindModulesVisible: true, tenantId });
    this.getModulesData(tenantId);
  }
  bindModule = async (tenantId, moduleId) => {
    let params = `{"id":"${moduleId}"}`;
    let _r = await TenantsService.bindModule(params, tenantId);
    if (_r.status == SERVICE_STATUS.ok) {
      message.info(_r.message);
      this.getModulesData(tenantId);
    } else {
      message.info(_r.message);
    }

    return false;
  }
  unBindModule = async (tenantId, moduleId) => {
    let _r = await TenantsService.unBindModule(tenantId, moduleId);
    if (_r.status == SERVICE_STATUS.ok) {
      this.getModulesData(tenantId);
    } else {
      message.info(_r.message);
    }
  }
  getModulesData = async (tenantId) => {
    this.setState({ loadState: true });
    let _allModules = await ModulesService.getList();
    let _tenModules = await ModulesService.getListByTanId(tenantId);
    if (_allModules.status === SERVICE_STATUS.ok) {
      _allModules.data.forEach(function (element, index, array) {
        element['bind'] = false;
        _tenModules.forEach((t_element, t_index, a) => {
          if (element['id'] == t_element['id']) {
            element['bind'] = true;
          }
        });
      });
      this.setState({ modulesData: _allModules.data, loadState: false });
    }else{
      message.info(_allModules.message);
    }
  }
  render() {
    const Search = Input.Search;

    return (
      <div>
        <div style={{ marginBottom: 10, textAlign: 'right' }}>
          <Search
            enterButton
            placeholder="租客名称"
            onSearch={e => this.search(e)}
            onPressEnter={e => this.search(e.target.value)}
            style={{ width: 200, marginRight: 8 }}
          />
          <Button type="primary" onClick={() => { this.setState({ AddModalVisible: true }); }} icon='file-add' style={{ width: 50 }} />
        </div>
        <Modal
          title="添加"
          visible={this.state.AddModalVisible}
          onCancel={() => this.setState({ AddModalVisible: false })}
          footer={false}
        >
          <SimpleContent
            defaultValue='{"id": "testlib", "name": "testlib","description": "testlib"}'
            clearValue={!this.state.AddModalVisible} onClick={this.addTenant()} />
        </Modal>
        <Modal
          title="绑定模块"
          visible={this.state.bindModulesVisible}
          onCancel={() => this.setState({ bindModulesVisible: false })}
          footer={false}
          width={580}
          className='bindModules'
        >
          <Table scroll={{ y: 500 }} pagination={false} loading={this.state.loadState} columns={this.modulesColumns} dataSource={this.state.modulesData} />
        </Modal>
        <Table rowKey={(record)=>record.id} pagination={false} loading={this.state.loadState} columns={this.columns} dataSource={this.state.data} />
      </div>
    );
  }



  search = (value) => {
    let data = this.state.dataSearch.filter((item) => {
      return item.name.indexOf(value) > -1;
    });
    this.setState({ data });
  }

  addTenant() {
    return async (p) => {
      let r = await TenantsService.save(p);
      message.info(r, 4);
      this.getData();
      this.setState({ AddModalVisible: false });
    };
  }
}

export default Tenants;



