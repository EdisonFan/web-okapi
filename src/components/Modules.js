import React, { Component } from 'react';
import { Table, Divider, Button,  Modal,  message } from 'antd';
import ModulesService from '../service/modulesService';
import SimpleContent from './SimpleContent.jsx';


class Modules extends Component {
  columns = [{
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render: (text, record, index) => index + 1,
  }, {
    title: '模块名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="javascript:;">{text}</a>,
  }, {
    title: '模块ID',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a href="javascript:;" onClick={() => { this.setState({ AddDeployModalVisible: true, ModuleId: record.id }) }}>部署</a>
        <Divider type="vertical" />
        <a href="javascript:;" onClick={() => {
          this.delModule(record.id)
        }}>删除</a>
      </span>
    ),
  }];

  state = {
    data: [],
    loadState: true,
    AddModalVisible: false,
    AddDeployModalVisible: false,
    addDefaultValut:`
    {
      "id" : "folio-hello-vertx-0.1-SNAPSHOT",
      "name" : "Hello World",
      "provides" : [ {
        "id" : "hello",
        "version" : "1.1",
          "handlers" : [ {
            "methods" : [ "GET", "POST" ],
            "pathPattern" : "/hello"
          } ]
      } ]
    }
    `,
    deployDefaultValte:`
    {
      "srvcId" : "folio-hello-vertx-0.1-SNAPSHOT",
      "nodeId" : "localhost",
     "url":"http://localhost:8080"
    }`
  }

  componentWillMount() {
    this.getModulesData();
  }
  render() {
    return (
      <div>
        <div style={{ margin: 10, textAlign: 'right' }}>
          <Button type="primary" onClick={() => { this.setState({ AddModalVisible: true }) }} style={{ marginRight: 8 }}>添加</Button>
          <Button type="primary" onClick={() => { this.getModulesData() }}>刷新</Button>
        </div>
        <Modal
          title="注册模块"
          visible={this.state.AddModalVisible}
          onOk={this.AddModalHandleOk}
          onCancel={() => this.setState({ AddModalVisible: false })}
          footer={false}
        >
          <SimpleContent
            defaultValue={this.state.addDefaultValut}
            clearValue={!this.state.AddModalVisible} onClick={this.addModule}/>
        </Modal>
        <Modal
          title="部署模块"
          visible={this.state.AddDeployModalVisible}
          onOk={this.AddModalHandleOk}
          onCancel={() => this.setState({ AddDeployModalVisible: false })}
          footer={false}
        >
          <SimpleContent
            defaultValue={this.state.deployDefaultValte}
            clearValue={!this.state.AddDeployModalVisible} onClick={this.addDeployModule} />
        </Modal>
        <Table pagination={false} loading={this.state.loadState} columns={this.columns} dataSource={this.state.data} />
      </div>
    )
  }

  async getModulesData() {
    let _r = await ModulesService.getList();
    this.setState({ data: _r, loadState: false })
  }
  delModule=async (id)=> {
    let r = await ModulesService.del(id);
    if(r.status==204){
      message.info('success', 3)
      this.getModulesData();
    }else{
      message.info(`status:${r.status},message:${r.message}`,4);
    }
  }
  addModule=async(p)=>{
    let r = await ModulesService.save(p);
    message.info(r, 4);
    this.getModulesData();
  }
  addDeployModule=async(p)=>{
    let r = await ModulesService.deploySave(p);
    message.info(r, 4);
    this.getModulesData();
  }
}

export default Modules;
