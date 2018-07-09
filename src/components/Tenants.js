import React, { Component } from 'react';
import { Table, Divider, Button, Modal, message, Switch, Icon, Popconfirm, Input } from 'antd';
import TenantsService from '../service/tenantsService';
import SimpleContent from './SimpleContent.jsx';
import ModulesService from '../service/modulesService';

class Tenants extends Component {
  columns = [{
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render: (text, record, index) => index + 1,
    
  }, {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="javascript:;">{text}</a>,
  }, {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: 'description',
    dataIndex: 'description',
    key: 'description',
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <Popconfirm title=''>
          <a href="javascript:;" onClick={() => {
            this.del(record.id);
          }}>删除</a>
        </Popconfirm>
        <Divider type="vertical" />
        <a href="javascript:;" onClick={() => {
          this.showModule(record.id);

        }}>绑定模块</a>

      </span>
    ),
  }];
  modulesColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (text, record, index) => index + 1 ,width:60, className: "center"},
    { title: '模块名称', dataIndex: 'name', key: 'name',width:200 },
    { title: '模块ID', dataIndex: 'id', key: 'id', width:200},
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
    this.setState({ data: _r, dataSearch: _r, loadState: false });
  }
  async del(id) {
    let r = await TenantsService.del(id);
    if (r.status == 204) {
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
    let r = await TenantsService.bindModule(params, tenantId);
    message.info(r.toString(), 3);
    this.getModulesData(tenantId);
    return false;
  }
  unBindModule = async (tenantId, moduleId) => {
    let r = await TenantsService.unBindModule(tenantId, moduleId);
    this.getModulesData(tenantId);
  }
  getModulesData = async (tenantId) => {
    this.setState({ loadState: true });
    let _allModules = await ModulesService.getList();
    let _tenModules = await ModulesService.getListByTanId(tenantId);
    _allModules.forEach(function (element, index, array) {
      element['bind'] = false;
      _tenModules.forEach((t_element, t_index, a) => {
        if (element['id'] == t_element['id']) {
          element['bind'] = true;
        }
      });

    });
    this.setState({ modulesData: _allModules, loadState: false });
  }
  render() {
    const Search = Input.Search;

    return (
      <div>
        <div style={{ margin: 10, textAlign: 'right' }}>
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
            clearValue={!this.state.AddModalVisible} onClick={
              async (p) => {
                let r = await TenantsService.save(p);
                this.getData();
                message.info(r, 4);
              }
            } />
        </Modal>
        <Modal
          title="绑定模块"
          visible={this.state.bindModulesVisible}
          onCancel={() => this.setState({ bindModulesVisible: false })}
          footer={false}
          width={580}
          className='bindModules'
        >
          <Table scroll={{  y: 500 }} pagination={false} loading={this.state.loadState} columns={this.modulesColumns} dataSource={this.state.modulesData} />
        </Modal>
        <Table pagination={false} loading={this.state.loadState} columns={this.columns} dataSource={this.state.data} />
      </div>
    );
  }



  search = (value) => {
    let data = this.state.dataSearch.filter((item) => {
      return item.name.indexOf(value) > -1;
    });
    this.setState({ data });
  }
}

export default Tenants;



