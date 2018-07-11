import React, { Component } from 'react';
import { Table, Divider, Button, Modal, message, Input, Tooltip, Badge, Row, Col } from 'antd';
import ModulesService from '../service/modulesService';
import SimpleContent from './SimpleContent.jsx';
import defaultValue from '../config/defalutValue';
import DeployService from '../service/deployService';
import { SERVICE_STATUS } from '../config/serviceConfig';
import eventProxy from 'react-eventproxy';

const { TextArea } = Input;
class Modules extends Component {
  columns = [
    { title: '序号', key: 'index', render: (t, r, i) => i + 1 },
    { title: '模块名称', dataIndex: 'name', render: (text, record, index) => <a href="javascript:;" onClick={this.showModuleDetails.bind(this, record.id)} >{text}</a> },
    { title: '模块ID', dataIndex: 'id' },
    {
      title: '操作', key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => { this.showDeploy(record); }}>部署</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={this.delModule.bind(this, record.id)}>删除</a>
        </span>
      ),
    }];

  state = {
    data: [],
    dataSearch: [],
    loadState: true,
    AddModalVisible: false,
    AddDeployModalVisible: false,
    ViewModalVisible: false,
    dataDetails: '',
    addDefaultValut: defaultValue.modules.add,
    ModuleId: '',
    deployDefaultValte: defaultValue.deploy.add,
    deployList: []
  }

  showDeploy = async (record) => {
    this.setState({ AddDeployModalVisible: true, ModuleId: record.id, deployList: [] });
    let _r = await DeployService.getHealthOne(record.id);
    if (_r.status===SERVICE_STATUS.ok) {
      this.setState({ deployList: _r.data });
    }

  }

  componentWillMount() {
    this.getModulesData();
  }
  // filtered is [12, 130, 44]
  render() {
    const Search = Input.Search;
    return (
      <div>
        <div style={{ margin: "10px 0", textAlign: 'right' }}>
          <Search enterButton placeholder="输入模块id" style={{ width: 200, marginRight: 8 }}
            onSearch={e => this.search(e)}
            onPressEnter={e => this.search(e.target.value)}
          />
          <Button type="primary" onClick={() => { this.setState({ AddModalVisible: true }); }} icon='file-add' style={{ width: 50 }} />
        </div>
        <Modal
          title="详细信息"
          visible={this.state.ViewModalVisible}
          onCancel={() => this.setState({ ViewModalVisible: false })}
          footer={false}
        >
          <TextArea rows={10} value={this.state.dataDetails} />
        </Modal>
        <Modal
          title="注册模块"
          visible={this.state.AddModalVisible}
          onOk={this.AddModalHandleOk}
          onCancel={() => this.setState({ AddModalVisible: false })}
          footer={false}
        >
          <SimpleContent
            defaultValue={this.state.addDefaultValut}
            clearValue={!this.state.AddModalVisible} onClick={this.addModule} />
        </Modal>
        <Modal
          title={`部署服务`}
          visible={this.state.AddDeployModalVisible}
          onOk={this.AddModalHandleOk}
          onCancel={() => this.setState({ AddDeployModalVisible: false })}
          footer={false}
        >
          <Row style={{ margin: 5 }}>
            <Col span={16} >{this.state.ModuleId + `(${this.state.deployList.length})`}</Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              {
                this.state.deployList.map(
                  (item, index) => (
                    <Tooltip key={index} placement="top" title={item.healthMessage}>
                      <Badge status={item.healthStatus ? 'success' : 'error'} />
                    </Tooltip>
                  )
                )
              }
            </Col>
          </Row>
          <SimpleContent
            defaultValue={this.state.deployDefaultValte(this.state.ModuleId)}
            clearValue={!this.state.AddDeployModalVisible} onClick={this.addDeployModule} />
        </Modal>
        <Table pagination={false} loading={this.state.loadState} columns={this.columns} dataSource={this.state.data} />
      </div>
    );
  }

  async showModuleDetails(moduleId) {
    this.setState({ dataDetails: '', loadState: true, ViewModalVisible: true });
    let _r = await ModulesService.getOne(moduleId);
    this.setState({ dataDetails: this.formatJson(JSON.stringify(_r)), loadState: false });
  }
  async getModulesData() {
    let _r = await ModulesService.getList();
    if(_r.status===SERVICE_STATUS.ok){
      this.setState({ data: _r.data, dataSearch: _r, loadState: false });
    }else{
      this.setState({ loadState: false });
      message.info(_r.message);
    }
  }
  delModule = async (id) => {
    let r = await ModulesService.del(id);
    if (r.status == 204) {
      message.info('success', 3);
      this.getModulesData();
    } else {
      message.info(`status:${r.status},message:${r.message}`, 4);
    }
  }
  addModule = async (p) => {
    let _r = await ModulesService.save(p);
    if(_r.status===SERVICE_STATUS.ok){
      this.getModulesData();
      message.info(_r.message);
      this.setState({ AddModalVisible: false });
    }else{
      message.info(_r.message);
    }
  }
  addDeployModule = async (p) => {
    let r = await ModulesService.deploySave(p);
    message.info(r, 4);
    this.getModulesData();
  }

  search = (value) => {
    let data = this.state.dataSearch.filter((item) => {
      return item.id.indexOf(value) > -1;
    });
    this.setState({ data });
  }
  formatJson = function (json, options) {
    var reg = null,
      formatted = '',
      pad = 0,
      PADDING = '    ';
    options = options || {};
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
    options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
    if (typeof json !== 'string') {
      json = JSON.stringify(json);
    } else {
      json = JSON.parse(json);
      json = JSON.stringify(json);
    }
    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n');
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n');
    reg = /\r\n\,/g;
    json = json.replace(reg, ',');
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
      reg = /\:\r\n\{/g;
      json = json.replace(reg, ':{');
      reg = /\:\r\n\[/g;
      json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
      reg = /\:/g;
      json = json.replace(reg, ':');
    }
    (json.split('\r\n')).forEach(function (node, index) {
      var i = 0,
        indent = 0,
        padding = '';

      if (node.match(/\{$/) || node.match(/\[$/)) {
        indent = 1;
      } else if (node.match(/\}/) || node.match(/\]/)) {
        if (pad !== 0) {
          pad -= 1;
        }
      } else {
        indent = 0;
      }

      for (i = 0; i < pad; i++) {
        padding += PADDING;
      }

      formatted += padding + node + '\r\n';
      pad += indent;
    }
    );
    return formatted;
  };

}

export default Modules;
