import React, { Component } from 'react';
import { Table,  Tooltip, Button,  Modal,  message ,Badge,Input } from 'antd';
import deployService from '../service/deployService';
import SimpleContent from './SimpleContent';
const uuidv1 = require('uuid/v1');
const { TextArea } = Input;

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
    render:(text,record)=><a href="javascript:;" onClick={this.showDetails.bind(this,record.srvcId,text)} >{text}</a>
  }, {
    title: 'srvcId',
    dataIndex: 'srvcId',
    key: 'id',
  }, {
    title: 'healthStatus',
    dataIndex: 'healthMessage',
    key: 'healthStatus',
    render: (text, record, index) => (
      record.healthStatus? 
      <Tooltip placement="top" title={record.healthMessage}><Badge status="success" text='OK' /></Tooltip>
      :
      <Tooltip placement="top" title={record.healthMessage}><Badge status="error" text='Fail'/></Tooltip>
    )
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>

        <a href="javascript:;" onClick={() => {
          this.delModule(record.srvcId,record.instId);
        }}>删除</a>
      </span>
    ),
  }];

  state = {
    data: [],
    loadState: true,
    AddModalVisible: false,
    AddDeployModalVisible: false,
    defaultDeployValue:`{
      "srvcId": "{srvcId}",
      "instId":"${uuidv1()}",
      "url":"http://localhost:8080"
    }`,
  }
  componentWillMount() {
    this.getModulesData();
  }
  async showDetails(moduleId,instanceId) {
    this.setState({ dataDetails: '', loadState: true, detailsVisible: true });
    let _r = await deployService.getOne(moduleId,instanceId);
    console.log('r',_r);
    
    this.setState({ dataDetails:JSON.stringify(_r), loadState: false });
  }
  async addModule(p){
    let r =  await deployService.save(p);
    message.info(r, 4);
    this.getModulesData();
  }

  async getModulesData() {
    this.setState({ loadState: true });
    let _r = await deployService.getHealth();
    this.setState({ data: _r, loadState: false });
  }
  async delModule(mid,instId) {
    let r = await deployService.del(mid,instId);
    if (r.status == 204) {
      message.info('success', 3);
      this.getModulesData();
    } else {
      message.info(`status:${r.status},message:${r.message}`, 4);
    }
  }
  render() {
    return (
      <div>
        <div style={{ margin: 10, textAlign: 'right' }}>
          <Button type="primary" onClick={() => { this.setState({ AddModalVisible: true }); }} style={{ marginRight: 8 }}>添加</Button>
          <Button type="primary" onClick={() => { this.getModulesData(); }}>刷新</Button>
        </div>
        <Table pagination={false} loading={this.state.loadState} columns={this.columns} dataSource={this.state.data} />
        <Modal
          title="详细信息"
          visible={this.state.detailsVisible}
          onCancel={() => this.setState({ detailsVisible: false })}
          footer={false}
        >
          <TextArea rows={10} value={this.state.dataDetails} />
        </Modal>
        <Modal
          title="部署模块"
          visible={this.state.AddModalVisible}
          onOk={this.AddModalHandleOk}
          onCancel={() => this.setState({ AddModalVisible: false })}
          footer={false}
        >
          <SimpleContent
            defaultValue={this.state.defaultDeployValue}
            clearValue={!this.state.AddModalVisible} onClick={this.addModule.bind(this)} />
        </Modal>
      </div>
    );
  }
}

export default Deploy;