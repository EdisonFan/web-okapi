import React, { Component } from 'react';
import { Table, Tooltip, Button, Modal, Badge, Input, Popconfirm } from 'antd';
import SimpleContent from './SimpleContent';
import { observer, inject } from "mobx-react";
const { TextArea } = Input;
const Search = Input.Search;

@inject("AppStateStore")
@observer
class Deploy extends Component {
  columns = [
    { title: '序号', dataIndex: 'index', render: (text, record, index) => index + 1 },
    {
      title: 'instId', dataIndex: 'instId', key: 'name',
      render: (text, record) => <a href="javascript:;" onClick={() => this.props.AppStateStore.DeployState.getDetails(record.srvcId, text)} >{text}</a>
    },
    { title: 'srvcId', dataIndex: 'srvcId', key: 'id' },
    {
      title: 'healthStatus',
      dataIndex: 'healthMessage',
      key: 'healthStatus',
      render: (text, record, index) => (
        record.healthStatus ?
          <Tooltip placement="top" title={record.healthMessage}><Badge status="success" text='OK' /></Tooltip>
          :
          <Tooltip placement="top" title={record.healthMessage}><Badge status="error" text='Fail' /></Tooltip>
      )
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Popconfirm title='确定删除吗？' onConfirm={() => this.props.AppStateStore.DeployState.del(record.srvcId, record.instId)}>
            <a href="javascript:;" >删除</a> </Popconfirm>
        </span>
      ),
    }];

  componentWillMount() {
    this.props.AppStateStore.DeployState.getList();
  }

  render() {
    const {
      add, loadState, data, search,
      addVisible, toggleAddVisible,
      dataDetails, detailsVisible,
      toggleDetailsVisible
    } = this.props.AppStateStore.DeployState;
    return (
      <div>
        <div style={{ marginBottom: 10, textAlign: 'right' }}>
          <Search enterButton placeholder="模块id" onPressEnter={e => search(e.target.value)} onSearch={e => search(e)} style={{ width: 200, marginRight: 8 }} />
          <Button type="primary" onClick={toggleAddVisible} icon='file-add' style={{ width: 50 }} />
        </div>
        <Table pagination={false} loading={loadState} columns={this.columns} dataSource={data} />
        <Modal
          title="详细信息"
          visible={detailsVisible}
          onCancel={toggleDetailsVisible}
          footer={false}
        >
          <TextArea rows={10} value={dataDetails} />
        </Modal>
        <Modal
          title="部署模块"
          visible={addVisible}
          onCancel={toggleAddVisible}
          footer={false}
        >
          <SimpleContent clearValue={!addVisible} onClick={add} />
        </Modal>
      </div>
    );
  }


}

export default Deploy;