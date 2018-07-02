import React, { Component } from 'react';
import { Table, Divider, Button,  Modal,  message } from 'antd';
import TenantsService from '../service/tenantsService';
import SimpleContent from './SimpleContent.jsx';

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
        <a href="javascript:;" onClick={() => {
          this.del(record.id)
        }}>删除</a>
        <Divider type="vertical" />
        <a href="javascript:;" onClick={() => {
          this.bindModule(record.id)
        }}>绑定模块</a>

      </span>
    ),
  }];

  state = {
    data: [],
    loadState: true,
    AddModalVisible: false,
    bindModulesVisible: false,
    tenantId: '',
    tttx: '{\n"id":"mod-mymodule-1.0.0"\r\n}'
  }

  componentWillMount() {
    this.getModulesData();
  }
  async getModulesData() {
    let _r = await TenantsService.getList();
    this.setState({ data: _r, loadState: false })
  }
  async del(id) {
    let r = await TenantsService.del(id);
    message.info(r.toString(), 4)
  }
  bindModule(id) {
    this.setState({ bindModulesVisible: true, tenantId: id })
  }
  render() {
    return (
      <div>
        <div style={{ margin: 10, textAlign: 'right' }}>
          <Button type="primary" onClick={() => { this.setState({ AddModalVisible: true }) }} style={{ marginRight: 8 }}>添加租客</Button>
          <Button type="primary" onClick={() => { this.getModulesData() }}>刷新</Button>
        </div>
        <Modal
          title="添加"
          visible={this.state.AddModalVisible}
          onOk={this.AddModalHandleOk}
          onCancel={() => this.setState({ AddModalVisible: false })}
          footer={false}
        >
          <SimpleContent
            defaultValue='{"id": "testlib", "name": "testlib","description": "testlib"}'
            clearValue={!this.state.AddModalVisible} onClick={
              async (p) => {
                let r = await TenantsService.save(p);
                message.info(r, 4)
              }
            } />
        </Modal>
        <Modal
          title="绑定模块"
          visible={this.state.bindModulesVisible}
          onCancel={() => this.setState({ bindModulesVisible: false })}
          footer={false}
        >
          <SimpleContent
            defaultValue={this.state.tttx}
            clearValue={!this.state.bindModulesVisible} onClick={
              async (p) => {
                let r = await TenantsService.bindModule(p, this.state.tenantId);
                message.info(r.toString(), 3);
              }
            } />
        </Modal>
        <Table pagination={false} loading={this.state.loadState} columns={this.columns} dataSource={this.state.data} />
      </div>
    )
  }


}

export default Tenants;



