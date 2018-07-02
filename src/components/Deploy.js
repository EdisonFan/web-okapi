import React, { Component } from 'react';
import { Table,  Divider, Button,  Modal,  message } from 'antd';
import deployService from '../service/deployService';
import SimpleContent from './SimpleContent';


class Deploy extends Component {
  columns = [{
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render: (text, record, index) => index + 1,
  }, {
    title: 'instId',
    dataIndex: 'instId',
    key: 'name',
  }, {
    title: 'srvcId',
    dataIndex: 'srvcId',
    key: 'id',
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>

        <a href="javascript:;" onClick={() => {
          this.delModule(record.srvcId,record.instId)
        }}>删除</a>
        <Divider type="vertical" />
        <a href="javascript:;" className="ant-dropdown-link">
          租客
        </a>
      </span>
    ),
  }];

  state = {
    data: [],
    loadState: true,
    AddModalVisible: false,
    AddDeployModalVisible: false,
    defaultDeployValue:`{
      "srvcId": "folio-hello-vertx-0.1-SNAPSHOT",
      "instId":"localhost-8080",
      "url":"http://localhost:8080"
    }`,
  }

  componentWillMount() {
    this.getModulesData();
  }
  async getModulesData() {
    let _r = await deployService.getList();
    this.setState({ data: _r, loadState: false })
  }
  async delModule(mid,instId) {
    let r = await deployService.del(mid,instId);
    message.info(r.toString(), 4)
  }
  render() {
    return (
      <div>
        <div style={{ margin: 10, textAlign: 'right' }}>
          <Button type="primary" onClick={() => { this.setState({ AddModalVisible: true }) }} style={{ marginRight: 8 }}>添加</Button>
          <Button type="primary" onClick={() => { this.getModulesData() }}>刷新</Button>
        </div>
        <Modal
          title="部署模块"
          visible={this.state.AddModalVisible}
          onOk={this.AddModalHandleOk}
          onCancel={() => this.setState({ AddModalVisible: false })}
          footer={false}
        >
          <SimpleContent
            defaultValue={this.state.defaultDeployValue}
            clearValue={!this.state.AddModalVisible} onClick={
              async (p) => {
                let r =  await deployService.save(p);
                message.info(r, 4)
              }
            } />
        </Modal>
        <Table pagination={false} loading={this.state.loadState} columns={this.columns} dataSource={this.state.data} />
      </div>
    )
  }
}

export default Deploy;