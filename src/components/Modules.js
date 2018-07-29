import React, { Component } from 'react';
import { Table, Divider, Button, Modal, Input, Tooltip, Badge, Row, Col } from 'antd';
import SimpleContent from './SimpleContent.jsx';
import { observer, inject } from "mobx-react";
const { TextArea } = Input;

@inject("AppStateStore")
@observer
class Modules extends Component {
  columns = [
    { title: '序号', key: 'index', render: (t, r, i) => i + 1 },
    { title: '模块名称', dataIndex: 'name', render: (text, record, index) => <a onClick={()=>this.props.AppStateStore.ModuleState.getDetails(record.id)} >{text}</a> },
    { title: '模块ID', dataIndex: 'id' },
    {
      title: '操作', key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => this.props.AppStateStore.ModuleState.getDepolyHealth(record.id)}>部署</a>
          <Divider type="vertical" />
          <a onClick={() => this.props.AppStateStore.ModuleState.delModule(record.id)}>删除</a>
        </span>
      ),
    }];
  render() {
    const Search = Input.Search;
    const {
      data, loadState, addModalVisible,
      toggleAddModule, viewModalVisible,
      toggleViewModule, dataDetails,
      addDeployModalVisible, toggleAddDeployModal,search,
      deployList, ModuleId, addDeployModule, addModule,
      deployDefaultValue, addDefaultValut
    } = this.props.AppStateStore.ModuleState;
    return (
      <div>
        <div style={{ margin: "10px 0", textAlign: 'right' }}>
          <Search enterButton placeholder={'输入模块id'} style={{ width: 200, marginRight: 8 }}
            onSearch={e =>search(e)}
            onPressEnter={e => search(e.target.value)}
          />
          <Button type="primary" onClick={toggleAddModule} icon='file-add' style={{ width: 50 }} />
        </div>
        <Modal
          title="详细信息"
          visible={viewModalVisible}
          onCancel={toggleViewModule}
          footer={false}
        >
          <TextArea rows={10} value={dataDetails} />
        </Modal>
        <Modal
          title="注册模块"
          visible={addModalVisible}
          onCancel={toggleAddModule}
          footer={false}
        >
          <SimpleContent
            defaultValue={addDefaultValut}
            clearValue={!addModalVisible} onClick={(p) => addModule(p)} />
        </Modal>
        <Modal
          title={`部署服务`}
          visible={addDeployModalVisible}
          onCancel={toggleAddDeployModal}
          footer={false}
        >
          <Row style={{ margin: 5 }}>
            <Col span={16} >{ModuleId + `(${deployList.length})`}</Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              {
                deployList.map(
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
            defaultValue={deployDefaultValue}
            clearValue={!addDeployModalVisible} onClick={addDeployModule} />
        </Modal>
        <Table pagination={false} loading={loadState} columns={this.columns}
          dataSource={data}
        />
      </div>
    );
  }

  componentWillMount() {
    this.props.AppStateStore.ModuleState.getList();
  }

}

export default Modules;
